import { useEffect, useRef, useState } from "react"
import ChatMessage from "./ChatMessage"
import ChatInput from "./ChatInput"

function Chatbot() {
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  const messagesEndRef = useRef(null)

  // 🔹 Lataa viestit localStoragesta
  useEffect(() => {
    const savedMessages = localStorage.getItem("chatMessages")
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    }
  }, [])

  // 🔹 Tallenna viestit localStorageen
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages))
  }, [messages])

  // 🔹 Scroll automaattisesti alas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendQuestion = async () => {
    if (!question.trim()) return

    const userQuestion = question.trim()

    const newMessages = [...messages, { role: "user", text: userQuestion }]

    setMessages(newMessages)
    setQuestion("")
    setLoading(true)

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: userQuestion,
        }),
      })

      const data = await res.json()

      setMessages([...newMessages, { role: "ai", text: data.answer }])
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "ai", text: "Virhe backend-yhteydessä" },
      ])
    }

    setLoading(false)
  }

  // 🔹 Enter lähettää viestin
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendQuestion()
    }
  }

  // 🔹 Tyhjennä chat
  const clearChat = () => {
    setMessages([])
    localStorage.removeItem("chatMessages")
  }

  return (
    <div>
      {/* 💬 Chat nappi */}
      <button onClick={() => setIsOpen(!isOpen)} style={styles.chatButton}>
        💬
      </button>

      {isOpen && (
        <div style={styles.chatContainer}>
          {/* 🔝 Header */}
          <div style={styles.header}>
            <div>
              <div style={styles.headerTitle}>AI Chat</div>
              <div style={styles.headerSubtitle}>
                Kysy toimituksesta, palautuksesta tai hinnoista
              </div>
            </div>

            <div style={{ display: "flex", gap: "6px" }}>
              <button onClick={clearChat} style={styles.smallButton}>
                🗑
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={styles.smallButton}
              >
                ✕
              </button>
            </div>
          </div>

          {/* 💬 Chat area */}
          <div style={styles.chatBox}>
            {messages.length === 0 && (
              <div style={styles.welcomeBox}>
                Hei 👋
                <br />
                Kysy esimerkiksi:
                <div style={styles.example}>• Mikä on palautusaika?</div>
                <div style={styles.example}>
                  • Kuinka kauan toimitus kestää?
                </div>
                <div style={styles.example}>• Paljonko toimitus maksaa?</div>
              </div>
            )}

            {messages.map((msg, index) => (
              <ChatMessage key={index} role={msg.role} text={msg.text} />
            ))}

            {loading && <ChatMessage role="ai" text="AI kirjoittaa..." />}

            <div ref={messagesEndRef} />
          </div>

          {/* ⌨️ Input */}
          <ChatInput
            question={question}
            setQuestion={setQuestion}
            sendQuestion={sendQuestion}
            handleKeyDown={handleKeyDown}
          />
        </div>
      )}
    </div>
  )
}

// 🎨 Styles
const styles = {
  chatButton: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#f59e0b",
    color: "white",
    border: "none",
    width: "60px",
    height: "60px",
    borderRadius: "999px",
    cursor: "pointer",
    fontSize: "24px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
  },
  chatContainer: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    width: "360px",
    height: "520px",
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "18px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
    overflow: "hidden",
  },
  header: {
    background: "#f59e0b",
    color: "white",
    padding: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: "12px",
    marginTop: "4px",
  },
  smallButton: {
    background: "rgba(255,255,255,0.3)",
    border: "none",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "12px",
    background: "#f9fafb",
  },
  welcomeBox: {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "14px",
    padding: "12px",
    marginBottom: "10px",
  },
  example: {
    marginTop: "6px",
  },
}

export default Chatbot
