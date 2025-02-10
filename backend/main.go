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
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token", "Access-Control-Allow-Credentials"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300, // Maximum value not ignored by any of major browsers

	}))
	r.Use(middleware.Logger)
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Hello World!"))
	})

	r.Route("/api/v1/users", func(r chi.Router) {
		r.Post("/register", handlers.RegisterUser)
		r.Post("/login", handlers.LoginUser)
		r.Get("/getCurrentUser",VerifyToken(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			utils.RespondWithJson(w, http.StatusOK, 200, nil, "Token verified successfully")
		})).(http.HandlerFunc))

		r.With(VerifyToken).Get("/getCurrentUser",handlers.GetUserHandler)
		r.Post("/refresh-Token",handlers.GetRefreshToken)
		r.Post("/logout",handlers.LogOutUser)
		r.With(VerifyToken).Post("/change-Password",handlers.ChangePassword)
		r.With(VerifyToken).Patch("/update-account",handlers.UpdateAccount)
		r.With(VerifyToken).Patch("/update-avatar",handlers.UpdateUserAvatar)
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
