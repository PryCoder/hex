import { useEffect, useState } from "react";
import { io } from "socket.io-client";

// SINGLE socket instance outside component
const socket = io("http://localhost:3000", { autoConnect: false });

// Persistent userId
function getUserId() {
  let id = localStorage.getItem("userId");
  if (!id) {
    id = "user-" + Math.random().toString(36).substring(2, 9);
    localStorage.setItem("userId", id);
  }
  return id;
}
const userId = getUserId();

function App() {
  const [welcome, setWelcome] = useState("");
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [room,setRoom] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;
    socket.emit("message", {text,room});
    setText("");
  };

  useEffect(() => {
    try {
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
        socket.emit("register-user", userId, (ack) => {
          console.log("Register user ack:", ack);
        });
      });

      // Welcome message
      socket.on("welcome", (msg, callback) => {
        setWelcome(msg);
        console.log("Received welcome:", msg);
        if (callback) callback("received"); // acknowledge server
      });

      // Current users
      socket.on("current-users", (list) => setUsers(list));

      // Notifications
      socket.on("user-joined", (msg) => setNotifications((prev) => [...prev, msg]));
      socket.on("user-left", (msg) => setNotifications((prev) => [...prev, msg]));

      // Incoming chat messages
      socket.on("message", ({ user, text }) => {
        setMessages((prev) => [...prev, { user, text }]);
      });

      socket.on("error", (err) => {
        console.error("Socket error:", err);
        setError("Socket error occurred");
      });
    } catch (err) {
      console.error("useEffect error:", err);
      setError("Unexpected error");
    }

    return () => {
      socket.off("connect");
      socket.off("welcome");
      socket.off("current-users");
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("message");
      socket.off("error");
    };
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Persistent Socket.IO Chat</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p><strong>Your User ID:</strong> {userId}</p>
      <p><strong>Welcome:</strong> {welcome}</p>

      <h2>Users Online:</h2>
      <ul>{users.map((id) => <li key={id}>{id}</li>)}</ul>

      <h2>Notifications:</h2>
      <ul>{notifications.map((msg, idx) => <li key={idx}>{msg}</li>)}</ul>

      <h2>Messages:</h2>
      <ul>{messages.map((m, idx) => <li key={idx}><strong>{m.user}:</strong> {m.text}</li>)}</ul>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          rows={4}
          cols={50}
        />
        <textarea
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          placeholder="room"
          rows={4}
          cols={50}
        />
        <br />
        <button type="submit" style={{ marginTop: "10px", padding: "5px 15px" }}>
          Send
        </button>
      </form>
    </div>
  );
}

export default App;
