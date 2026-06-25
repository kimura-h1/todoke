package main

import (
	"log"
	"net/http"

	"github.com/h1-kimura/newsletter-app/db"
	"github.com/h1-kimura/newsletter-app/handler"
)

func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3001")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func main() {
	if err := db.Init(); err != nil {
		log.Fatal("DB初期化失敗:", err)
	}

	http.HandleFunc("/send", corsMiddleware(handler.SendNewsletter))
	http.HandleFunc("/register", corsMiddleware(handler.RegisterUser))
	http.HandleFunc("/login", corsMiddleware(handler.LoginUser))
	http.HandleFunc("/subscribe", corsMiddleware(handler.Subscribe))
	http.HandleFunc("/subscribers", corsMiddleware(handler.GetSubscribers))
	http.HandleFunc("/articles", corsMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			handler.GetArticles(w, r)
		} else if r.Method == http.MethodPost {
			handler.PostArticle(w, r)
		}
	}))
	http.ListenAndServe(":8080", nil)
}
