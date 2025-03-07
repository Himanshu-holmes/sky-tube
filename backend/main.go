package main

import (
	// "context"
	"net/http"

	// "os"

	// "log"

	"github.com/Himanshu-holmes/sky-tube/config"
	"github.com/Himanshu-holmes/sky-tube/handlers"
	"github.com/Himanshu-holmes/sky-tube/utils"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	// "github.com/joho/godotenv"
	// "go.mongodb.org/mongo-driver/mongo"
	// "go.mongodb.org/mongo-driver/mongo/options"
)

// func init() {
// 	err := godotenv.Load(".env")
// 	if err != nil {
// 		log.Fatalf("Error loading .env file: %s", err)
// 	}
// 	MONGO_URL := os.Getenv("MONGO_URL")
// 	clientOptions := options.Client().ApplyURI(MONGO_URL)
// 	Client, err = mongo.Connect(ctx, clientOptions)

// 	if err != nil {
// 		log.Fatal("err", err)
// 	}
// 	err = Client.Ping(ctx, nil)
// 	if err != nil {
// 		log.Fatal("err", err)
// 	}

// }

func main() {
	config.ConnectDB()
	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		// AllowedOrigins:   []string{"https://foo.com"}, // Use this to allow specific origin hosts
		AllowedOrigins: []string{"http://localhost:5173", "https://*", "http://*"},
		// AllowOriginFunc:  func(r *http.Request, origin string) bool { return true },
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Access-Control-Allow-Credentials"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers

	}))
	r.Use(middleware.Logger)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})
	// healthcheck route
	r.Route("/api/v1/healthcheck", func(r chi.Router) {
		r.Get("/", handlers.HealthCheck)
	})
	// users route
	r.Route("/api/v1/users", func(r chi.Router) {
		r.Post("/register", handlers.RegisterUser)
		r.Post("/login", handlers.LoginUser)
		r.Post("/logout", handlers.LogOutUser)
		r.Post("/refresh-Token", handlers.GetRefreshToken)

		// r.With(VerifyToken).Get("/getCurrentUser",handlers.GetUserHandler)
		// r.With(VerifyToken).Post("/change-Password",handlers.ChangePassword)
		// r.With(VerifyToken).Patch("/update-account",handlers.UpdateAccount)
		// r.With(VerifyToken).Patch("/update-avatar",handlers.UpdateUserAvatar)
		// r.With(VerifyToken).Patch("/update-coverImage",handlers.UpdateUserCoverImage)
		// r.With(VerifyToken).Get("/channel/{username}",handlers.GetUserChannelProfile)
		// r.With(VerifyToken).Get("/watch-history",handlers.GetWatchHistory)

		r.With(VerifyToken).Group(func(r chi.Router) {
			r.Get("/getCurrentUser", handlers.GetUserHandler)
			r.Post("/change-Password", handlers.ChangePassword)
			r.Patch("/update-account", handlers.UpdateAccount)
			r.Patch("/update-avatar", handlers.UpdateUserAvatar)
			r.Patch("/update-coverImage", handlers.UpdateUserCoverImage)
			r.Get("/channel/{username}", handlers.GetUserChannelProfile)
			r.Get("/watch-history", handlers.GetWatchHistory)
		})
	})

	// tweets route
	r.Route("/api/v1/tweets", func(r chi.Router) {
		// r.With(VerifyToken).Post("/", handlers.CreateTweetHandler)
		
			r.With(VerifyToken).Group(func(r chi.Router) {
				r.Post("/", handlers.CreateTweetHandler)
				r.Get("/user/{userId}",handlers.GetUserTweetHandler)
			})
	})
	r.Route("/api/v1/subscriptions",func(r chi.Router) {
		r.With(VerifyToken).Group(func(r chi.Router) {
			r.Get("/channel/{channelId}",handlers.GetUserChannelSubscribers)
			r.Post("/channel/{channelId}",handlers.ToggleSubscription)

			r.Get("/user/{subscriberId}",handlers.GetSubscribedChannels)
		})
	})

	r.Route("/api/v1/videos",func(r chi.Router) {
		r.With(VerifyToken).Group(func(r chi.Router) {
			r.Post("/publish-video",handlers.PublishAVideos)
		})
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
