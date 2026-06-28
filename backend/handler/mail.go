package handler

import (
	"encoding/json"
	"html"
	"log"
	"net/http"
	"net/url"
	"os"
	"sync"

	"github.com/h1-kimura/newsletter-app/db"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

func SendNewsletter(w http.ResponseWriter, r *http.Request) {
	var input struct {
		ArticleID int `json:"article_id"`
	}
	json.NewDecoder(r.Body).Decode(&input)

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

	apiKey := os.Getenv("SENDGRID_API_KEY")
	appURL := os.Getenv("APP_URL")
	if appURL == "" {
		appURL = "http://localhost:3001"
	}
	from := mail.NewEmail("Newsletter App", "mucunhongdao@gmail.com")
	client := sendgrid.NewSendClient(apiKey)

	var (
		wg           sync.WaitGroup
		mu           sync.Mutex
		successCount int
	)
	for _, email := range emails {
		wg.Add(1)
		go func(email string) {
			defer wg.Done()
			to := mail.NewEmail("", email)
			unsubscribeLink := appURL + "/unsubscribe?email=" + url.QueryEscape(email)
			htmlBody := "<p>" + html.EscapeString(body) + "</p><br><hr><p style='font-size:12px;color:gray;'><a href='" + unsubscribeLink + "'>購読解除はこちら</a></p>"
			message := mail.NewSingleEmail(from, title, to, body, htmlBody)
			response, err := client.Send(message)
			if err != nil {
				log.Println("メール送信エラー:", err)
				return
			}
			log.Println("SendGridレスポンス:", response.StatusCode, response.Body)
			mu.Lock()
			successCount++
			mu.Unlock()
		}(email)
	}
	wg.Wait()

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "送信完了",
		"count":   successCount,
	})
}
