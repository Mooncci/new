import { useState } from 'react'

export default function RightPanel({ show, onClose }) {
  const [page, setPage] = useState(null)
  const [diary, setDiary] = useState([])
  const [schedule, setSchedule] = useState([])
  const [memory, setMemory] = useState([])
  const [input, setInput] = useState('')

  const data = page==='diary'?diary:page==='schedule'?schedule:memory
  const setData = page==='diary'?setDiary:page==='schedule'?setSchedule:setMemory

  const add = () => { if (!input.trim()) return; setData(p => [{ id: Date.now(), text: input, date: new Date().toLocaleDateString('zh-CN') }, ...p]); setInput('') }
  const del = (id) => setData(p => p.filter(e => e.id !== id))
  const goBack = () => { setPage(null); setInput('') }
  const close = () => { setPage(null); setInput(''); onClose() }

  if (page) {
    return (
      <div className="rp-full">
        <div className="rp-page-hd">
          <button className="rp-back" onClick={goBack}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg></button>
          <span className="rp-page-title">{page==='diary'?'日记':page==='schedule'?'行程':'记忆'}</span>
          <button className="rp-close-btn" onClick={close}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
        </div>
        <div className="rp-page-body">
          <div className="rp-irow">
            <input value={input} onChange={e => setInput(e.target.value)} placeholder={page==='diary'?'记录今天...':page==='schedule'?'添加行程...':'记录一个记忆...'} onKeyDown={e => { if (e.key==='Enter') add() }} />
            <button className="rp-add-btn" onClick={add}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg></button>
          </div>
          <div className="elist">
            {data.map(e => (
              <div key={e.id} className="eitem"><div className="eitem-top"><span className="edate">{e.date}</span><button className="edel" onClick={() => del(e.id)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg></button></div><p>{e.text}</p></div>
            ))}
            {data.length===0 && <div className="ehint">还没有内容</div>}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`pov ${show?'s':''}`} onClick={close} />
      <aside className={`rp ${show?'s':''}`}>
        <div className="rp-top2"><div className="rp-brand">笔记</div></div>
        <div className="rp-menu">
          <button className="lp-menu-item" onClick={() => setPage('diary')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            <span>日记</span><span className="rp-badge">{diary.length}</span>
          </button>
          <button className="lp-menu-item" onClick={() => setPage('schedule')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>行程</span><span className="rp-badge">{schedule.length}</span>
          </button>
          <button className="lp-menu-item" onClick={() => setPage('memory')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            <span>记忆</span><span className="rp-badge">{memory.length}</span>
          </button>
        </div>
      </aside>
    </>
  )
}