package handler

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/h1-kimura/newsletter-app/db"
)

func Subscribe(w http.ResponseWriter, r *http.Request) {
	var input struct {
		Email string `json:"email"`
	}
	json.NewDecoder(r.Body).Decode(&input)

	if input.Email == "" {
		http.Error(w, "メールアドレスが必要です", http.StatusBadRequest)
		return
	}

	_, err := db.DB.Exec(
		"INSERT INTO subscribers (email) VALUES ($1)",
		input.Email,
	)
	if err != nil {
		log.Println("DBエラー:", err)
		http.Error(w, "登録失敗", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "購読登録しました"})
}

func GetSubscribers(w http.ResponseWriter, r *http.Request) {
	rows, err := db.DB.Query(
		"SELECT id, email, created_at FROM subscribers ORDER BY created_at DESC",
	)
	if err != nil {
		log.Println("DBエラー:", err)
		http.Error(w, "取得失敗", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	type Subscriber struct {
		ID        int    `json:"id"`
		Email     string `json:"email"`
		CreatedAt string `json:"created_at"`
	}

	var subscribers []Subscriber
	for rows.Next() {
		var s Subscriber
		err := rows.Scan(&s.ID, &s.Email, &s.CreatedAt)
		if err != nil {
			log.Println("スキャンエラー:", err)
			continue
		}
		subscribers = append(subscribers, s)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(subscribers)
}
