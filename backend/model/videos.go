package models

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Video represents the video schema in MongoDB
type Video struct {
	ID          primitive.ObjectID `bson:"_id,omitempty"`         // MongoDB ObjectID
	VideoFile   string             `bson:"videoFile,omitempty"`   // Cloudinary URL for video
	Thumbnail   string             `bson:"thumbnail,omitempty"`   // Cloudinary URL for thumbnail
	Title       string             `bson:"title,omitempty"`       // Video title (indexed in MongoDB)
	Description string             `bson:"description,omitempty"` // Video description
	Duration    int                `bson:"duration,omitempty"`    // Duration of the video (from Cloudinary)
	Views       int                `bson:"views,omitempty"`       // View count, default is 0
	IsPublished bool               `bson:"isPublished,omitempty"` // Publish status, default is true
	Owner       primitive.ObjectID `bson:"owner,omitempty"`       // Reference to the User model
	CreatedAt   time.Time          `bson:"createdAt,omitempty"`   // Timestamp for when the video was created
	UpdatedAt   time.Time          `bson:"updatedAt,omitempty"`   // Timestamp for when the video was last updated
}


// FetchVideosWithPagination retrieves paginated videos from MongoDB
func FetchVideosWithPagination(ctx context.Context, db *mongo.Database, page, limit int) ([]Video, error) {
	var videos []Video
	collection := db.Collection("videos")

	skip := (page - 1) * limit
	findOptions := options.Find().
		SetSkip(int64(skip)).
		SetLimit(int64(limit)).
		SetSort(bson.D{{"createdAt", -1}}) // Sort by latest videos

	cursor, err := collection.Find(ctx, bson.M{"isPublished": true}, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	// Decode results
	if err = cursor.All(ctx, &videos); err != nil {
		log.Println("Error decoding videos:", err)
		return nil, err
	}

	return videos, nil
}