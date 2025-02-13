package models

import (
	"context"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type Tweet struct {
	ID        primitive.ObjectID `bson:"_id"`
	Content   string             `bson:"content,omitempty"`
	OwnerID   primitive.ObjectID `bson:"owner_id,omitempty"`
	CreatedAt time.Time          `bson:"created_at,omitempty"`
	UpdatedAt time.Time          `bson:"updated_at,omitempty"`
}

func NewTweet(content string, ownerID primitive.ObjectID) *Tweet {
	return &Tweet{
		ID: primitive.NewObjectID(),
		Content:   content,
		OwnerID:   ownerID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
}

func (t *Tweet)SaveTweet(ctx context.Context, collection *mongo.Collection)(*mongo.InsertOneResult,error){
	return collection.InsertOne(ctx,t)

}