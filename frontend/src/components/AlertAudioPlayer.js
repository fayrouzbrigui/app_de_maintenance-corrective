import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5001";

const AlertAudioPlayer = () => {
  const socketRef = useRef(null);
  const audioRef = useRef(null);
  const retryCountRef = useRef(0);
  const connectionTimeoutRef = useRef(null);
  const maxRetries = 3;

  const getToken = () => localStorage.getItem("token");

  // Play audio alerts
  const playAlertAudio = useCallback(async (data) => {
    try {
      const { audioUrl } = data;
      if (!audioUrl) return;

      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      await audio.play();
    } catch (error) {
      console.error("❌ Error playing audio:", error);
    }
  }, []);

  // Connect to the socket (with retry logic inside to avoid circular deps)
  const connectSocket = useCallback(() => {
    const attemptConnection = () => {
      try {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        const token = getToken();
        if (!token) {
          console.warn("⚠️ No token found");
          scheduleRetry();
          return;
        }

        const socket = io(SOCKET_URL, {
          transports: ["websocket"],
          auth: { token },
          extraHeaders: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });

        socket.on("connect", () => {
          console.log(`✅ Socket connected: ${socket.id}`);
          retryCountRef.current = 0;
        });

        socket.on("connect_error", (err) => {
          console.error(`❌ Connection error: ${err.message}`);
          scheduleRetry();
        });

        socket.on("alert", (data) => {
          console.log("📥 Alert received:", data);
          playAlertAudio(data);
        });

        socketRef.current = socket;
      } catch (error) {
        console.error("Socket setup error:", error);
        scheduleRetry();
      }
    };

    const scheduleRetry = () => {
      if (retryCountRef.current < maxRetries) {
        const delay = 2000 * (retryCountRef.current + 1);
        retryCountRef.current += 1;
        console.log(`🔄 Reconnecting... Attempt ${retryCountRef.current}`);
        connectionTimeoutRef.current = setTimeout(attemptConnection, delay);
      } else {
        console.warn("⚠️ Max retries reached. Failed to connect.");
      }
    };

    attemptConnection();
  }, [playAlertAudio]);

  // Initial effect
  useEffect(() => {
    connectSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("🔌 Socket disconnected");
      }
      if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
      if (audioRef.current) audioRef.current.pause();
    };
  }, [connectSocket]);

  return null; // Component does not render UI
};

export default AlertAudioPlayer;