package models

import (
	"context"
	"errors"

	"os"
	"time"

	"github.com/Himanshu-holmes/sky-tube/config"
	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	ID           primitive.ObjectID   `bson:"_id,omitempty"` // MongoDB Object ID
	Username     string               `bson:"username" validate:"required,unique"`
	Email        string               `bson:"email" validate:"required,email,unique"`
	FullName     string               `bson:"fullName" validate:"required"`
	Avatar       string               `bson:"avatar" validate:"required"`
	CoverImage   string               `bson:"coverImage"`
	WatchHistory []primitive.ObjectID `bson:"watchHistory"`
	Password     string               `bson:"password" validate:"required"`
	AccessToken  string   			`bson:"accessToken"`
	RefreshToken string               `bson:"refreshToken"`
	CreatedAt    time.Time            `bson:"createdAt"`
	UpdatedAt    time.Time            `bson:"updatedAt"`
}

// HashPassword hashes the user's password before saving it.
func (u *User) HashPassword() error {
	if u.Password == "" {
		return errors.New("password is required")
	}
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	u.Password = string(hashedPassword)
	return nil
}

// IsPasswordCorrect compares a plain text password with the hashed password.
func (u *User) IsPasswordCorrect(password string) error {
	// fmt.Println("password",password,u.Password)
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err 
}

// GenerateAccessToken generates a JWT access token for the user.
func (u *User) GenerateAccessToken() (string, error) {
	claims := jwt.MapClaims{
		"_id":      u.ID.Hex(),
		"email":    u.Email,
		"username": u.Username,
		"fullName": u.FullName,
		"exp":      time.Now().Add(time.Hour * 24).Unix(), // Replace with your token expiry
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("ACCESS_TOKEN_SECRET")
	return token.SignedString([]byte(secret))
}
// save refresh and access token in db
func (u *User) SaveRefreshTokenAndAccessToken(ctx context.Context, collection *mongo.Collection) (*mongo.UpdateResult, error) {
	return collection.UpdateByID(ctx, u.ID, bson.M{
    "$set": bson.M{
        "refreshToken": u.RefreshToken,
        "accessToken": u.AccessToken,
    },
}, options.Update().SetUpsert(true),
)

}

// GenerateRefreshToken generates a JWT refresh token for the user.
func (u *User) GenerateRefreshToken() (string, error) {
	claims := jwt.MapClaims{
		"_id": u.ID.Hex(),
		"exp": time.Now().Add(time.Hour * 24 * 7).Unix(), // Replace with your refresh token expiry
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	secret := os.Getenv("REFRESH_TOKEN_SECRET")
	return token.SignedString([]byte(secret))
}

// Save saves the user to the MongoDB collection.
func (u *User) Save(ctx context.Context, collection *mongo.Collection) (*mongo.InsertOneResult, error) {
	u.CreatedAt = time.Now()
	u.UpdatedAt = time.Now()
	return collection.InsertOne(ctx, u)
}

// get user
func GetUser(ctx context.Context,  filter bson.M, project bson.M, result *User) (*mongo.Collection,error) {
	// get collection user
	collection := config.GetCollection("users")
	opts := options.FindOne().SetProjection(project)
	err := collection.FindOne(ctx, filter, opts).Decode(&result)
	return collection,err
}

func (u *User) RemoveRefreshToken(ctx context.Context, collection *mongo.Collection) {
	u.RefreshToken = "";
	
}


// Example Usage
/*
import (
	"context"
	"log"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	clientOptions := options.Client().ApplyURI("mongodb+srv://<username>:<password>@cluster.mongodb.net/")
	client, err := mongo.Connect(context.TODO(), clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	defer client.Disconnect(context.TODO())

	userCollection := client.Database("yourDatabaseName").Collection("users")

	newUser := models.User{
		Username: "exampleuser",
		Email:    "example@example.com",
		FullName: "Example User",
		Avatar:   "http://example.com/avatar.png",
		Password: "plaintextpassword",
	}

	if err := newUser.HashPassword(); err != nil {
		log.Fatal("Error hashing password:", err)
	}

	result, err := newUser.Save(context.TODO(), userCollection)
	if err != nil {
		log.Fatal("Error saving user:", err)
	}

	log.Println("User inserted with ID:", result.InsertedID)
}
*/
