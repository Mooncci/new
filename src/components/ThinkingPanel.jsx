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
            <div className="tp-sparkle"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4916E" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
            <span className="tp-label">{title || '思考'}</span>
          </div>
          <div className="tp-toggle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B5AD9E" strokeWidth="2" strokeLinecap="round" style={{transform:expanded?'rotate(180deg)':'rotate(0)',transition:'transform .3s'}}><path d="M18 15l-6-6-6 6"/></svg>
          </div>
        </div>
        <div className="tp-body"><pre className="tp-text">{content || '正在思考...'}</pre></div>
      </div>
    </div>
  )
}