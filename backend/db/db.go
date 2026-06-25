package db

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

var DB *sql.DB

func Init() error {
	connStr := "user=newsletter_user password=password dbname=newsletter sslmode=disable"
	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		return fmt.Errorf("DB接続エラー: %w", err)
	}
	return DB.Ping()
}
