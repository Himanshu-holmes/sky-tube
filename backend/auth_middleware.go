package main

import (
	"context"
	"fmt"

	"net/http"
	"os"
	"strings"

	"github.com/Himanshu-holmes/sky-tube/config"
	models "github.com/Himanshu-holmes/sky-tube/model"
	"github.com/Himanshu-holmes/sky-tube/utils"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)
func VerifyToken(next http.Handler) http.Handler {
	fmt.Print("Verify Token")
	secret := []byte(os.Getenv("ACCESS_TOKEN_SECRET"))
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Get the token from the request
		checkTokenString := r.Header.Get("Authorization") 
		getCookie, err := r.Cookie("accessToken")
	
		fmt.Println("\ncheckTokenString",checkTokenString)
		fmt.Println("getCookie",getCookie)
		tokenParts := strings.Split(r.Header.Get("Authorization"), " ")
		tokenString := ""
		if len(tokenParts) == 2 {
			tokenString = tokenParts[1]
		} else {
			tokenString = getCookie.Value
		}
		fmt.Println("tokenString",tokenString)

		// If the token is empty
		if tokenString == "" {
			utils.RespondWithError(w, http.StatusUnauthorized, "Token is missing")
			return 
		}
		// claims := jwt.MapClaims{}

		// // verify token
		// accessToken,err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		// 	return secret, nil
		// });
		accessToken,err := jwt.Parse(tokenString,func(token *jwt.Token)(interface{},error){
			if _,ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil,fmt.Errorf("unexpected signing method: %v",token.Header["alg"])
			}
			return secret,nil
		})
		fmt.Println("accessToken",accessToken.Claims)
		if err != nil || !accessToken.Valid {
			utils.RespondWithError(w, http.StatusUnauthorized,"invalid token")
			return 
		}
		claims,ok := accessToken.Claims.(jwt.MapClaims)
		if !ok {
			utils.RespondWithError(w, http.StatusUnauthorized,"invalid token")
			return 
		}
		userId,ok := claims["_id"].(string)
		if !ok {
			utils.RespondWithError(w, http.StatusUnauthorized,"invalid token")
			return
		}
		// fmt.Println("userId",userId)
		objId,err := primitive.ObjectIDFromHex(userId)
		if err != nil {
			utils.RespondWithError(w, http.StatusUnauthorized,"invalid token")
			return
		}

		collection := config.GetCollection("users")
		filter := bson.M{"_id":objId}
		project := bson.M{"_id":1}
		opts := options.FindOne().SetProjection(project)
		var user models.User
		if err := collection.FindOne(r.Context(),filter,opts).Decode(&user); err != nil {
			if err == mongo.ErrNoDocuments {
				utils.RespondWithError(w,http.StatusUnauthorized,"invalid token")
				
			}else{
				utils.RespondWithError(w,http.StatusInternalServerError,"something went wrong")
				
			}
			return
		}
		

		ctx := context.WithValue(r.Context(),"userId",userId)

		// If the token is valid
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}