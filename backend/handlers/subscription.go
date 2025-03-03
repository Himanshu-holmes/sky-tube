package handlers

import (
	"context"
	"net/http"
	"time"

	"github.com/Himanshu-holmes/sky-tube/config"
	"github.com/Himanshu-holmes/sky-tube/utils"
	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetUserChannelSubscribers(w http.ResponseWriter, r *http.Request) {

	channelId := chi.URLParam(r, "channelId")

	if channelId == "" {
		utils.RespondWithError(w, http.StatusBadRequest, "ChannelId is required")
		return
	}
	objChannelId, err := primitive.ObjectIDFromHex(channelId)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Invalid ChannelId")
		return
	}
	collection := config.GetCollection("Subscription")

	// MongoDB aggregation pipeline
	matchChannelId := bson.D{
		{Key: "$match", Value: bson.D{{Key: "channel", Value: objChannelId}}},
	}

	// Lookup stage: Fetch user details for each subscriber
	lookupSubscribers := bson.D{
		{Key: "$lookup", Value: bson.M{
			"from":         "users",
			"localField":   "subscriber",
			"foreignField": "_id",
			"as":           "subscriber",
			"pipeline": bson.A{
				// Lookup subscriptions of the subscriber
				bson.M{
					"$lookup": bson.M{
						"from":         "subscriptions",
						"localField":   "_id",
						"foreignField": "channel",
						"as":           "subscribedToSubscriber",
					},
				},
				// Add computed fields
				bson.M{
					"$addFields": bson.M{
						"subscribedToSubscriber": bson.M{
							"$cond": bson.M{
								"if":   bson.M{"$in": bson.A{objChannelId, "$subscribedToSubscriber.subscriber"}},
								"then": true,
								"else": false,
							},
						},
						"subscribersCount": bson.M{"$size": "$subscribedToSubscriber"},
					},
				},
			},
		}},
	}

	// Unwind stage: Flatten the subscriber array
	unwindSubscribers := bson.D{
		{Key: "$unwind", Value: bson.M{"path": "$subscriber"}},
	}

	// Project stage: Select specific fields to return
	projectSubscribers := bson.D{
		{Key: "$project", Value: bson.M{
			"subscriber": bson.M{
				"_id":                    1,
				"username":               1,
				"fullName":               1,
				"avatar":                 1,
				"subscribersCount":       1,
				"subscribedToSubscriber": 1,
			},
		}},
	}

	// MongoDB aggregation pipeline
	pipeline := mongo.Pipeline{matchChannelId, lookupSubscribers, unwindSubscribers, projectSubscribers}
	// Execute the aggregation pipeline
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	cursor, err := collection.Aggregate(ctx, pipeline)
	defer cursor.Close(ctx)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	var subscribers []bson.M
	if err = cursor.All(ctx, &subscribers); err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	utils.RespondWithJson(w, http.StatusOK, 200, subscribers, "Fetched ALl Subscriber list of the channel")
}
func ToggleSubscription(w http.ResponseWriter, r *http.Request){
	  // TODO: toggle subscription
  /*
  1)will get req.user?._id and channelId from the req.param 
  2)now we will find that bhot should pr presnet in db which means channelId and subscriber(req.user?._id)
  3) if present delete 
  4) else create new and add in db
  5) return the respective response 
  */
  ChannelId := chi.URLParam(r, "channelId")
  userId,ok := r.Context().Value("userId").(string)
  if !ok {
	utils.RespondWithError(w, http.StatusUnauthorized, "Please login again")
	return
	  }
  if ChannelId == "" {
	utils.RespondWithError(w, http.StatusBadRequest, "ChannelId is required")
	return
  }
  objChannelId, err := primitive.ObjectIDFromHex(ChannelId)
  if err != nil {
	utils.RespondWithError(w, http.StatusInternalServerError, "Invalid ChannelId")
	return
  }
 collection := config.GetCollection("Subscription")
//   find is channel subscribed
  filter := bson.M{"channel":objChannelId,"subscriber":userId}
  var subscription bson.M
  type Response struct {
	Subscribed bool `json:"subscribed"`
	  }
  err = collection.FindOne(r.Context(),filter).Decode(&subscription)
//  if channel is subscribed then delete the subscription
  if err == nil {
	_,err = collection.DeleteOne(r.Context(),filter)
	if err != nil {
	 utils.RespondWithError(w,http.StatusInternalServerError,"Failed to delete subscription")
	  return
	}
	// send  { subscribed: false } in data
	response := Response{Subscribed:false}
	utils.RespondWithJson(w,http.StatusOK,200,response,"Subscription Deleted Successfully")
	return

  }
  // if channel is not subscribed then create the subscription
  newSubscription := bson.M{"channel":objChannelId,"subscriber":userId}
  _,err = collection.InsertOne(r.Context(),newSubscription)
  if err != nil {
	utils.RespondWithError(w,http.StatusInternalServerError,"Failed to create subscription")
	return
  }
  // send  { subscribed: true } in data
  response := Response{Subscribed:true}
  utils.RespondWithJson(w,http.StatusCreated,200,response,"Subscription Created Successfully")

}
func GetSubscribedChannels(w http.ResponseWriter, r *http.Request) {
	subscriberId := chi.URLParam(r, "subscriberId")
	if subscriberId == "" {
		utils.RespondWithError(w, 404, "Not A Valid Subscribed Id")
		return
	}
	objSubscriberId, err := primitive.ObjectIDFromHex(subscriberId)
	if err != nil {
		utils.RespondWithError(w, 404, "Not A Valid Subscribed Id")
		return
	}
	// Aggregation pipeline
	matchStage := bson.D{
		{Key: "$match", Value: bson.D{{Key: "subscriber", Value: objSubscriberId}}},
	}

	lookupStage := bson.D{
		{Key: "$lookup", Value: bson.M{
			"from":         "users",
			"localField":   "channel",
			"foreignField": "_id",
			"as":           "subscribedChannel",
		}},
	}

	unwindStage := bson.D{
		{Key: "$unwind", Value: bson.M{"path": "$subscribedChannel"}},
	}

	projectStage := bson.D{
		{Key: "$project", Value: bson.M{
			"subscribedChannel": bson.M{
				"_id":      1,
				"username": 1,
				"fullName": 1,
				"avatar":   1,
			},
		}},
	}

	collection := config.GetCollection("Subscription")

	// MongoDB aggregation pipeline
	pipeline := mongo.Pipeline{matchStage, lookupStage, unwindStage, projectStage}
	// Execute the aggregation pipeline
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	defer cursor.Close(ctx)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	var subscribedChannels []bson.M
	if err = cursor.All(ctx, &subscribedChannels); err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, err.Error())
		return
	}
	// if subscribedChannels == nil {
	// send empty array
	if len(subscribedChannels) == 0 {
		subscribedChannels = []bson.M{}
	}

	utils.RespondWithJson(w,http.StatusOK,200,subscribedChannels,"Fetch All The Subscrbed Channel Of the user")

}
