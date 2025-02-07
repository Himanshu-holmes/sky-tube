package utils

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)
type ApiResponseType struct {
	StatusCode int         `json:"statusCode"`
	Data       interface{} `json:"data"`
	Message    string      `json:"message"`
	Success    bool        `json:"success"`
}
func ApiResponse(statusCode int, data interface{},message string)ApiResponseType{
	return ApiResponseType{
		StatusCode: statusCode,
		Data:       data,
		Message:    message,
		Success:    statusCode < 400,
	}
}
func RespondWithJson(w http.ResponseWriter, code int,statusCode int, data interface{},message string) {
	jsonData,err := json.Marshal(ApiResponse(statusCode,data,message))

	// fmt.Println("jsonData",jsonData)
	if err != nil {
		fmt.Println("error",err)
	
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code);
	w.Write(jsonData)
	// fmt.Println("Responding with json",string(jsonData));
	// json.NewEncoder(w).Encode(ApiResponse(statusCode,data,message))
	
    
};

func RespondWithError(w http.ResponseWriter, code int, msg string){
	if code > 499 {
		log.Println("Responding with 5XX error",msg);
	}
	// fmt.Println("Responding with error",msg);
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(ApiResponse(code,nil,msg))


	// RespondWithJson(w,code,400,nil,msg);
}

