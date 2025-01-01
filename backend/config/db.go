package config

import (
	"context"
	"log"
	"os"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func ConnectDB() *mongo.Client{
    err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
	}
	MONGO_URL := os.Getenv("MONGO_URL")
    client,err := mongo.Connect(context.Background(),options.Client().ApplyURI(MONGO_URL))
    if err != nil {
        log.Fatal("err", err)
    }
    ctx,_ := context.WithTimeout(context.Background(),100)
    err = client.Ping(ctx,nil)
    if err != nil {
        println("err", err.Error())	
    }
    return client
}

var DB *mongo.Client = ConnectDB()

// getting database collections

func GetCollection( collectionName string) *mongo.Collection {
	if DB == nil {
		DB = ConnectDB()
	}
    collection := DB.Database("sky-tube").Collection(collectionName)
	if collection == nil {
		log.Fatalf("Error getting collection %v", collectionName)
	}
    return collection
}