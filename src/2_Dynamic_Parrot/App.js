// 2_Dynamic_Parrot
import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// 'REACT_APP_' 필수
const { REACT_APP_LAMBDA_POST_MSG } = process.env;

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const callApi = async (url, method, body) => {
    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        setMessages(messages);
        console.log("API call failed");
        console.log(response);
        return;
      }
      return response;
    } catch (error) {
      console.error("API call error:", error);
      // 에러 발생시 이전 상태로 복원
      setMessages(messages);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage) return;

    const message = { text: newMessage, sender: "user" };
    setMessages([...messages, message]);
    setNewMessage("");

    callApi(REACT_APP_LAMBDA_POST_MSG, "POST", { content: newMessage })
      .then((res) => res.json())
      .then((res) => {
        const parrotResponse = { text: res, sender: "bot" };
        setMessages((msgs) => [...msgs, parrotResponse]);
      });
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} /> {}
      </div>
      <form className="message-form" onSubmit={sendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
