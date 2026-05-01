import { useState, useEffect } from 'react'

function ApiSection({ title, profiles, setProfiles, activeId, setActiveId }) {
  const [form, setForm] = useState({ name:'', baseUrl:'', apiKey:'', model:'' })
  const [models, setModels] = useState([])
  const [loading, setLoading] = useState(false)
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState('')
  const [editId, setEditId] = useState(null)

  const fetchModels = async () => {
    if (!form.baseUrl||!form.apiKey) return; setLoading(true); setModels([])
    try { const r = await fetch(form.baseUrl.replace(/\/$/,'')+'/v1/models',{headers:{'Authorization':`Bearer ${form.apiKey}`}}); const d = await r.json(); setModels((d.data||[]).map(m=>m.id).sort()) } catch(e) { setResult('拉取失败: '+e.message) }
    setLoading(false)
  }
  const testApi = async () => {
    if (!form.baseUrl||!form.apiKey||!form.model) return; setTesting(true); setResult('')
    try { const r = await fetch(form.baseUrl.replace(/\/$/,'')+'/v1/chat/completions',{method:'POST',headers:{'Authorization':`Bearer ${form.apiKey}`,'Content-Type':'application/json'},body:JSON.stringify({model:form.model,messages:[{role:'user',content:'Hi'}],max_tokens:10})}); const d = await r.json(); setResult(d.choices?'连接成功':'异常') } catch(e) { setResult('失败: '+e.message) }
    setTesting(false)
  }
  const save = () => {
    if (!form.name.trim()||!form.baseUrl.trim()) return
    if (editId) { setProfiles(p=>p.map(x=>x.id===editId?{...x,...form}:x)); setEditId(null) }
    else { const id=Date.now(); setProfiles(p=>[...p,{id,...form}]); if(!activeId) setActiveId(id) }
    setForm({name:'',baseUrl:'',apiKey:'',model:''}); setModels([]); setResult('')
  }
  const edit = (p) => { setForm({name:p.name,baseUrl:p.baseUrl,apiKey:p.apiKey,model:p.model}); setEditId(p.id) }
  const del = (id) => { setProfiles(p=>p.filter(x=>x.id!==id)); if(activeId===id) setActiveId(null) }

  return (
    <div className="st-sec">
      <div className="st-sec-title">{title}</div>
      {profiles.map(p => (
        <div key={p.id} className={`st-api-item ${activeId===p.id?'act':''}`} onClick={() => setActiveId(p.id)}>
          <div className="st-api-left"><div className={`st-radio ${activeId===p.id?'on':''}`}/><div><div className="st-api-name">{p.name}</div><div className="st-api-sub">{p.model||'未选择'}</div></div></div>
          <div className="st-api-acts"><button onClick={e=>{e.stopPropagation();edit(p)}}>编辑</button><button className="del-text" onClick={e=>{e.stopPropagation();del(p.id)}}>删除</button></div>
        </div>
      ))}
      <div className="st-form">
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="配置名称" />
        <input value={form.baseUrl} onChange={e=>setForm({...form,baseUrl:e.target.value})} placeholder="API Base URL" />
        <input type="password" value={form.apiKey} onChange={e=>setForm({...form,apiKey:e.target.value})} placeholder="API Key" />
        <div className="st-model-row"><input value={form.model} onChange={e=>setForm({...form,model:e.target.value})} placeholder="模型" /><button className="pill-btn" onClick={fetchModels} disabled={loading}>{loading?'拉取中...':'拉取'}</button></div>
        {models.length>0 && <div className="model-list">{models.map(m=><button key={m} className={`model-chip ${form.model===m?'act':''}`} onClick={()=>setForm({...form,model:m})}>{m}</button>)}</div>}
        <div className="st-form-acts"><button className="pill-btn outline" onClick={testApi} disabled={testing}>{testing?'测试中...':'测试'}</button><button className="pill-btn primary" onClick={save}>{editId?'更新':'保存'}</button></div>
        {result && <div className={`test-result ${result.includes('成功')?'ok':'fail'}`}>{result}</div>}
      </div>
    </div>
  )
}

const THEMES = [
  { id:'light', name:'浅色' },
  { id:'dark', name:'深色' },
  { id:'system', name:'跟随系统' },
]

const FONTS = [
  { id:'default', name:'默认' },
  { id:'serif', name:'衬线' },
  { id:'mono', name:'等宽' },
]

export default function Settings({ onClose, apiProfiles, setApiProfiles, activeApiId, setActiveApiId, titleApiProfiles, setTitleApiProfiles, activeTitleApiId, setActiveTitleApiId }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('mc-theme') || 'light')
  const [font, setFont] = useState(() => localStorage.getItem('mc-font') || 'default')
  const [showCot, setShowCot] = useState(() => localStorage.getItem('mc-cot') !== 'false')
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('mc-fontsize') || 'default')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('mc-theme', theme)
  }, [theme])

  useEffect(() => {
    document.documentElement.setAttribute('data-font', font)
    localStorage.setItem('mc-font', font)
  }, [font])

  useEffect(() => {
    document.documentElement.setAttribute('data-fontsize', fontSize)
    localStorage.setItem('mc-fontsize', fontSize)
  }, [fontSize])

  useEffect(() => { localStorage.setItem('mc-cot', showCot) }, [showCot])

  const cycleTheme = () => { const i = THEMES.findIndex(t=>t.id===theme); setTheme(THEMES[(i+1)%THEMES.length].id) }
  const cycleFont = () => { const i = FONTS.findIndex(f=>f.id===font); setFont(FONTS[(i+1)%FONTS.length].id) }
  const cycleFontSize = () => { const sizes = ['small','default','large']; const i = sizes.indexOf(fontSize); setFontSize(sizes[(i+1)%sizes.length]) }
  const sizeLabel = fontSize === 'small' ? '小' : fontSize === 'large' ? '大' : '默认'

  return (
    <div className="st-wrap">
      <div className="st-header">
        <button className="st-back" onClick={onClose}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg></button>
        <span className="st-title">设置</span>
        <div style={{width:36}} />
      </div>
      <div className="st-body">
        <div className="st-sec">
          <div className="st-sec-title">外观</div>
          <div className="st-row" onClick={cycleTheme}>
            <div className="st-row-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              <span>主题</span>
            </div>
            <span className="st-val">{THEMES.find(t=>t.id===theme)?.name}</span>
          </div>
          <div className="st-row" onClick={cycleFont}>
            <div className="st-row-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
              <span>字体</span>
            </div>
            <span className="st-val">{FONTS.find(f=>f.id===font)?.name}</span>
          </div>
          <div className="st-row" onClick={cycleFontSize}>
            <div className="st-row-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19l4-14h1l4 14"/><path d="M6 13h5"/><path d="M15 17l2-6h.5l2 6"/><path d="M16 15h2.5"/></svg>
              <span>字体大小</span>
            </div>
            <span className="st-val">{sizeLabel}</span>
          </div>
        </div>

        <div className="st-sec">
          <div className="st-sec-title">功能</div>
          <div className="st-row">
            <div className="st-row-left">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span>思考过程</span>
            </div>
            <label className="tgl"><input type="checkbox" checked={showCot} onChange={e => setShowCot(e.target.checked)}/><span className="tgs"/></label>
          </div>
        </div>

        <ApiSection title="聊天 API（OpenAI 兼容）" profiles={apiProfiles} setProfiles={setApiProfiles} activeId={activeApiId} setActiveId={setActiveApiId} />
        <ApiSection title="标题 API（CoT 标题生成）" profiles={titleApiProfiles} setProfiles={setTitleApiProfiles} activeId={activeTitleApiId} setActiveId={setActiveTitleApiId} />

        <div className="st-sec">
          <div className="st-sec-title">关于</div>
          <div className="st-row"><div className="st-row-left"><span>版本</span></div><span className="st-val">0.1.0</span></div>
          <div className="st-row"><div className="st-row-left"><span>开发者</span></div><span className="st-val">Mooncci & Claude</span></div>
        </div>
      </div>
    </div>
  )
}