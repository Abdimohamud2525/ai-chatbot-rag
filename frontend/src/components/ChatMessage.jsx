function ChatMessage({ role, text }) {
  const isUser = role === "user"

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          maxWidth: "80%",
          background: isUser ? "#f59e0b" : "white",
          color: isUser ? "white" : "#111827",
          padding: "10px 12px",
          borderRadius: "16px",
          borderTopRightRadius: isUser ? "4px" : "16px",
          borderTopLeftRadius: isUser ? "16px" : "4px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          lineHeight: 1.4,
          fontSize: "14px",
          border: isUser ? "none" : "1px solid #e5e7eb",
        }}
      >
        {text}
      </div>
    </div>
  )
}

export default ChatMessage
