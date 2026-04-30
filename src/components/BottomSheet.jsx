import { useState } from 'react'

const STYLE_PRESETS = [
  { id: 'default', name: '默认', desc: '自然对话风格' },
  { id: 'gentle', name: '温柔', desc: '柔和体贴的语气' },
  { id: 'professional', name: '专业', desc: '简洁准确的表达' },
  { id: 'playful', name: '俏皮', desc: '活泼有趣的风格' },
  { id: 'literary', name: '文艺', desc: '富有诗意的表达' },
]

export default function BottomSheet({ show, onClose, searchEnabled, setSearchEnabled, searchApiKey, setSearchApiKey, activeStyle, setActiveStyle, customStyles, setCustomStyles, mcpServers, setMcpServers }) {
  const [newStyleName, setNewStyleName] = useState('')
  const [newStyleDesc, setNewStyleDesc] = useState('')
  const [newMcpName, setNewMcpName] = useState('')
  const [newMcpUrl, setNewMcpUrl] = useState('')

  const allStyles = [...STYLE_PRESETS, ...customStyles]

  const addStyle = () => {
    if (!newStyleName.trim()) return
    setCustomStyles(p => [...p, { id: `c${Date.now()}`, name: newStyleName, desc: newStyleDesc || '自定义' }])
    setNewStyleName(''); setNewStyleDesc('')
  }

  const addMcp = () => {
    if (!newMcpName.trim() || !newMcpUrl.trim()) return
    setMcpServers(p => [...p, { id: Date.now(), name: newMcpName, url: newMcpUrl, connected: false }])
    setNewMcpName(''); setNewMcpUrl('')
  }

  const toggleMcp = (id) => setMcpServers(p => p.map(s => s.id===id ? {...s, connected: !s.connected} : s))
  const delMcp = (id) => setMcpServers(p => p.filter(s => s.id !== id))

  return (
    <>
      <div className={`ov ${show?'s':''}`} onClick={onClose} />
      <div className={`bs ${show?'s':''}`}>
        <div className="bsh" />
        <div className="bsb">
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
              <div key={s.id} className={`strow ${activeStyle===s.id?'act':''}`} onClick={() => setActiveStyle(s.id)}>
                <div><div className="stn">{s.name}</div><div className="std">{s.desc}</div></div>
                {activeStyle===s.id && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C4916E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>}
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
    </>
  )
}