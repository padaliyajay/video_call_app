package consumer

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/padaliyajay/socketconsumer"
)

type CallConsumer struct {
	dialCode string

	*socketconsumer.Consumer
}

func ServeCallConsumer(hub *socketconsumer.Hub) func(c *gin.Context) {
	return func(c *gin.Context) {
		socketconsumer.ServeWS(hub, c.Writer, c.Request, &CallConsumer{
			dialCode: c.Param("dial_code"),
			Consumer: socketconsumer.NewConsumer(hub),
		})
	}
}

// Create group
func (c *CallConsumer) Accept() {
	c.GroupAdd(c.dialCode)
	log.Println("Accepted", c.dialCode)
}

// Close group
func (c *CallConsumer) Disconnect() {
	c.GroupDiscard(c.dialCode)
	log.Println("Disconnected", c.dialCode)
}

// Receive message
func (c *CallConsumer) Receive(message *socketconsumer.Message) {
	if message.Type == "message" {
		message_data := map[string]interface{}{"is_you": false, "text": message.Data}
		c.GroupSendOthers(c.dialCode, socketconsumer.NewMessage("message", message_data))

		message_data["is_you"] = true
		c.Send(socketconsumer.NewMessage("message", message_data))
	} else {
		c.GroupSendOthers(c.dialCode, message)
	}
}
