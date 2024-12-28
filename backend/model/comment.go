package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"context"
	
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Comment represents the MongoDB Comment schema
type Comment struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`       // MongoDB Object ID
	Content   string             `bson:"content"`            // Comment content
	VideoID   primitive.ObjectID `bson:"video,omitempty"`    // Reference to the Video ID
	OwnerID   primitive.ObjectID `bson:"owner,omitempty"`    // Reference to the Owner (User) ID
	CreatedAt time.Time          `bson:"created_at"`         // Timestamp when created
	UpdatedAt time.Time          `bson:"updated_at"`         // Timestamp when updated
}



func InsertComment(collection *mongo.Collection, comment Comment) (interface{}, error) {
	comment.CreatedAt = time.Now()
	comment.UpdatedAt = time.Now()

	result, err := collection.InsertOne(context.Background(), comment)
	if err != nil {
		return nil, err
	}
	return result.InsertedID, nil
}


func GetCommentsWithPagination(collection *mongo.Collection, filter bson.M, page, limit int) ([]Comment, error) {
	var comments []Comment

	skip := (page - 1) * limit
	findOptions := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit))

	cursor, err := collection.Find(context.Background(), filter, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var comment Comment
		if err := cursor.Decode(&comment); err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}
	return comments, nil
}