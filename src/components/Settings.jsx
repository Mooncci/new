import { useState } from 'react'

function ApiSection({ title, profiles, setProfiles, activeId, setActiveId }) {
  const [form, setForm] = useState({ name: '', baseUrl: '', apiKey: '', model: '' })
  const [models, setModels] = useState([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState('')
  const [editId, setEditId] = useState(null)

  const fetchModels = async () => {
    if (!form.baseUrl || !form.apiKey) return
    setLoadingModels(true); setModels([])
    try {
      const res = await fetch(form.baseUrl.replace(/\/$/, '') + '/v1/models', { headers: { 'Authorization': `Bearer ${form.apiKey}` } })
      const data = await res.json()
      setModels((data.data || []).map(m => m.id).sort())
    } catch (e) { setModels([]); setTestResult('拉取失败: ' + e.message) }
    setLoadingModels(false)
  }

  const testApi = async () => {
    if (!form.baseUrl || !form.apiKey || !form.model) return
    setTesting(true); setTestResult('')
    try {
      const res = await fetch(form.baseUrl.replace(/\/$/, '') + '/v1/chat/completions', {
        method: 'POST', headers: { 'Authorization': `Bearer ${form.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: form.model, messages: [{ role: 'user', content: 'Hi' }], max_tokens: 10 })
      })
      const data = await res.json()
      setTestResult(data.choices ? '连接成功' : '响应异常: ' + JSON.stringify(data).slice(0, 100))
    } catch (e) { setTestResult('连接失败: ' + e.message) }
    setTesting(false)
  }

  const save = () => {
    if (!form.name.trim() || !form.baseUrl.trim()) return
    if (editId) { setProfiles(p => p.map(x => x.id === editId ? { ...x, ...form } : x)); setEditId(null) }
    else { const id = Date.now(); setProfiles(p => [...p, { id, ...form }]); if (!activeId) setActiveId(id) }
    setForm({ name: '', baseUrl: '', apiKey: '', model: '' }); setModels([]); setTestResult('')
  }

  const edit = (p) => { setForm({ name: p.name, baseUrl: p.baseUrl, apiKey: p.apiKey, model: p.model }); setEditId(p.id) }
  const del = (id) => { setProfiles(p => p.filter(x => x.id !== id)); if (activeId === id) setActiveId(null); if (editId === id) { setEditId(null); setForm({ name: '', baseUrl: '', apiKey: '', model: '' }) } }

  return (
    <div className="st-card">
      <div className="st-card-title">{title}</div>
      {profiles.map(p => (
        <div key={p.id} className={`st-item ${activeId===p.id?'act':''}`} onClick={() => setActiveId(p.id)}>
          <div className="st-item-left">
            <div className={`st-radio ${activeId===p.id?'on':''}`} />
            <div><div className="st-item-name">{p.name}</div><div className="st-item-sub">{p.model || '未选择模型'}</div></div>
          </div>
          <div className="st-item-acts"><button onClick={(e) => { e.stopPropagation(); edit(p) }}>编辑</button><button className="del-text" onClick={(e) => { e.stopPropagation(); del(p.id) }}>删除</button></div>
        </div>
      ))}
      <div className="st-form">
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="配置名称" />
        <input value={form.baseUrl} onChange={e => setForm({...form, baseUrl: e.target.value})} placeholder="API Base URL" />
        <input type="password" value={form.apiKey} onChange={e => setForm({...form, apiKey: e.target.value})} placeholder="API Key" />
        <div className="st-model-row"><input value={form.model} onChange={e => setForm({...form, model: e.target.value})} placeholder="模型名称" /><button className="pill-btn" onClick={fetchModels} disabled={loadingModels}>{loadingModels ? '拉取中...' : '拉取模型'}</button></div>
        {models.length > 0 && <div className="model-list">{models.map(m => <button key={m} className={`model-chip ${form.model===m?'act':''}`} onClick={() => setForm({...form, model: m})}>{m}</button>)}</div>}
        <div className="st-form-acts"><button className="pill-btn outline" onClick={testApi} disabled={testing}>{testing ? '测试中...' : '测试连接'}</button><button className="pill-btn primary" onClick={save}>{editId ? '更新' : '保存'}</button></div>
        {testResult && <div className={`test-result ${testResult.includes('成功')?'ok':'fail'}`}>{testResult}</div>}
      </div>
    </div>
  )
}

export default function Settings({ onClose, apiProfiles, setApiProfiles, activeApiId, setActiveApiId, titleApiProfiles, setTitleApiProfiles, activeTitleApiId, setActiveTitleApiId }) {
  return (
    <div className="st-wrap">
      <div className="st-header">
        <button className="st-back" onClick={onClose}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg></button>
        <span className="st-title">设置</span>
        <div style={{width:36}} />
      </div>
      <div className="st-body">
        <div className="st-card">
          <div className="st-row-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M5 20c0-4 3.5-7 7-7s7 3 7 7"/></svg><span>个人资料</span></div>
          <div className="st-row-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg><span>通用设置</span></div>
        </div>

        <div className="st-card">
          <div className="st-card-title">能力</div>
          <div className="st-row-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><div><span>搜索</span><span className="st-row-sub">待接入</span></div></div>
          <div className="st-row-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg><div><span>文风</span><span className="st-row-sub">5 种可用</span></div></div>
        </div>

        <div className="st-card">
          <div className="st-card-title">连接器</div>
          <div className="st-row-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg><div><span>MCP</span><span className="st-row-sub">0 已连接</span></div></div>
        </div>

        <ApiSection title="聊天 API" profiles={apiProfiles} setProfiles={setApiProfiles} activeId={activeApiId} setActiveId={setActiveApiId} />
        <ApiSection title="标题 API（CoT 标题生成）" profiles={titleApiProfiles} setProfiles={setTitleApiProfiles} activeId={activeTitleApiId} setActiveId={setActiveTitleApiId} />

        <div className="st-card">
          <div className="st-row-item"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg><div><span>关于</span><span className="st-row-sub">v0.1.0</span></div></div>
        </div>
      </div>
    </div>
  )
}