package handlers

import (
	"fmt"

	"net/http"

	"github.com/Himanshu-holmes/sky-tube/utils"
)

func RegisterUsers(w http.ResponseWriter, r *http.Request) {

	type parameters struct {
		Fullname string `json:"fullName"`
		Username string `json:"username"`
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	// parsed form data
	err := r.ParseForm()
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, fmt.Sprintf("Error parsing form data: %v", err))
		return
	}

	fullname := r.PostForm.Get("fullName")
	username := r.PostForm.Get("username")
	email := r.PostForm.Get("email")
	password := r.PostForm.Get("password")
	avatar := r.PostForm.Get("avatar")

	fmt.Println("Fullname:", fullname)
	fmt.Println("Username", username)
	fmt.Println("email", email)
	fmt.Println("Password", password)
	fmt.Println("Avatar", avatar)

	defer r.Body.Close()

	utils.RespondWithJson(w, 200, 200, parameters{
		Fullname: fullname,
		Username: username,
		Email:    email,
		Password: password,
	}, "User registered successfully")
}
