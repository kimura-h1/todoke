package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/h1-kimura/newsletter-app/db"
	"golang.org/x/crypto/bcrypt"
)

func RegisterUser(w http.ResponseWriter, r *http.Request) {
	var user struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	json.NewDecoder(r.Body).Decode(&user)

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Println("ハッシュ化エラー:", err)
		http.Error(w, "登録失敗", http.StatusInternalServerError)
		return
	}

	_, err = db.DB.Exec(
		"INSERT INTO users (email, password) VALUES ($1, $2)",
		user.Email, string(hashedPassword),
	)
	if err != nil {
		log.Println("DBエラー:", err)
		http.Error(w, "登録失敗", http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, "登録成功: %s", user.Email)
}

func LoginUser(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	json.NewDecoder(r.Body).Decode(&input)

	// DBからユーザーを検索
	var id int
	var hashedPassword string
	err := db.DB.QueryRow(
		"SELECT id, password FROM users WHERE email = $1",
		input.Email,
	).Scan(&id, &hashedPassword)
	if err != nil {
		http.Error(w, "メールアドレスまたはパスワードが違います", http.StatusUnauthorized)
		return
	}

	// パスワード照合
	err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(input.Password))
	if err != nil {
		http.Error(w, "メールアドレスまたはパスワードが違います", http.StatusUnauthorized)
		return
	}

	// JWTトークン生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": id,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		http.Error(w, "トークン生成失敗", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenString,
	})
}
