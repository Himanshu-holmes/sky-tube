package handlers

import (
	"net/http"

	"github.com/Himanshu-holmes/sky-tube/utils"
)

func HealthCheck(w http.ResponseWriter, r *http.Request){
	utils.RespondWithJson(w, http.StatusOK, 200,map[string]string{"message": "Server is up and running"},"")
}