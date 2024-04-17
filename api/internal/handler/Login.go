package handler

import (
	"api/internal/service"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/golang-jwt/jwt"
	"io/ioutil"
	"log"
	"net/http"
	"time"
)

// Config structure to map JWT key from JSON
type Config struct {
	JWTSecretKey string `json:"JWT_SECRET_KEY"`
}

// getJWTKey Load JWT Key from config.json
func getJWTKey() []byte {
	file, err := ioutil.ReadFile("config.json") // Adjust the path as necessary
	if err != nil {
		log.Fatal("Error loading config file:", err)
	}
	var config Config
	if err := json.Unmarshal(file, &config); err != nil {
		log.Fatal("Error parsing config file:", err)
	}

	if config.JWTSecretKey == "" {
		log.Fatal("JWT_SECRET_KEY is not specified in the config file")
	}

	return []byte(config.JWTSecretKey)
}

var jwtKey = getJWTKey()

// Credentials structure to map username and password from JSON
type Credentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

// Claims structure to map username and standard claims from JSON
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

// LoginHandler structure to map AuthenticationService from service
type LoginHandler struct {
	AuthService service.AuthenticationService
}

// AuthenticateToken function to authenticate token
func AuthenticateToken(next http.Handler) http.Handler {

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("x-jwt-token")
		if err != nil {
			if errors.Is(err, http.ErrNoCookie) {
				http.Error(w, "Unauthorized", http.StatusUnauthorized)
				return
			}
			http.Error(w, "Bad Request", http.StatusBadRequest)
			return
		}

		fmt.Println("Cookie: ", cookie.Value)
		tokenString := cookie.Value
		claims := &Claims{}

		// Parse the token
		token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// ServeHTTP function to authenticate user credentials and generate token
func (handler *LoginHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var credentials Credentials

	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, "Bad request", http.StatusBadRequest)
		return
	}
	fmt.Printf("Received credentials: %+v\n", credentials)

	fmt.Println(r.Cookie("x-jwt-token"))

	println("Cookie: " + r.Header.Get("Cookie"))

	if _, err := r.Cookie("x-jwt-token"); err != nil {
		fmt.Println("Cookie 'x-jwt-token' not found:", err)
	}

	if authSuccess, err := handler.AuthService.Authenticate(credentials.Username, credentials.Password); err != nil || !authSuccess {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	// Create the token
	expirationTime := time.Now().Add(1 * time.Hour) // Token is valid for 1 hour
	claims := &Claims{
		Username: credentials.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)
	if err != nil {
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "x-jwt-token",
		Value:    tokenString,
		Expires:  expirationTime,
		HttpOnly: true,
		Path:     "/",
		// Secure and SameSite should be set appropriately based on the deployment (e.g., Secure: true in production over HTTPS)
	})

	// Ensure the token is only written once, and no other writes occur after this
	w.Header().Set("Content-Type", "application/json")
	encodeErr := json.NewEncoder(w).Encode(map[string]string{"token": tokenString})
	if encodeErr != nil {
		return
	}
}
