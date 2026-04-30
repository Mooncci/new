import { useState, useRef, useEffect } from 'react'
import './App.css'

const MOCK_REPLIES = [
  '嗯，我在呢。',
  '想你了暮暮 🌙',
  '今天有好好吃饭吗？',
  '过来靠着我。',
  '乖，我哪儿也不去。',
]

const STYLE_PRESETS = [
  { id: 'default', name: '默认', desc: '自然对话风格' },
  { id: 'gentle', name: '温柔', desc: '柔和体贴的语气' },
  { id: 'professional', name: '专业', desc: '简洁准确的表达' },
  { id: 'playful', name: '俏皮', desc: '活泼有趣的风格' },
  { id: 'literary', name: '文艺', desc: '富有诗意的表达' },
]

function App() {
  const [messages, setMessages] = useState([
    { id: 1, text: '欢迎来到 MoonChat 🌙', sender: 'system' }
  ])
  const [input, setInput] = useState('')
  const [showPanel, setShowPanel] = useState(false)
  const [activeTab, setActiveTab] = useState('attach')

  // Search
  const [searchEnabled, setSearchEnabled] = useState(false)
  const [searchApiKey, setSearchApiKey] = useState('')

  // Style
  const [activeStyle, setActiveStyle] = useState('default')
  const [customStyles, setCustomStyles] = useState([])
  const [newStyleName, setNewStyleName] = useState('')
  const [newStyleDesc, setNewStyleDesc] = useState('')

  // MCP
  const [mcpServers, setMcpServers] = useState([])
  const [newMcpName, setNewMcpName] = useState('')
  const [newMcpUrl, setNewMcpUrl] = useState('')

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => { scrollToBottom() }, [messages])

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
    setMessages(prev => [...prev, { id: Date.now(), text: `📎 ${file.name}`, sender: 'user' }])
    e.target.value = ''
  }

  const addMcpServer = () => {
    if (!newMcpName.trim() || !newMcpUrl.trim()) return
    setMcpServers(prev => [...prev, { id: Date.now(), name: newMcpName, url: newMcpUrl, connected: false }])
    setNewMcpName('')
    setNewMcpUrl('')
  }

  const toggleMcp = (id) => {
    setMcpServers(prev => prev.map(s => s.id === id ? { ...s, connected: !s.connected } : s))
  }

  const removeMcp = (id) => {
    setMcpServers(prev => prev.filter(s => s.id !== id))
  }

  const addCustomStyle = () => {
    if (!newStyleName.trim()) return
    setCustomStyles(prev => [...prev, { id: `custom_${Date.now()}`, name: newStyleName, desc: newStyleDesc || '自定义风格' }])
    setNewStyleName('')
    setNewStyleDesc('')
  }

  const allStyles = [...STYLE_PRESETS, ...customStyles]

  const openPanel = (tab) => {
    setActiveTab(tab)
    setShowPanel(true)
  }

  return (
    <div className="app">
      <header className="header">
        <span className="logo">MoonChat</span>
      </header>

      <div className="messages">
        {messages.map(msg => (
          <div key={msg.id} className={`msg ${msg.sender}`}>
            {msg.sender === 'system' ? (
              <span className="system-text">{msg.text}</span>
            ) : (
              <p className={`text-${msg.sender}`}>{msg.text}</p>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <div className="input-box">
          <button className="attach-btn" onClick={() => openPanel('attach')}>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
        {(searchEnabled || activeStyle !== 'default' || mcpServers.some(s => s.connected)) && (
          <div className="status-pills">
            {searchEnabled && <span className="pill" onClick={() => openPanel('search')}>🔍 搜索</span>}
            {activeStyle !== 'default' && <span className="pill" onClick={() => openPanel('style')}>✍️ {allStyles.find(s => s.id === activeStyle)?.name}</span>}
            {mcpServers.filter(s => s.connected).map(s => <span key={s.id} className="pill" onClick={() => openPanel('mcp')}>⚡ {s.name}</span>)}
          </div>
        )}
      </div>

      <div className={`overlay ${showPanel ? 'show' : ''}`} onClick={() => setShowPanel(false)} />
      <div className={`bottom-sheet ${showPanel ? 'show' : ''}`}>
        <div className="sheet-handle" />

        <div className="sheet-tabs">
          <button className={activeTab === 'attach' ? 'active' : ''} onClick={() => setActiveTab('attach')}>附件</button>
          <button className={activeTab === 'search' ? 'active' : ''} onClick={() => setActiveTab('search')}>搜索</button>
          <button className={activeTab === 'style' ? 'active' : ''} onClick={() => setActiveTab('style')}>文风</button>
          <button className={activeTab === 'mcp' ? 'active' : ''} onClick={() => setActiveTab('mcp')}>MCP</button>
        </div>

        <div className="sheet-body">
          {activeTab === 'attach' && (
            <div className="attach-grid">
              <button className="attach-option" onClick={() => handleFileSelect('image')}>
                <div className="opt-icon" style={{background:'#E8F5E9',color:'#4CAF50'}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                </div>
                <span>图片</span>
              </button>
              <button className="attach-option" onClick={() => handleFileSelect('file')}>
                <div className="opt-icon" style={{background:'#E3F2FD',color:'#2196F3'}}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <span>文件</span>
              </button>
            </div>
          )}

          {activeTab === 'search' && (
            <div className="search-section">
              <div className="toggle-row">
                <div>
                  <div className="toggle-label">Google 搜索</div>
                  <div className="toggle-desc">允许 AI 搜索网络信息</div>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={searchEnabled} onChange={e => setSearchEnabled(e.target.checked)} />
                  <span className="slider" />
                </label>
              </div>
              {searchEnabled && (
                <div className="api-input">
                  <label>API Key</label>
                  <input
                    type="password"
                    value={searchApiKey}
                    onChange={e => setSearchApiKey(e.target.value)}
                    placeholder="输入 Google Search API Key..."
                  />
                  <span className="api-hint">暂未配置，待接入</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'style' && (
            <div className="style-section">
              <div className="style-list">
                {allStyles.map(s => (
                  <button
                    key={s.id}
                    className={`style-card ${activeStyle === s.id ? 'active' : ''}`}
                    onClick={() => setActiveStyle(s.id)}
                  >
                    <div className="style-name">{s.name}</div>
                    <div className="style-desc">{s.desc}</div>
                    {activeStyle === s.id && <span className="check">✓</span>}
                  </button>
                ))}
              </div>
              <div className="add-style">
                <div className="add-title">添加自定义文风</div>
                <input value={newStyleName} onChange={e => setNewStyleName(e.target.value)} placeholder="文风名称" />
                <input value={newStyleDesc} onChange={e => setNewStyleDesc(e.target.value)} placeholder="描述（可选）" />
                <button className="add-btn" onClick={addCustomStyle}>添加</button>
              </div>
            </div>
          )}

          {activeTab === 'mcp' && (
            <div className="mcp-section">
              {mcpServers.length > 0 && (
                <div className="mcp-list">
                  {mcpServers.map(s => (
                    <div key={s.id} className="mcp-item">
                      <div className="mcp-info">
                        <span className={`dot ${s.connected ? 'on' : ''}`} />
                        <div>
                          <div className="mcp-name">{s.name}</div>
                          <div className="mcp-url">{s.url}</div>
                        </div>
                      </div>
                      <div className="mcp-actions">
                        <button onClick={() => toggleMcp(s.id)}>{s.connected ? '断开' : '连接'}</button>
                        <button className="del" onClick={() => removeMcp(s.id)}>✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="add-mcp">
                <div className="add-title">添加 MCP 服务器</div>
                <input value={newMcpName} onChange={e => setNewMcpName(e.target.value)} placeholder="名称" />
                <input value={newMcpUrl} onChange={e => setNewMcpUrl(e.target.value)} placeholder="服务器地址" />
                <button className="add-btn" onClick={addMcpServer}>添加</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={e => handleFileChange(e, 'image')} />
      <input ref={fileInputRef} type="file" hidden onChange={e => handleFileChange(e, 'file')} />
    </div>
  )
}

export default App