package main

import (
	"log"
	"net/http"

	"github.com/h1-kimura/newsletter-app/db"
	"github.com/h1-kimura/newsletter-app/handler"
	"github.com/h1-kimura/newsletter-app/middleware"
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

	// 認証不要
	http.HandleFunc("/register", corsMiddleware(handler.RegisterUser))
	http.HandleFunc("/login", corsMiddleware(handler.LoginUser))
	http.HandleFunc("/subscribe", corsMiddleware(handler.Subscribe))

	// 認証必要
	http.HandleFunc("/articles", corsMiddleware(middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			handler.GetArticles(w, r)
		} else if r.Method == http.MethodPost {
			handler.PostArticle(w, r)
		}
	})))

	http.HandleFunc("/articles/", corsMiddleware(middleware.AuthMiddleware(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet {
			handler.GetArticle(w, r)
		} else if r.Method == http.MethodPut {
			handler.UpdateArticle(w, r)
		} else if r.Method == http.MethodDelete {
			handler.DeleteArticle(w, r)
		}
	})))

	http.HandleFunc("/subscribers", corsMiddleware(middleware.AuthMiddleware(handler.GetSubscribers)))
	http.HandleFunc("/send", corsMiddleware(middleware.AuthMiddleware(handler.SendNewsletter)))
	http.ListenAndServe(":8080", nil)
}
