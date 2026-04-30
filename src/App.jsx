import { useState, useRef, useEffect } from 'react'
import LeftPanel from './components/LeftPanel'
import RightPanel from './components/RightPanel'
import Settings from './components/Settings'
import Chat from './components/Chat'
import Welcome from './components/Welcome'
import BottomSheet from './components/BottomSheet'
import ThinkingPanel from './components/ThinkingPanel'
import './App.css'

export default function App() {
  const [conversations, setConversations] = useState([
    { id: 1, title: '新的对话', messages: [] }
  ])
  const [activeConvId, setActiveConvId] = useState(1)
  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [showSheet, setShowSheet] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showThinking, setShowThinking] = useState(false)
  const [thinkingContent, setThinkingContent] = useState('')
  const [thinkingTitle, setThinkingTitle] = useState('')

  const [searchEnabled, setSearchEnabled] = useState(false)
  const [searchApiKey, setSearchApiKey] = useState('')
  const [activeStyle, setActiveStyle] = useState('default')
  const [customStyles, setCustomStyles] = useState([])
  const [mcpServers, setMcpServers] = useState([])

  const [apiProfiles, setApiProfiles] = useState([])
  const [activeApiId, setActiveApiId] = useState(null)
  const [titleApiProfiles, setTitleApiProfiles] = useState([])
  const [activeTitleApiId, setActiveTitleApiId] = useState(null)

  const touchStartX = useRef(0)

  const conv = conversations.find(c => c.id === activeConvId)
  const msgs = conv?.messages || []

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) < 60) return
    if (dx > 0 && touchStartX.current < 30) setShowLeft(true)
    if (dx < 0 && touchStartX.current > window.innerWidth - 30) setShowRight(true)
  }

  const newChat = () => {
    const id = Date.now()
    setConversations(p => [{ id, title: '新的对话', messages: [] }, ...p])
    setActiveConvId(id)
    setShowLeft(false)
  }

  const deleteConv = (id) => {
    setConversations(p => p.filter(c => c.id !== id))
    if (activeConvId === id) {
      const remaining = conversations.filter(c => c.id !== id)
      if (remaining.length > 0) setActiveConvId(remaining[0].id)
      else { const nid = Date.now(); setConversations([{ id: nid, title: '新的对话', messages: [] }]); setActiveConvId(nid) }
    }
  }

  const pushMessage = (msg) => {
    setConversations(p => p.map(c =>
      c.id === activeConvId
        ? { ...c, messages: [...c.messages, msg], title: c.messages.length === 0 ? msg.text.slice(0, 20) : c.title }
        : c
    ))
  }

  const updateLastBotMsg = (text, thinking, thinkTitle) => {
    setConversations(p => p.map(c => {
      if (c.id !== activeConvId) return c
      const ms = [...c.messages]
      const last = ms[ms.length - 1]
      if (last && last.sender === 'bot') ms[ms.length - 1] = { ...last, text, thinking: thinking || last.thinking, thinkTitle: thinkTitle || last.thinkTitle }
      return { ...c, messages: ms }
    }))
  }

  return (
    <div className="app" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <LeftPanel show={showLeft} onClose={() => setShowLeft(false)} conversations={conversations} activeId={activeConvId}
        onSwitch={(id) => { setActiveConvId(id); setShowLeft(false) }} onNew={newChat} onDelete={deleteConv}
        onOpenSettings={() => { setShowSettings(true); setShowLeft(false) }} />

      <RightPanel show={showRight} onClose={() => setShowRight(false)} />

      <div className="main">
        <header className="hd">
          <button className="hb" onClick={() => setShowLeft(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
          </button>
          <span className="logo">MoonChat</span>
          <button className="hb" onClick={() => setShowRight(true)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M8 4v16"/><path d="M15 9h3M15 13h3"/></svg>
          </button>
        </header>

        {msgs.length === 0 ? (
          <Welcome />
        ) : (
          <Chat
            messages={msgs}
            pushMessage={pushMessage}
            updateLastBotMsg={updateLastBotMsg}
            apiProfiles={apiProfiles}
            activeApiId={activeApiId}
            titleApiProfiles={titleApiProfiles}
            activeTitleApiId={activeTitleApiId}
            onShowThinking={(content, title) => { setThinkingContent(content); setThinkingTitle(title); setShowThinking(true) }}
          />
        )}

        <div className="ina">
          <div className="inb" id="chat-input-box" />
        </div>
      </div>

      <BottomSheet show={showSheet} onClose={() => setShowSheet(false)}
        searchEnabled={searchEnabled} setSearchEnabled={setSearchEnabled}
        searchApiKey={searchApiKey} setSearchApiKey={setSearchApiKey}
        activeStyle={activeStyle} setActiveStyle={setActiveStyle}
        customStyles={customStyles} setCustomStyles={setCustomStyles}
        mcpServers={mcpServers} setMcpServers={setMcpServers} />

      <ThinkingPanel show={showThinking} onClose={() => setShowThinking(false)}
        content={thinkingContent} title={thinkingTitle} />

      {showSettings && (
        <Settings onClose={() => setShowSettings(false)}
          apiProfiles={apiProfiles} setApiProfiles={setApiProfiles}
          activeApiId={activeApiId} setActiveApiId={setActiveApiId}
          titleApiProfiles={titleApiProfiles} setTitleApiProfiles={setTitleApiProfiles}
          activeTitleApiId={activeTitleApiId} setActiveTitleApiId={setActiveTitleApiId} />
      )}
    </div>
  )
}