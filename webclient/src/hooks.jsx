import React from "react";

export function useSocket(url) {
  const [socket, setSocket] = React.useState(null);

  React.useEffect(() => {
    const conn = new WebSocket(import.meta.env.VITE_WS_BASE_URL + url);

    conn.onopen = () => {
      console.log("Socket Connected");
      setSocket(conn);
    };

    conn.onclose = () => {
      console.log("Socket Disconnected");
      setSocket(null);
    };

    return () => conn.close();
  }, [url]);

  return socket;
}
