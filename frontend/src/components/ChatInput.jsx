function ChatInput({ question, setQuestion, sendQuestion, handleKeyDown }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "12px",
        borderTop: "1px solid #e5e7eb",
        background: "white",
      }}
    >
      <input
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid #d1d5db",
          outline: "none",
          fontSize: "14px",
        }}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Kirjoita kysymys..."
      />
      <button
        onClick={sendQuestion}
        style={{
          padding: "12px 14px",
          borderRadius: "12px",
          border: "none",
          background: "#f59e0b",
          color: "white",
          cursor: "pointer",
          fontWeight: "600",
        }}
      >
        Lähetä
      </button>
    </div>
  )
}

export default ChatInput
