package main

import (
	"context"
	"net/http"
	"os"

	"log"

	"github.com/Himanshu-holmes/sky-tube/handlers"
	"github.com/Himanshu-holmes/sky-tube/utils"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var collection *mongo.Collection
var ctx = context.TODO()

func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
	}
	MONGO_URL := os.Getenv("MONGO_URL")
	clientOptions := options.Client().ApplyURI(MONGO_URL)
	client, err := mongo.Connect(ctx, clientOptions)

	if err != nil {
		log.Fatal("err", err)
	}
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("err", err)
	}

	collection = client.Database("skytube").Collection("comments")

}

func main() {

	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})

	r.Route("/api/v1/users", func(r chi.Router) {
		r.Post("/register",handlers.RegisterUsers)
	})
	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		//   w.WriteHeader(404)
		//   w.Write([]byte("route does not exist"))
		utils.RespondWithJson(w, 404, 404, nil, "route does not exist")
	})
	r.MethodNotAllowed(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(405)
		w.Write([]byte("method is not valid"))
	})
	http.ListenAndServe(":3000", r)
}
