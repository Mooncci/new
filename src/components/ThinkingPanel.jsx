import { useState } from 'react'

export default function ThinkingPanel({ show, onClose, content, title }) {
  const [expanded, setExpanded] = useState(false)
  if (!show) return null
  return (
    <div className="tp-wrap">
      <div className="tp-overlay" onClick={() => { setExpanded(false); onClose() }} />
      <div className={`tp ${expanded?'expanded':''}`}>
        <div className="tp-header" onClick={() => setExpanded(!expanded)}>
          <div className="tp-indicator">
            <span className="think-dot" />
            <span className="tp-label">{title || '思考'}</span>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B5AD9E" strokeWidth="2" strokeLinecap="round" style={{transform:expanded?'rotate(180deg)':'rotate(0)',transition:'transform .3s'}}><path d="M18 15l-6-6-6 6"/></svg>
        </div>
        <div className="tp-body"><div className="tp-text">{content || '正在思考...'}</div></div>
      </div>
    </div>
  )
}