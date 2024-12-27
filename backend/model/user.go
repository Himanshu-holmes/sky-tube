package models



import (
	"context"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type User struct {
	ID           primitive.ObjectID   `bson:"_id,omitempty"`
	Username     string               `bson:"username" validate:"required,unique"`
	Email        string               `bson:"email" validate:"required,email,unique"`
	FullName     string               `bson:"fullName" validate:"required"`
	Avatar       string               `bson:"avatar" validate:"required"`
	CoverImage   string               `bson:"coverImage,omitempty"`
	WatchHistory []primitive.ObjectID `bson:"watchHistory,omitempty"`
	Password     string               `bson:"password" validate:"required"`
	RefreshToken string               `bson:"refreshToken,omitempty"`
	CreatedAt    time.Time            `bson:"createdAt,omitempty"`
	UpdatedAt    time.Time            `bson:"updatedAt,omitempty"`
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
func (u *User) IsPasswordCorrect(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(password))
	return err == nil
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
