package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/h1-kimura/newsletter-app/db"
	"github.com/h1-kimura/newsletter-app/middleware"
)

type Article struct {
	ID        int    `json:"id"`
	UserID    int    `json:"user_id"`
	Title     string `json:"title"`
	Body      string `json:"body"`
	CreatedAt string `json:"created_at"`
}

func GetArticles(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		http.Error(w, "認証エラー", http.StatusUnauthorized)
		return
	}

	rows, err := db.DB.Query(
		"SELECT id, user_id, title, body, created_at FROM articles WHERE user_id = $1 ORDER BY created_at DESC",
		userID,
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

	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		http.Error(w, "認証エラー", http.StatusUnauthorized)
		return
	}

	_, err := db.DB.Exec(
		"INSERT INTO articles (user_id, title, body) VALUES ($1, $2, $3)",
		userID, input.Title, input.Body,
	)
	if err != nil {
		log.Println("DBエラー:", err)
		http.Error(w, "投稿失敗", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "投稿成功"})
}

func UpdateArticle(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Title string `json:"title"`
		Body  string `json:"body"`
	}
	json.NewDecoder(r.Body).Decode(&input)

	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		http.Error(w, "認証エラー", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(r.URL.Path, "/")
	id := parts[len(parts)-1]

	log.Println("更新対象 id:", id, "userID:", userID, "title:", input.Title)

	result, err := db.DB.Exec(
		"UPDATE articles SET title = $1, body = $2 WHERE id = $3 AND user_id = $4",
		input.Title, input.Body, id, userID,
	)
	if err != nil {
		log.Println("DBエラー:", err)
		http.Error(w, "更新失敗", http.StatusInternalServerError)
		return
	}

	rows, _ := result.RowsAffected()
	log.Println("更新された行数:", rows)

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "更新成功"})
}

func DeleteArticle(w http.ResponseWriter, r *http.Request) {

	userID, ok := r.Context().Value(middleware.UserIDKey).(int)
	if !ok {
		http.Error(w, "認証エラー", http.StatusUnauthorized)
		return
	}

	parts := strings.Split(r.URL.Path, "/")
	id := parts[len(parts)-1]

	_, err := db.DB.Exec(
		"DELETE FROM articles WHERE id = $1 AND user_id = $2",
		id, userID,
	)
	if err != nil {
		log.Println("DBエラー:", err)
		http.Error(w, "削除失敗", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "削除成功"})
}

func GetArticle(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(r.URL.Path, "/")
	id := parts[len(parts)-1]

	var a Article
	err := db.DB.QueryRow(
		"SELECT id, user_id, title, body, created_at FROM articles WHERE id = $1",
		id,
	).Scan(&a.ID, &a.UserID, &a.Title, &a.Body, &a.CreatedAt)
	if err != nil {
		http.Error(w, "記事が見つかりません", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(a)
}
