package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"mime/multipart"

	"os"
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
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/google/uuid"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {

	type parameters struct {
		Fullname   string `json:"fullName"`
		Username   string `json:"username"`
		Email      string `json:"email"`
		Password   string `json:"password"`
		Avatar     string `json:"avatar"`
		CoverImage string `json:"coverImage"`
	}

	fullname := r.FormValue("fullName")
	username := r.FormValue("username")
	email := r.FormValue("email")
	password := r.FormValue("password")
	avatarFile, avatarHeaders, err := r.FormFile("avatar")
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("error in uploading image %v", err))
	}
	coverImageFile, coverImageHeaders, err := r.FormFile("coverImage")
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("error in uploading image %v", err))
	}

	defer avatarFile.Close()
	defer coverImageFile.Close()
	defer r.Body.Close()
	// save avatar in local
	aImgUrl, err := uploadImage(avatarFile, avatarHeaders)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("error in uploading image %v", err))
	}
	// save coverImage in local
	cImgUrl, err := uploadImage(coverImageFile, coverImageHeaders)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("error in uploading image %v", err))
	}

	fmt.Println("cImgUrl", cImgUrl)
	var result models.User

	collection := config.GetCollection("users")
	fmt.Println("collection", collection)
	filter := bson.D{{"email", email}}
	project := bson.D{{"email", 1}}
	opts := options.FindOne().SetProjection(project)
	err = collection.FindOne(context.Background(), filter, opts).Decode(&result)
	fmt.Println("error", err)
	fmt.Println("mongo no doc err", mongo.ErrNoDocuments)
	fmt.Println("err = mongo.ErrNoDocuments", err == mongo.ErrNoDocuments)
	if err == nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("User already exists with email %v", email))
		return
	}
	fmt.Println("result", result)
	if result.Email == email {
		utils.RespondWithError(w, 400, fmt.Sprintf("user with email %v already exists", email))
		return
	}
	
	user := models.User{
		FullName:   fullname,
		Username:   username,
		Email:      email,
		Password:   password,
		Avatar:     aImgUrl,
		CoverImage: cImgUrl,
	}
	err =user.HashPassword()
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("error in hashing password %v", err))
		return
	}
	newUser, err := user.Save(context.Background(), collection)
	println("newUser", newUser.InsertedID)

	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("error in inserting user %v", err.Error()))
		return
	}

	utils.RespondWithJson(w, 200, 200, parameters{
		Fullname:   fullname,
		Username:   username,
		Email:      email,
		Password:   password,
		Avatar:     aImgUrl,
		CoverImage: cImgUrl,
	}, "User registered successfully")

}

func uploadImage(file multipart.File, handler *multipart.FileHeader) (string, error) {
	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		if mkDirErr := os.Mkdir("uploads", os.ModePerm); mkDirErr != nil {

			return "", mkDirErr
		}
	}
	uniqueFileName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), handler.Filename)

	dst, _ := os.Create("uploads/" + uniqueFileName)
	defer dst.Close()
	_, err := io.Copy(dst, file)
	if err != nil {
		return "", err
	}
	var ctx = context.Background()
	cld, err := config.SetupCloudinary()
	if err != nil {
		return "", err
	}
	newUUID := uuid.New().String()
	resp, err := cld.Upload.Upload(ctx, "uploads/"+uniqueFileName, uploader.UploadParams{PublicID: "sky-tube/avataar" + newUUID})
	if err != nil {
		log.Println("error in uploading to cloudinary", err)
		return "", err
	}

	return resp.SecureURL, nil
}
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
		User        UserResponse      `json:"user"`
		AccessToken  string      `json:"accessToken"`
		RefreshToken string      `json:"refreshToken"`
	}
	

	var result LoginRequest
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&result); err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("something wrong : %v", err))
	}
	collection := config.GetCollection("users")
	filter := bson.D{{"email", result.Email}}
	project := bson.D{{"email", 1}, {"username", 1},{"fullName", 1}, {"avatar", 1}, {"coverImage", 1}, {"watchHistory", 1}, {"createdAt", 1}, {"updatedAt", 1}}
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
	if err := user.IsPasswordCorrect(result.Password); err != false {
		utils.RespondWithError(w, 400, fmt.Sprintf("password is incorrect %v", err))
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
