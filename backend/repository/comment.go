package repository

import (
	"context"
	"time"

	models "github.com/Himanshu-holmes/sky-tube/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func InsertComment(collection *mongo.Collection, comment models.Comment) (interface{}, error) {
	comment.CreatedAt = time.Now()
	comment.UpdatedAt = time.Now()

	result, err := collection.InsertOne(context.Background(), comment)
	if err != nil {
		return nil, err
	}
	return result.InsertedID, nil
}


func GetCommentsWithPagination(collection *mongo.Collection, filter bson.M, page, limit int) ([]models.Comment, error) {
	var comments []models.Comment

	skip := (page - 1) * limit
	findOptions := options.Find().SetSkip(int64(skip)).SetLimit(int64(limit))

	cursor, err := collection.Find(context.Background(), filter, findOptions)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var comment models.Comment
		if err := cursor.Decode(&comment); err != nil {
			return nil, err
		}
		comments = append(comments, comment)
	}
	return comments, nil
}