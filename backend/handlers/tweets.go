package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/Himanshu-holmes/sky-tube/config"
	models "github.com/Himanshu-holmes/sky-tube/model"
	"github.com/go-chi/chi/v5"

	"github.com/Himanshu-holmes/sky-tube/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func CreateTweetHandler(w http.ResponseWriter, r *http.Request) {
	//TODO: create tweet
	/*
	   1) get the userId from req.user?._id
	   2) get the content from the body
	   3) create it
	   4) send the response
	*/
	var body struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Content is required")
		return
	}

	userId, ok := r.Context().Value("userId").(string)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "please login again")
		return
	}
	objId, err := primitive.ObjectIDFromHex(userId)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Invalid user id")
		return
	}

	if body.Content == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "Content is required")
		return
	}
	collection := config.GetCollection("tweets")
	newTweet := models.NewTweet(body.Content, objId)
	_, err = newTweet.SaveTweet(r.Context(), collection)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Failed to save tweet")
		return
	}
	utils.RespondWithJson(w, http.StatusCreated, 200, newTweet, "tweet create successfully")

}

func GetUserTweetHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: get user tweets
	/*
	   1) get the userId from the req.params
	   2) if then create aggreagation from user to tweet
	   3) get the data from aggreageation and send response
	*/
	authUserId, ok := r.Context().Value("userId").(string)
	if !ok {
		utils.RespondWithError(w, http.StatusUnauthorized, "Please login again")
		return
	}
	objId,err := primitive.ObjectIDFromHex(authUserId)
	if err !=nil {
		utils.RespondWithError(w,http.StatusUnauthorized,"Please login again")
		return
	}
	userId := chi.URLParam(r, "userId")
	collection := config.GetCollection("tweets")
	// Define aggregation pipeline
	pipeline := mongo.Pipeline{
		// Match tweets by owner
		{{Key: "$match", Value: bson.M{"owner": userId}}},

		// Lookup owner details from users collection
		{
			{Key: "$lookup", Value: bson.M{
				"from":         "users",
				"localField":   "owner",
				"foreignField": "_id",
				"as":           "ownerDetails",
				"pipeline": bson.A{
					bson.M{"$project": bson.M{"username": 1, "avatar": 1}},
				},
			}},
		},

		// Lookup likes from likes collection
		{
			{Key: "$lookup", Value: bson.M{
				"from":         "likes",
				"localField":   "_id",
				"foreignField": "tweet",
				"as":           "likeDetails",
				"pipeline": bson.A{
					bson.M{"$project": bson.M{"likedBy": 1}},
				},
			}},
		},

		// Add fields for likes count, first owner detail, and isLiked
		{
			{Key: "$addFields", Value: bson.M{
				"likesCount": bson.M{"$size": "$likeDetails"},
				"ownerDetails": bson.M{
					"$first": "$ownerDetails",
				},
				"isLiked": bson.M{
					"$cond": bson.M{
						"if":   bson.M{"$in": bson.A{objId, "$likeDetails.likedBy"}},
						"then": true,
						"else": false,
					},
				},
			}},
		},

		// Sort tweets by creation date (latest first)
		{
			{Key: "$sort", Value: bson.M{"createdAt": -1}},
		},

		// Project only required fields
		{
			{Key: "$project", Value: bson.M{
				"content":      1,
				"ownerDetails": 1,
				"likesCount":   1,
				"createdAt":    1,
				"isLiked":      1,
			}},
		},
	}
	// Execute the aggregation pipeline
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "something went wrong")
		return
	}
	defer cursor.Close(ctx)
	// Iterate over the results
	var results []bson.M
	if err = cursor.All(ctx, &results); err != nil {
		log.Fatal(err)
	}

	// Print the results
	for _, tweet := range results {
		fmt.Printf("%+v\n", tweet)
	}
	utils.RespondWithJson(w,http.StatusOK,200,results,"success")

}
