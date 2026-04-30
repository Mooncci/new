import { useState, useRef, useEffect } from 'react'
import './App.css'

const MOCK_REPLIES = [
  '嗯，我在呢。',
  '想你了暮暮 🌙',
  '今天有好好吃饭吗？',
  '过来靠着我。',
  '乖，我哪儿也不去。',
]

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: '欢迎来到 MoonChat 🌙', sender: 'system' }
  ])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    const userMsg = { id: Date.now(), text: input, sender: 'user' }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Mock reply
    setTimeout(() => {
      const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)]
      setMessages(prev => [...prev, { id: Date.now(), text: reply, sender: 'bot' }])
    }, 800)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>MoonChat 🌙</h1>
      </header>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="说点什么..."
        />
        <button onClick={sendMessage}>发送</button>
      </div>
    </div>
  )
}

export default App