package handler

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/h1-kimura/newsletter-app/db"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

func SendNewsletter(w http.ResponseWriter, r *http.Request) {
	var input struct {
		ArticleID int `json:"article_id"`
	}
	json.NewDecoder(r.Body).Decode(&input)

	// 記事を取得
	var title, body string
	err := db.DB.QueryRow(
		"SELECT title, body FROM articles WHERE id = $1",
		input.ArticleID,
	).Scan(&title, &body)
	if err != nil {
		log.Println("記事取得エラー:", err)
		http.Error(w, "記事が見つかりません", http.StatusNotFound)
		return
	}

	// 購読者を取得
	rows, err := db.DB.Query("SELECT email FROM subscribers")
	if err != nil {
		log.Println("購読者取得エラー:", err)
		http.Error(w, "購読者取得失敗", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var emails []string
	for rows.Next() {
		var email string
		rows.Scan(&email)
		emails = append(emails, email)
	}

	if len(emails) == 0 {
		http.Error(w, "購読者がいません", http.StatusBadRequest)
		return
	}

	// メール送信
	apiKey := os.Getenv("SENDGRID_API_KEY")
	from := mail.NewEmail("Newsletter App", "mucunhongdao@gmail.com")
	client := sendgrid.NewSendClient(apiKey)

	successCount := 0
	for _, email := range emails {
		to := mail.NewEmail("", email)
		unsubscribeLink := "http://localhost:3001/unsubscribe?email=" + email
		htmlBody := "<p>" + body + "</p><br><hr><p style='font-size:12px;color:gray;'><a href='" + unsubscribeLink + "'>購読解除はこちら</a></p>"
		message := mail.NewSingleEmail(from, title, to, body, htmlBody)
		_, err := client.Send(message)
		response, err := client.Send(message)
		if err != nil {
			log.Println("メール送信エラー:", err)
			continue
		}
		log.Println("SendGridレスポンス:", response.StatusCode, response.Body)
		successCount++
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "送信完了",
		"count":   successCount,
	})
}
