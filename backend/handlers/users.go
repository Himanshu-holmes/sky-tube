package handlers

import (
	"encoding/json"
	"fmt"
	"os"

	"time"

	"net/http"

	"github.com/Himanshu-holmes/sky-tube/config"
	models "github.com/Himanshu-holmes/sky-tube/model"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"go.mongodb.org/mongo-driver/mongo"

	"go.mongodb.org/mongo-driver/mongo/options"

	// models "github.com/Himanshu-holmes/sky-tube/model"
	"github.com/Himanshu-holmes/sky-tube/utils"
)

/**
 * Register a new user.
 *
 * POST /api/v1/users/register
 */
func RegisterUser(w http.ResponseWriter, r *http.Request) {
	fullname := r.FormValue("fullName")
	username := r.FormValue("username")
	email := r.FormValue("email")
	password := r.FormValue("password")

	avatarFile, avatarHeaders, err := r.FormFile("avatar")
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading avatar image: %v", err))
		return
	}
	defer avatarFile.Close()

	coverImageFile, coverImageHeaders, err := r.FormFile("coverImage")
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading cover image: %v", err))
		return
	}
	defer coverImageFile.Close()

	// Upload images
	aImgUrl, err := utils.UploadImage(r.Context(), avatarFile, avatarHeaders)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading avatar image: %v", err))
		return
	}

	cImgUrl, err := utils.UploadImage(r.Context(), coverImageFile, coverImageHeaders)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading cover image: %v", err))
		return
	}

	// Check if user exists
	var result models.User
	filter := bson.M{"email": email}
	project := bson.M{"email": 1}
	collection, err := models.GetUser(r.Context(), filter, project, &result)
	// fmt.Printf("\nexistingUser: %+v\n", collection)
	// fmt.Printf(("\n result: %+v\n"), result)

	if result.Email == email {
		utils.RespondWithError(w, 400, fmt.Sprintf("User already exists with email %v", email))
		return
	}

	if err != nil && err != mongo.ErrNoDocuments {
		utils.RespondWithError(w, 500, fmt.Sprintf("Database error: %v", err))
		return
	}

	if result.Email == email {
		utils.RespondWithError(w, 400, fmt.Sprintf("User already exists with email %v", email))
		return
	}

	// Create user
	user := models.User{
		FullName:   fullname,
		Username:   username,
		Email:      email,
		Password:   password,
		Avatar:     aImgUrl,
		CoverImage: cImgUrl,
	}
	err = user.HashPassword()
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in hashing password %v", err))
		return
	}

	newUser, err := user.Save(r.Context(), collection)
	fmt.Printf("\nnewUser: %+v\n", newUser)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in inserting user %v", err.Error()))
		return
	}

	utils.RespondWithJson(w, 200, 200, map[string]interface{}{
		"fullName":   fullname,
		"username":   username,
		"email":      email,
		"avatar":     aImgUrl,
		"coverImage": cImgUrl,
	}, "User registered successfully")
}

/**
 * Log in a user.
 *
 * POST /api/users/login
 */
func LoginUser(w http.ResponseWriter, r *http.Request) {

	defer r.Body.Close()
	type LoginRequest struct {
		Email    string `json:"email"`
		Username string `json:"username"`
		Password string `json:"password"`
	}
	type UserResponse struct {
		ID           primitive.ObjectID   `json:"id"`
		Username     string               `json:"username"`
		Email        string               `json:"email"`
		FullName     string               `json:"fullName"`
		Avatar       string               `json:"avatar"`
		CoverImage   string               `json:"coverImage,omitempty"`
		WatchHistory []primitive.ObjectID `json:"watchHistory,omitempty"`
		CreatedAt    time.Time            `json:"createdAt,omitempty"`
		UpdatedAt    time.Time            `json:"updatedAt,omitempty"`
	}

	type LoginResponse struct {
		User         UserResponse `json:"user"`
		AccessToken  string       `json:"accessToken"`
		RefreshToken string       `json:"refreshToken"`
	}

	var result LoginRequest
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&result); err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("something wrong : %v", err))
	}
	collection := config.GetCollection("users")
	filter := bson.M{"email": result.Email}
	project := bson.M{"email": 1, "username": 1, "fullName": 1, "password": 1, "avatar": 1, "coverImage": 1, "watchHistory": 1, "createdAt": 1, "updatedAt": 1}
	opts := options.FindOne().SetProjection(project)
	err := collection.FindOne(r.Context(), filter, opts).Decode(&user)

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("error in finding user %v", err))
		return
	}
	if user.Email == "" {
		utils.RespondWithError(w, 400, fmt.Sprintf("user with email %v does not exist", result.Email))
		return
	}
	// fmt.Println("user", user)
	if err := user.IsPasswordCorrect(result.Password); err != nil {
		utils.RespondWithError(w, 400, "password is incorrect ")
		return
	}
	accessToken, err := user.GenerateAccessToken()
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("error in generating access token %v", err))
		return
	}

	refreshToken, err := user.GenerateRefreshToken()
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("error in generating refresh token %v", err))
		return
	}
	// save refresh token in db
	user.AccessToken = accessToken
	user.RefreshToken = refreshToken
	tokenUpdate, err := user.SaveRefreshTokenAndAccessToken(r.Context(), collection)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("error in updating token %v", err))
		return
	}
	fmt.Println("tokenUpdate Result", tokenUpdate)

	userResponse := UserResponse{
		ID:           user.ID,
		Username:     user.Username,
		Email:        user.Email,
		FullName:     user.FullName,
		Avatar:       user.Avatar,
		CoverImage:   user.CoverImage,
		WatchHistory: user.WatchHistory,
		CreatedAt:    user.CreatedAt,
		UpdatedAt:    user.UpdatedAt,
	}
	loginResponse := LoginResponse{
		User:         userResponse,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "accessToken",
		Value:   accessToken,
		Expires: time.Now().Add(time.Hour * 24),
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "refreshToken",
		Value:   refreshToken,
		Expires: time.Now().Add(time.Hour * 24 * 7),
	})

	utils.RespondWithJson(w, 200, 200, loginResponse, "User logged in successfully")
}

func LogOutUser(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:    "accessToken",
		Value:   "",
		Expires: time.Now().Add(-time.Hour),
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "refreshToken",
		Value:   "",
		Expires: time.Now().Add(-time.Hour),
	})

	utils.RespondWithJson(w, 200, 200, nil, "User logged out successfully")
}

/**
 * get the current user .
 *
 * POST /api/users/getCurrentUser
 */
func GetUserHandler(w http.ResponseWriter, r *http.Request) {
	// get userId from context
	userId, ok := r.Context().Value("userId").(string)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}
	objId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}
	collection := config.GetCollection("users")
	filter := bson.M{"_id": objId}
	var user models.User
	if err := collection.FindOne(r.Context(), filter).Decode(&user); err != nil {
		if err == mongo.ErrNoDocuments {
			utils.RespondWithError(w, http.StatusUnauthorized, "invalid token")
		} else {
			utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		}
		return
	}
	// json structure of user
	type userResponse struct {
		ID           primitive.ObjectID   `json:"id"`
		Username     string               `json:"username"`
		Email        string               `json:"email"`
		FullName     string               `json:"fullName"`
		Avatar       string               `json:"avatar"`
		CoverImage   string               `json:"coverImage,omitempty"`
		WatchHistory []primitive.ObjectID `json:"watchHistory,omitempty"`
		CreatedAt    time.Time            `json:"createdAt,omitempty"`
		UpdatedAt    time.Time            `json:"updatedAt,omitempty"`
	}
	userResponseJson := userResponse{
		ID:           user.ID,
		Username:     user.Username,
		Email:        user.Email,
		FullName:     user.FullName,
		Avatar:       user.Avatar,
		CoverImage:   user.CoverImage,
		WatchHistory: user.WatchHistory,
		CreatedAt:    user.CreatedAt,
		UpdatedAt:    user.UpdatedAt,
	}
	utils.RespondWithJson(w, http.StatusOK, 200, userResponseJson, "user found successfully")

}

func GetRefreshToken(w http.ResponseWriter, r *http.Request) {
	/*
		Step 1: Get the refresh token from the cookie, request body, or headers
		Step 2: Verify the incoming refresh token against the secret
		Step 3: Get the userId from the verified refresh token
		Step 4: Find the user in the database using the userId
		Step 5: Ensure the incoming refresh token matches the stored refresh token
		Step 6: Generate new access and refresh tokens
		Step 7: Set the new tokens in cookies and send the response
	*/
	// get refresh token from cookie
	incomingRefreshToken := getRefreshTokenFromRequestBdy(r)
	if incomingRefreshToken == "" {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid token plz login again")
		return
	}
	// verify the incoming refresh token
	secret := []byte(os.Getenv("REFRESH_TOKEN_SECRET"))
	refreshToken, err := jwt.Parse(incomingRefreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secret, nil
	})
	if err != nil || !refreshToken.Valid {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid refresh token plz login again")
		return
	}
	claims, ok := refreshToken.Claims.(jwt.MapClaims)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid refresh token")
		return
	}
	userId, ok := claims["_id"].(string)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid refresh token")
		return
	}
	objId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid refresh token id")
		return
	}
	collection := config.GetCollection("users")
	filter := bson.M{"_id": objId}
	project := bson.M{"_id": 1, "refreshToken": 1, "accessToken": 1}
	opts := options.FindOne().SetProjection(project)
	var user models.User
	if err := collection.FindOne(r.Context(), filter, opts).Decode(&user); err != nil {
		if err == mongo.ErrNoDocuments {
			utils.RespondWithError(w, http.StatusUnauthorized, "No user found or invalid refresh token")
		} else {
			utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		}
		return
	}
	if user.RefreshToken != incomingRefreshToken {
		fmt.Println("user.RefreshToken", user.RefreshToken)
		fmt.Println("incomingRefreshToken", incomingRefreshToken)
		utils.RespondWithError(w, http.StatusUnauthorized, "Refersh Token dosen't match might be expierd or used , Try Login Again")
		return
	}
	accessToken, err := user.GenerateAccessToken()
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		return
	}
	newRefreshToken, err := user.GenerateRefreshToken()
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		return
	}
	user.AccessToken = accessToken
	user.RefreshToken = newRefreshToken
	tokenUpdate, err := user.SaveRefreshTokenAndAccessToken(r.Context(), collection)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		return
	}
	fmt.Println("tokenUpdate", tokenUpdate)
	http.SetCookie(w, &http.Cookie{
		Name:    "accessToken",
		Value:   accessToken,
		Expires: time.Now().Add(time.Hour * 24),
	})
	http.SetCookie(w, &http.Cookie{
		Name:    "refreshToken",
		Value:   newRefreshToken,
		Expires: time.Now().Add(time.Hour * 24 * 7),
	})
	utils.RespondWithJson(w, http.StatusOK, 200, map[string]interface{}{
		"accessToken":  accessToken,
		"refreshToken": newRefreshToken,
	}, "Token Refreshed Successfully")

}
func getRefreshTokenFromRequestBdy(r *http.Request) string {
	cookie, err := r.Cookie("refreshToken")
	if err == nil {
		return cookie.Value
	}
	var body struct {
		RefreshToken string `json:"refreshToken"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err == nil {
		return body.RefreshToken
	}
	token := r.Header.Get("refreshToken")
	if token != "" {
		return token
	}
	return ""

}

/**
 * Change the current user's password.
 *
 * POST /api/users/change-password
 */
func ChangePassword(w http.ResponseWriter, r *http.Request) {
	// Step 1: Get user id from the request as the user is authenticated
	// Step 2: Find user from the database using the user id
	// Step 3: Compare oldPassword with the user's current password in the database
	// Step 4: If the user is not found, throw a 404 error
	// Step 5: If the old password is incorrect, throw a 400 error
	// Step 6: Set the new password for the user
	// Step 7: Save the user with the new password (validateBeforeSave set to false to bypass validation)
	// Step 8: Respond with a success message and the new password
	var body struct {
		OldPassword string `json:"oldPassword"`
		NewPassword string `json:"newPassword"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "invalid request")
		return
	}
	userId, ok := r.Context().Value("userId").(string)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}
	objId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}
	// fmt.Println("objId",objId)
	collection := config.GetCollection("users")
	filter := bson.M{"_id": objId}
	project := bson.M{"_id": 1, "password": 1}
	opts := options.FindOne().SetProjection(project)
	var user models.User
	if err := collection.FindOne(r.Context(), filter, opts).Decode(&user); err != nil {
		if err == mongo.ErrNoDocuments {
			utils.RespondWithError(w, http.StatusNotFound, "please login again")
		} else {
			utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		}
		return
	}
	if err := user.IsPasswordCorrect(body.OldPassword); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "old password is incorrect")
		return
	}
	user.Password = body.NewPassword
	if err := user.HashPassword(); err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		return
	}
	updateResult, err := collection.UpdateOne(r.Context(), filter, bson.M{"$set": bson.M{"password": user.Password}})
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		return
	}
	fmt.Println("updateResult", updateResult)
	utils.RespondWithJson(w, http.StatusOK, 200, nil, "password changed successfully")

}

/**
 * Update user account details.
 *
 * POST /api/users/update-account
 */

func UpdateAccount(w http.ResponseWriter, r *http.Request) {
	/*
	   Step 1: Get data from req.body and validate
	   Step 2: Use updateUserDetailsValidation to validate the request body.
	   Step 3: If validation fails, throw a 400 error with the validation message.
	*/
	var body struct {
		FullName string `json:"fullName"`
		Email    string `json:"email"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "invalid request")
		return
	}
	//  check type of fullName and email
	if body.FullName == "" || body.Email == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "please provide fullName and email")
		return
	}
	userId, ok := r.Context().Value("userId").(string)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}
	objId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}
	collection := config.GetCollection("users")
	filter := bson.M{"_id": objId}
	update := bson.M{"$set": bson.M{"fullName": body.FullName, "email": body.Email}}
	updateResult, err := collection.UpdateOne(r.Context(), filter, update)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		return
	}
	fmt.Println("updateResult", updateResult)
	utils.RespondWithJson(w, http.StatusOK, 200, nil, "account updated successfully")

}

/**
 * Update user avatar.
 *
 * PATCH /api/users/update-avatar
 */
func UpdateUserAvatar(w http.ResponseWriter, r *http.Request) {
	/*
	   Step 1: Get userId from the authenticated user in the request
	   Step 2: Get avatarLocalPath from req.file, which is provided by multer middleware
	   Step 3: Find user by userId
	   Step 4: Get the oldAvatarUrl from the user in the database
	   Step 5: Delete the old avatar file from Cloudinary
	   Step 6: Upload the new avatar to Cloudinary
	   Step 7: Update the user's avatar URL in the database
	   Step 8: Send the response with the updated user details

	*/
	userId, ok := r.Context().Value("userId").(string)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Plz login again")
		return
	}
	objId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Plz login again")
		return
	}
	collection := config.GetCollection("users")
	filter := bson.M{"_id": objId}
	project := bson.M{"_id": 1, "avatar": 1}
	opts := options.FindOne().SetProjection(project)
	var user models.User
	if err := collection.FindOne(r.Context(), filter, opts).Decode(&user); err != nil {
		if err == mongo.ErrNoDocuments {
			utils.RespondWithError(w, http.StatusNotFound, "please login again")
		} else {
			utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		}
		return
	}
	avatarFile, avatarHeaders, err := r.FormFile("avatar")
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading avatar image: %v", err))
		return
	}
	defer avatarFile.Close()
	// Upload images
	avtImgUrl, err := utils.UploadImage(r.Context(), avatarFile, avatarHeaders)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading avatar image: %v", err))
		return
	}
	// delete old avatar
	if user.Avatar != "" {
		if err := utils.DeleteCloudinaryImage(r.Context(), user.Avatar); err != nil {
			utils.RespondWithError(w, 400, fmt.Sprintf("Error in deleting avatar image: %v", err))
			return
		}
	}
	// update new avatar
	update := bson.M{"$set": bson.M{"avatar": avtImgUrl}}
	updateResult, err := collection.UpdateOne(r.Context(), filter, update)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		return
	}
	fmt.Println("updateResult", updateResult)
	utils.RespondWithJson(w, http.StatusOK, 200, nil, "avatar updated successfully")

}

/**
 * Update user avatar.
 *
 * PATCH /api/users/update-coverImage
 */
func UpdateUserCoverImage(w http.ResponseWriter, r *http.Request) {
	/*
	   Step 1: Get userId from the authenticated user in the request
	   Step 2: Get coverImageLocalPath from req.file, which is provided by multer middleware
	   Step 3: Find user by userId
	   Step 4: Get the oldCoverImageUrl from the user in the database
	   Step 5: Delete the old avatar file from Cloudinary
	   Step 6: Upload the new avatar to Cloudinary
	   Step 7: Update the user's avatar URL in the database
	   Step 8: Send the response with the updated user details

	*/
	userId, ok := r.Context().Value("userId").(string)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Plz login again")
		return
	}
	objId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "Please login again")
		return
	}
	collection := config.GetCollection("users")
	filter := bson.M{"_id": objId}
	project := bson.M{"_id": 1, "coverImage": 1}
	opts := options.FindOne().SetProjection(project)
	var user models.User
	if err := collection.FindOne(r.Context(), filter, opts).Decode(&user); err != nil {
		if err == mongo.ErrNoDocuments {
			utils.RespondWithError(w, http.StatusNotFound, "please login again")
		} else {
			utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		}
		return
	}
	coverImageFile, coverImageHeaders, err := r.FormFile("coverImage")
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading cover image: %v", err))
		return
	}
	defer coverImageFile.Close()
	// Upload images
	cvrImgUrl, err := utils.UploadImage(r.Context(), coverImageFile, coverImageHeaders)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading cover image: %v", err))
		return
	}
	// delete old coverImage
	if user.CoverImage != "" {
		if err := utils.DeleteCloudinaryImage(r.Context(), user.CoverImage); err != nil {
			utils.RespondWithError(w, 400, fmt.Sprintf("Error in deleting cover image: %v", err))
			return
		}
	}
	// update new coverImage
	update := bson.M{"$set": bson.M{"coverImage": cvrImgUrl}}
	updateResult, err := collection.UpdateOne(r.Context(), filter, update)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		return
	}
	fmt.Println("updateResult", updateResult)
	utils.RespondWithJson(w, http.StatusOK, 200, nil, "coverImage updated successfully")
	
}
