package main

import (
	"flag"
	"net/http"

	"example.com/video_call_app/consumer"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"github.com/padaliyajay/socketconsumer"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func main() {
	var port = "8000"

	flag.StringVar(&port, "port", port, "Port to run the server on")
	flag.Parse()

	hub := socketconsumer.NewHub(upgrader)
	r := gin.Default()

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "pong"})
	})

	r.GET("/ws/call/:dial_code", consumer.ServeCallConsumer(hub))

	r.Run(":" + port)
}
