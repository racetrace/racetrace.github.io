import { useState, useEffect, useRef, useCallback } from 'react';

export default function useWebSocket(url, options = {}) {
  const { onMessage, onOpen, onClose, reconnectInterval = 3000 } = options;
  const [isConnected, setIsConnected] = useState(false);
  const websocketRef = useRef(null);

  const connect = useCallback(() => {
    const ws = new WebSocket(url, 'json');

    ws.onopen = (event) => {
      setIsConnected(true);
      if (onOpen) onOpen(event);
    };

    ws.onmessage = (event) => {
      if (onMessage) onMessage(event.data);
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      if (onClose) onClose(event);
      // Try reconnecting after a delay if the connection closes unexpectedly
      setTimeout(() => connect(), reconnectInterval);
    };

    websocketRef.current = ws;
  }, [url, onMessage, onOpen, onClose, reconnectInterval]);

  useEffect(() => {
    connect();
    return () => websocketRef.current && websocketRef.current.close();
  }, [connect]);

  const sendMessage = useCallback((message) => {
    if (websocketRef.current && isConnected) {
      websocketRef.current.send(message);
    }
  }, [isConnected]);

  return { isConnected, sendMessage };
}
