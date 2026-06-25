package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/h1-kimura/newsletter-app/db"
)

type Article struct {
	ID        int    `json:"id"`
	UserID    int    `json:"user_id"`
	Title     string `json:"title"`
	Body      string `json:"body"`
	CreatedAt string `json:"created_at"`
}

func GetArticles(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(
		"SELECT id, user_id, title, body, created_at FROM articles ORDER BY created_at DESC",
	)
	if err != nil {
		log.Println("DBエラー:", err)
		http.Error(w, "取得失敗", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var articles []Article
	for rows.Next() {
		var a Article
		err := rows.Scan(&a.ID, &a.UserID, &a.Title, &a.Body, &a.CreatedAt)
		if err != nil {
			log.Println("スキャンエラー:", err)
			continue
		}
		articles = append(articles, a)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(articles)
}

func PostArticle(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title string `json:"title"`
		Body  string `json:"body"`
	}
	json.NewDecoder(r.Body).Decode(&input)

	_, err := db.DB.Exec(
		"INSERT INTO articles (user_id, title, body) VALUES ($1, $2, $3)",
		13, input.Title, input.Body,
	)
	if err != nil {
		log.Println("DBエラー:", err)
		http.Error(w, "投稿失敗", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "投稿成功"})
}
