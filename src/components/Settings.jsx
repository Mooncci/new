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
    setLoadingModels(true)
    setModels([])
    try {
      const url = form.baseUrl.replace(/\/$/, '') + '/v1/models'
      const res = await fetch(url, { headers: { 'Authorization': `Bearer ${form.apiKey}` } })
      const data = await res.json()
      const list = (data.data || []).map(m => m.id).sort()
      setModels(list)
    } catch (e) {
      setModels([])
      setTestResult('拉取失败: ' + e.message)
    }
    setLoadingModels(false)
  }

  const testApi = async () => {
    if (!form.baseUrl || !form.apiKey || !form.model) return
    setTesting(true)
    setTestResult('')
    try {
      const url = form.baseUrl.replace(/\/$/, '') + '/v1/chat/completions'
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${form.apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: form.model, messages: [{ role: 'user', content: 'Hi' }], max_tokens: 10 })
      })
      const data = await res.json()
      if (data.choices) setTestResult('连接成功')
      else setTestResult('响应异常: ' + JSON.stringify(data).slice(0, 100))
    } catch (e) {
      setTestResult('连接失败: ' + e.message)
    }
    setTesting(false)
  }

  const save = () => {
    if (!form.name.trim() || !form.baseUrl.trim()) return
    if (editId) {
      setProfiles(p => p.map(x => x.id === editId ? { ...x, ...form } : x))
      setEditId(null)
    } else {
      const id = Date.now()
      setProfiles(p => [...p, { id, ...form }])
      if (!activeId) setActiveId(id)
    }
    setForm({ name: '', baseUrl: '', apiKey: '', model: '' })
    setModels([])
    setTestResult('')
  }

  const edit = (p) => {
    setForm({ name: p.name, baseUrl: p.baseUrl, apiKey: p.apiKey, model: p.model })
    setEditId(p.id)
    setModels([])
    setTestResult('')
  }

  const del = (id) => {
    setProfiles(p => p.filter(x => x.id !== id))
    if (activeId === id) setActiveId(null)
    if (editId === id) { setEditId(null); setForm({ name: '', baseUrl: '', apiKey: '', model: '' }) }
  }

  return (
    <div className="st-section">
      <div className="st-sec-title">{title}</div>

      {profiles.length > 0 && (
        <div className="api-list">
          {profiles.map(p => (
            <div key={p.id} className={`api-card ${activeId===p.id?'act':''}`}>
              <div className="api-card-left" onClick={() => setActiveId(p.id)}>
                <div className={`api-radio ${activeId===p.id?'on':''}`} />
                <div>
                  <div className="api-card-name">{p.name}</div>
                  <div className="api-card-model">{p.model || '未选择模型'}</div>
                </div>
              </div>
              <div className="api-card-acts">
                <button onClick={() => edit(p)}>编辑</button>
                <button className="del-text" onClick={() => del(p.id)}>删除</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="api-form">
        <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="配置名称" />
        <input value={form.baseUrl} onChange={e => setForm({...form, baseUrl: e.target.value})} placeholder="API Base URL，如 https://api.openai.com" />
        <input type="password" value={form.apiKey} onChange={e => setForm({...form, apiKey: e.target.value})} placeholder="API Key" />

        <div className="api-model-row">
          <input value={form.model} onChange={e => setForm({...form, model: e.target.value})} placeholder="模型名称" />
          <button className="pill-btn" onClick={fetchModels} disabled={loadingModels}>
            {loadingModels ? '拉取中...' : '拉取模型'}
          </button>
        </div>

        {models.length > 0 && (
          <div className="model-list">
            {models.map(m => (
              <button key={m} className={`model-chip ${form.model===m?'act':''}`} onClick={() => setForm({...form, model: m})}>{m}</button>
            ))}
          </div>
        )}

        <div className="api-actions">
          <button className="pill-btn outline" onClick={testApi} disabled={testing}>
            {testing ? '测试中...' : '测试连接'}
          </button>
          <button className="pill-btn primary" onClick={save}>
            {editId ? '更新' : '保存'}
          </button>
        </div>

        {testResult && <div className={`test-result ${testResult.includes('成功')?'ok':'fail'}`}>{testResult}</div>}
      </div>
    </div>
  )
}

export default function Settings({ onClose, apiProfiles, setApiProfiles, activeApiId, setActiveApiId, titleApiProfiles, setTitleApiProfiles, activeTitleApiId, setActiveTitleApiId }) {
  const [tab, setTab] = useState('api')

  return (
    <div className="st-wrap">
      <div className="st-header">
        <button className="st-back" onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <span className="st-title">设置</span>
        <div style={{width:36}} />
      </div>

      <div className="st-tabs">
        <button className={tab==='api'?'act':''} onClick={() => setTab('api')}>聊天 API</button>
        <button className={tab==='title'?'act':''} onClick={() => setTab('title')}>标题 API</button>
        <button className={tab==='general'?'act':''} onClick={() => setTab('general')}>通用</button>
      </div>

      <div className="st-body">
        {tab === 'api' && (
          <ApiSection title="聊天 API 配置（OpenAI 兼容）" profiles={apiProfiles} setProfiles={setApiProfiles} activeId={activeApiId} setActiveId={setActiveApiId} />
        )}
        {tab === 'title' && (
          <ApiSection title="标题生成 API（用于 CoT 标题）" profiles={titleApiProfiles} setProfiles={setTitleApiProfiles} activeId={activeTitleApiId} setActiveId={setActiveTitleApiId} />
        )}
        {tab === 'general' && (
          <div className="st-section">
            <div className="st-sec-title">通用设置</div>
            <div className="st-row">
              <span>消息气泡样式</span>
              <span className="st-val">淡色</span>
            </div>
            <div className="st-row">
              <span>打字速度</span>
              <span className="st-val">正常</span>
            </div>
            <div className="st-row">
              <span>思考过程</span>
              <span className="st-val">显示</span>
            </div>
            <div className="st-row">
              <span>版本</span>
              <span className="st-val">0.1.0</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}