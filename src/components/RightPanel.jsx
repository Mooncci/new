import { useState } from 'react'

export default function RightPanel({ show, onClose }) {
  const [tab, setTab] = useState('diary')
  const [diary, setDiary] = useState([])
  const [schedule, setSchedule] = useState([])
  const [memory, setMemory] = useState([])
  const [input, setInput] = useState('')

  const data = tab==='diary'?diary:tab==='schedule'?schedule:memory
  const setData = tab==='diary'?setDiary:tab==='schedule'?setSchedule:setMemory
  const ph = tab==='diary'?'记录今天...':tab==='schedule'?'添加行程...':'记录一个记忆...'
  const empty = tab==='diary'?'还没有日记':tab==='schedule'?'还没有行程':'还没有记忆'

  const add = () => {
    if (!input.trim()) return
    setData(p => [{ id: Date.now(), text: input, date: new Date().toLocaleDateString('zh-CN') }, ...p])
    setInput('')
  }

  const del = (id) => setData(p => p.filter(e => e.id !== id))

  return (
    <>
      <div className={`pov ${show?'s':''}`} onClick={onClose} />
      <aside className={`rp ${show?'s':''}`}>
        <div className="rp-top">
          <div className="rp-tabs">
            {['diary','schedule','memory'].map(t => (
              <button key={t} className={tab===t?'act':''} onClick={() => { setTab(t); setInput('') }}>
                {t==='diary'?'日记':t==='schedule'?'行程':'记忆'}
              </button>
            ))}
          </div>
        </div>

        <div className="rp-body">
          <div className="rp-card">
            <div className="rp-card-hd">
              <span className="rp-card-title">{tab==='diary'?'我的日记':tab==='schedule'?'我的行程':'我的记忆'}</span>
              <span className="rp-card-count">{data.length} 条</span>
            </div>

            <div className="rp-irow">
              <input value={input} onChange={e => setInput(e.target.value)} placeholder={ph}
                onKeyDown={e => { if (e.key==='Enter') add() }} />
              <button className="rp-add-btn" onClick={add}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              </button>
            </div>

            <div className="elist">
              {data.map(e => (
                <div key={e.id} className="eitem">
                  <div className="eitem-top">
                    <span className="edate">{e.date}</span>
                    <button className="edel" onClick={() => del(e.id)}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  <p>{e.text}</p>
                </div>
              ))}
              {data.length === 0 && <div className="ehint">{empty}</div>}
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}