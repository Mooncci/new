import { useState, useRef, useEffect } from 'react'
import './App.css'

const MOCK_REPLIES = [
  '嗯，我在呢。',
  '想你了暮暮',
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
  const [conversations, setConversations] = useState([
    { id: 1, title: '新的对话', messages: [] }
  ])
  const [activeConvId, setActiveConvId] = useState(1)
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [genTimer, setGenTimer] = useState(null)

  const [showLeft, setShowLeft] = useState(false)
  const [showRight, setShowRight] = useState(false)
  const [showSheet, setShowSheet] = useState(false)
  const [rightTab, setRightTab] = useState('diary')

  const [searchEnabled, setSearchEnabled] = useState(false)
  const [searchApiKey, setSearchApiKey] = useState('')
  const [activeStyle, setActiveStyle] = useState('default')
  const [customStyles, setCustomStyles] = useState([])
  const [newStyleName, setNewStyleName] = useState('')
  const [newStyleDesc, setNewStyleDesc] = useState('')
  const [mcpServers, setMcpServers] = useState([])
  const [newMcpName, setNewMcpName] = useState('')
  const [newMcpUrl, setNewMcpUrl] = useState('')

  const [diaryEntries, setDiaryEntries] = useState([])
  const [scheduleEntries, setScheduleEntries] = useState([])
  const [memoryEntries, setMemoryEntries] = useState([])
  const [newDiary, setNewDiary] = useState('')
  const [newSchedule, setNewSchedule] = useState('')
  const [newMemory, setNewMemory] = useState('')

  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const imageInputRef = useRef(null)
  const touchStartX = useRef(0)

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const conv = conversations.find(c => c.id === activeConvId)
  const msgs = conv?.messages || []
  const hasMsg = msgs.length > 0

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) < 60) return
    if (dx > 0 && touchStartX.current < 30) setShowLeft(true)
    if (dx < 0 && touchStartX.current > window.innerWidth - 30) setShowRight(true)
  }

  const sendMessage = () => {
    if (!input.trim() || isGenerating) return
    const m = { id: Date.now(), text: input, sender: 'user' }
    setConversations(p => p.map(c =>
      c.id === activeConvId
        ? { ...c, messages: [...c.messages, m], title: c.messages.length === 0 ? input.slice(0, 20) : c.title }
        : c
    ))
    setInput('')
    setIsGenerating(true)
    const timer = setTimeout(() => {
      const r = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)]
      setConversations(p => p.map(c =>
        c.id === activeConvId
          ? { ...c, messages: [...c.messages, { id: Date.now(), text: r, sender: 'bot' }] }
          : c
      ))
      setIsGenerating(false)
    }, 1200)
    setGenTimer(timer)
  }

  const stopGen = () => { if (genTimer) clearTimeout(genTimer); setIsGenerating(false) }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const newChat = () => {
    const id = Date.now()
    setConversations(p => [{ id, title: '新的对话', messages: [] }, ...p])
    setActiveConvId(id)
    setShowLeft(false)
  }

  const switchConv = (id) => { setActiveConvId(id); setShowLeft(false) }

  const pickFile = (type) => {
    if (type === 'image') imageInputRef.current?.click()
    else fileInputRef.current?.click()
    setShowSheet(false)
  }

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setConversations(p => p.map(c =>
      c.id === activeConvId ? { ...c, messages: [...c.messages, { id: Date.now(), text: f.name, sender: 'user' }] } : c
    ))
    e.target.value = ''
  }

  const addMcp = () => {
    if (!newMcpName.trim() || !newMcpUrl.trim()) return
    setMcpServers(p => [...p, { id: Date.now(), name: newMcpName, url: newMcpUrl, connected: false }])
    setNewMcpName(''); setNewMcpUrl('')
  }
  const toggleMcp = (id) => setMcpServers(p => p.map(s => s.id === id ? { ...s, connected: !s.connected } : s))
  const delMcp = (id) => setMcpServers(p => p.filter(s => s.id !== id))

  const addStyle = () => {
    if (!newStyleName.trim()) return
    setCustomStyles(p => [...p, { id: `c${Date.now()}`, name: newStyleName, desc: newStyleDesc || '自定义' }])
    setNewStyleName(''); setNewStyleDesc('')
  }

  const addEntry = (type) => {
    const val = type === 'diary' ? newDiary : type === 'schedule' ? newSchedule : newMemory
    if (!val.trim()) return
    const entry = { id: Date.now(), text: val, date: new Date().toLocaleDateString('zh-CN') }
    if (type === 'diary') { setDiaryEntries(p => [entry, ...p]); setNewDiary('') }
    if (type === 'schedule') { setScheduleEntries(p => [entry, ...p]); setNewSchedule('') }
    if (type === 'memory') { setMemoryEntries(p => [entry, ...p]); setNewMemory('') }
  }

  const allStyles = [...STYLE_PRESETS, ...customStyles]
  const weekdays = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
  const h = currentTime.getHours()
  const greeting = h < 6 ? '夜深了' : h < 11 ? '早上好' : h < 14 ? '中午好' : h < 18 ? '下午好' : '晚上好'
  const timeStr = currentTime.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', hour12: false })
  const dateStr = `${currentTime.getMonth()+1}月${currentTime.getDate()}日 ${weekdays[currentTime.getDay()]}`

  return (
    <div className="app" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

      <div className={`pov ${showLeft ? 's' : ''}`} onClick={() => setShowLeft(false)} />
      <aside className={`lp ${showLeft ? 's' : ''}`}>
        <div className="lp-hd">
          <button className="nc-btn" onClick={newChat}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
            新对话
          </button>
        </div>
        <div className="cv-list">
          {conversations.map(c => (
            <button key={c.id} className={`cv-item ${c.id === activeConvId ? 'act' : ''}`} onClick={() => switchConv(c.id)}>
              {c.title}
            </button>
          ))}
        </div>
      </aside>

      <div className={`pov ${showRight ? 's' : ''}`} onClick={() => setShowRight(false)} />
      <aside className={`rp ${showRight ? 's' : ''}`}>
        <div className="rp-tabs">
          <button className={rightTab === 'diary' ? 'act' : ''} onClick={() => setRightTab('diary')}>日记</button>
          <button className={rightTab === 'schedule' ? 'act' : ''} onClick={() => setRightTab('schedule')}>行程</button>
          <button className={rightTab === 'memory' ? 'act' : ''} onClick={() => setRightTab('memory')}>记忆</button>
        </div>
        <div className="rp-body">
          {['diary','schedule','memory'].map(t => rightTab === t && (
            <div key={t} className="rp-sec">
              <div className="rp-irow">
                <input
                  value={t === 'diary' ? newDiary : t === 'schedule' ? newSchedule : newMemory}
                  onChange={e => t === 'diary' ? setNewDiary(e.target.value) : t === 'schedule' ? setNewSchedule(e.target.value) : setNewMemory(e.target.value)}
                  placeholder={t === 'diary' ? '记录今天...' : t === 'schedule' ? '添加行程...' : '记录一个记忆...'}
                />
                <button onClick={() => addEntry(t)}>{t === 'schedule' ? '添加' : '保存'}</button>
              </div>
              <div className="elist">
                {(t === 'diary' ? diaryEntries : t === 'schedule' ? scheduleEntries : memoryEntries).map(e => (
                  <div key={e.id} className="eitem">
                    <span className="edate">{e.date}</span>
                    <p>{e.text}</p>
                  </div>
                ))}
                {(t === 'diary' ? diaryEntries : t === 'schedule' ? scheduleEntries : memoryEntries).length === 0 && (
                  <div className="ehint">{t === 'diary' ? '还没有日记' : t === 'schedule' ? '还没有行程' : '还没有记忆'}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </aside>

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

        {!hasMsg ? (
          <div className="wlc">
            <div className="wlc-t">{timeStr}</div>
            <div className="wlc-d">{dateStr}</div>
            <div className="wlc-g">{greeting}</div>
            <div className="wlc-w">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              <span>暂无天气数据</span>
            </div>
            <div className="wlc-s">有什么想聊的吗</div>
          </div>
        ) : (
          <div className="msgs">
            {msgs.map(m => (
              <div key={m.id} className={`msg ${m.sender}`}>
                <p className={m.sender === 'user' ? 'tu' : 'tb'}>{m.text}</p>
              </div>
            ))}
            {isGenerating && <div className="msg bot"><div className="typing"><span/><span/><span/></div></div>}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="ina">
          <div className="inb">
            <button className="abtn" onClick={() => setShowSheet(true)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            </button>
            <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="说点什么..." />
            {isGenerating ? (
              <button className="sbtn stop" onClick={stopGen}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
              </button>
            ) : (
              <button className="sbtn" onClick={sendMessage} disabled={!input.trim()}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`ov ${showSheet ? 's' : ''}`} onClick={() => setShowSheet(false)} />
      <div className={`bs ${showSheet ? 's' : ''}`}>
        <div className="bsh" />
        <div className="bsb">
          <div className="sr" onClick={() => pickFile('image')}>
            <div className="srl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#66A870" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <span>图片</span>
            </div>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
          <div className="sd" />
          <div className="sr" onClick={() => pickFile('file')}>
            <div className="srl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#5B9BD5" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span>文件</span>
            </div>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
          </div>
          <div className="sd" />
          <div className="sr">
            <div className="srl">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9B9384" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <div><span>搜索</span><span className="srd">Google 搜索</span></div>
            </div>
            <label className="tgl"><input type="checkbox" checked={searchEnabled} onChange={e => setSearchEnabled(e.target.checked)}/><span className="tgs"/></label>
          </div>
          {searchEnabled && <div className="ssub"><input type="password" value={searchApiKey} onChange={e => setSearchApiKey(e.target.value)} placeholder="Google API Key（待接入）" /></div>}
          <div className="sd" />
          <div className="sst">文风</div>
          <div className="slv">
            {allStyles.map(s => (
              <div key={s.id} className={`strow ${activeStyle === s.id ? 'act' : ''}`} onClick={() => setActiveStyle(s.id)}>
                <div><div className="stn">{s.name}</div><div className="std">{s.desc}</div></div>
                {activeStyle === s.id && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4916E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
              </div>
            ))}
          </div>
          <div className="ssub">
            <input value={newStyleName} onChange={e => setNewStyleName(e.target.value)} placeholder="自定义文风名称" />
            <input value={newStyleDesc} onChange={e => setNewStyleDesc(e.target.value)} placeholder="描述（可选）" />
            <button className="sabb" onClick={addStyle}>添加</button>
          </div>
          <div className="sd" />
          <div className="sst">MCP 服务器</div>
          {mcpServers.map(s => (
            <div key={s.id} className="mr">
              <div className="mrl"><span className={`dot ${s.connected?'on':''}`}/><div><div className="mn">{s.name}</div><div className="mu">{s.url}</div></div></div>
              <div className="ma"><button onClick={() => toggleMcp(s.id)}>{s.connected?'断开':'连接'}</button><button className="mdel" onClick={() => delMcp(s.id)}>删除</button></div>
            </div>
          ))}
          <div className="ssub">
            <input value={newMcpName} onChange={e => setNewMcpName(e.target.value)} placeholder="名称" />
            <input value={newMcpUrl} onChange={e => setNewMcpUrl(e.target.value)} placeholder="服务器地址" />
            <button className="sabb" onClick={addMcp}>添加</button>
          </div>
        </div>
      </div>

      <input ref={imageInputRef} type="file" accept="image/*" hidden onChange={onFile} />
      <input ref={fileInputRef} type="file" hidden onChange={onFile} />
    </div>
  )
}

export default App