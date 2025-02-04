package handlers

import (
	
	"encoding/json"
	"fmt"
	
	"time"

	"net/http"

	"github.com/Himanshu-holmes/sky-tube/config"
	models "github.com/Himanshu-holmes/sky-tube/model"
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
	aImgUrl, err := utils.UploadImage(avatarFile, avatarHeaders)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading avatar image: %v", err))
		return
	}

	cImgUrl, err := utils.UploadImage(coverImageFile, coverImageHeaders)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading cover image: %v", err))
		return
	}

	

	// Check if user exists
	var result models.User
	filter := bson.M{"email": email}
	project := bson.M{"email": 1}
	collection,err := models.GetUser(r.Context(), filter, project, &result)
	fmt.Printf("\nexistingUser: %+v\n", collection)
	fmt.Printf(("\n result: %+v\n"), result)

	if result.Email == email {
		utils.RespondWithError(w,400, fmt.Sprintf("User already exists with email %v", email))
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
	project := bson.M{"email": 1, "username": 1, "fullName": 1,"password":1, "avatar": 1, "coverImage": 1, "watchHistory": 1, "createdAt": 1, "updatedAt": 1}
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
	fmt.Println("user", user)
	if err:= user.IsPasswordCorrect(result.Password); err!=nil  {
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

func GetUserHandler(w http.ResponseWriter, r *http.Request){
	// get userId from context
	userId,ok := r.Context().Value("userId").(string)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}
	objId,err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		utils.RespondWithError(w, http.StatusUnauthorized, "invalid token")
		return
	}
	collection := config.GetCollection("users")
	filter := bson.M{"_id":objId}
	var user models.User
	if err := collection.FindOne(r.Context(),filter).Decode(&user); err!= nil {
		if err ==  mongo.ErrNoDocuments {
			utils.RespondWithError(w, http.StatusUnauthorized, "invalid token")
		}else{
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
	utils.RespondWithJson(w, http.StatusOK, 200,userResponseJson , "user found successfully")

}