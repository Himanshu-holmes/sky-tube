package handlers

import (
	"fmt"
	"net/http"

	// "github.com/Himanshu-holmes/sky-tube/config"
	// models "github.com/Himanshu-holmes/sky-tube/model"
	"github.com/Himanshu-holmes/sky-tube/utils"
)

func PublishAVideos(w http.ResponseWriter, r *http.Request) {
	videoFile, videoHeaders, err := r.FormFile("videoFile")
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading avatar image: %v", err))
		return
	}
	defer videoFile.Close()
	thumbnailFile,thumbnailHeaders, err := r.FormFile("thumbnail")
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading avatar image: %v", err))
		return
	}
	defer thumbnailFile.Close()

	// Upload videos
	videoUrl, err := utils.UploadImage(r.Context(), videoFile, videoHeaders)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading avatar image: %v", err))
		return
	}
	// Upload thumbnail
	thumbnailUrl, err := utils.UploadImage(r.Context(), thumbnailFile, thumbnailHeaders)
	if err != nil {
		utils.RespondWithError(w, 400, fmt.Sprintf("Error in uploading avatar image: %v", err))
		return
	}
    
	// get title
	title := r.FormValue("title")
	// get description
	description := r.FormValue("description")

	// lets see what are we getting in title and description readable
	fmt.Println("titile and description",title,description)
	fmt.Println("videoUrl",videoUrl)
	fmt.Println("thumbnailUrl",thumbnailUrl)

	// collection := config.GetCollection("videos")
   
	// videos := models.Video {
	// 	VideoFile: videoUrl,
	// 	Thumbnail: thumbnailUrl,
	// 	Title: title,
	// 	Description: description,
	// 	IsPublished: true,
	// 	// Duration: ,
	// }


}
