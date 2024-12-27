package config

import (
	"log"
	"os"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/joho/godotenv"
)

func SetupCloudinary() (*cloudinary.Cloudinary, error) {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %s", err)
	}
	CLOUDINARY_API_SECRET := os.Getenv("CLOUDINARY_API_SECRET")
	CLOUDINARY_CLOUD_NAME := os.Getenv("CLOUDINARY_CLOUD_NAME")
	CLOUDINARY_API_KEY := os.Getenv("CLOUDINARY_API_KEY")

	cld, err := cloudinary.NewFromParams(CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)
	if err != nil {
		return nil, err
	}

	return cld, nil
}
