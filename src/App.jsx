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
  const [showPanel, setShowPanel] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showMcp, setShowMcp] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mcpUrl, setMcpUrl] = useState('')
  const [mcpConnected, setMcpConnected] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

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

  const handleFileSelect = (type) => {
    if (type === 'image') imageInputRef.current?.click()
    else fileInputRef.current?.click()
    setShowPanel(false)
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return
    const msg = { id: Date.now(), text: `[${type === 'image' ? '图片' : '文件'}] ${file.name}`, sender: 'user', fileType: type }
    setMessages(prev => [...prev, msg])
    e.target.value = ''
  }

  const filteredMessages = searchQuery
    ? messages.filter(m => m.text.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="logo">MoonChat</span>
        </div>
        <div className="header-right">
          <button className="icon-btn" onClick={() => { setShowSearch(!showSearch); setShowMcp(false) }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <button className="icon-btn" onClick={() => { setShowMcp(!showMcp); setShowSearch(false) }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          </button>
        </div>
      </header>

      {/* Search Bar */}
      {showSearch && (
        <div className="search-bar">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索聊天记录..."
            autoFocus
          />
          {searchQuery && <button className="clear-btn" onClick={() => setSearchQuery('')}>✕</button>}
        </div>
      )}

      {/* MCP Panel */}
      {showMcp && (
        <div className="mcp-panel">
          <div className="mcp-status">
            <span className={`dot ${mcpConnected ? 'connected' : ''}`} />
            <span>{mcpConnected ? '已连接' : '未连接'}</span>
          </div>
          <input
            type="text"
            value={mcpUrl}
            onChange={e => setMcpUrl(e.target.value)}
            placeholder="MCP 服务器地址..."
          />
          <button className="mcp-connect-btn" onClick={() => setMcpConnected(!mcpConnected)}>
            {mcpConnected ? '断开' : '连接'}
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="messages">
        {filteredMessages.map(msg => (
          <div key={msg.id} className={`msg ${msg.sender}`}>
            {msg.sender === 'bot' && <div className="avatar">C</div>}
            <div className={`content ${msg.sender}`}>
              {msg.sender === 'system' ? (
                <span className="system-text">{msg.text}</span>
              ) : (
                <p>{msg.text}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Floating Input */}
      <div className="input-area">
        <div className="input-box">
          <button className="attach-btn" onClick={() => setShowPanel(!showPanel)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="说点什么..."
          />
          <button className="send-btn" onClick={sendMessage} disabled={!input.trim()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className={`overlay ${showPanel ? 'show' : ''}`} onClick={() => setShowPanel(false)} />
      <div className={`bottom-sheet ${showPanel ? 'show' : ''}`}>
        <div className="sheet-handle" />
        <div className="sheet-options">
          <button onClick={() => handleFileSelect('image')}>
            <div className="option-icon img-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            </div>
            <span>图片</span>
          </button>
          <button onClick={() => handleFileSelect('file')}>
            <div className="option-icon file-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <span>文件</span>
          </button>
        </div>
      </div>

      <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={e => handleFileChange(e, 'image')} />
      <input ref={fileInputRef} type="file" hidden onChange={e => handleFileChange(e, 'file')} />
    </div>
  )
}

export default App