package utils

import (
	"context"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"time"

	"github.com/Himanshu-holmes/sky-tube/config"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/google/uuid"
)

func UploadImage(ctx context.Context,file multipart.File, handler *multipart.FileHeader) (string, error) {
	if _, err := os.Stat("uploads"); os.IsNotExist(err) {
		if mkDirErr := os.Mkdir("uploads", os.ModePerm); mkDirErr != nil {

			return "", mkDirErr
		}
	}
	uniqueFileName := fmt.Sprintf("%d_%s", time.Now().UnixNano(), handler.Filename)

	dst, _ := os.Create("uploads/" + uniqueFileName)
	defer dst.Close()
	_, err := io.Copy(dst, file)
	if err != nil {
		return "", err
	}

	cld, err := config.SetupCloudinary()
	if err != nil {
		return "", err
	}
	newUUID := uuid.New().String()
	resp, err := cld.Upload.Upload(ctx, "uploads/"+uniqueFileName, uploader.UploadParams{PublicID: "sky-tube/avataar" + newUUID})
	if err != nil {
		log.Println("error in uploading to cloudinary", err)
		return "", err
	}

	return resp.SecureURL, nil
}

func DeleteCloudinaryImage( ctx context.Context, PublicID string) error {
	cld, err := config.SetupCloudinary()
	if err != nil {
		return err
	}
	_, err = cld.Upload.Destroy(ctx,  uploader.DestroyParams{
		PublicID: PublicID,
		
	})
	if err != nil {
		return err
	}
	return nil
}