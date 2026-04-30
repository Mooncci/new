export default function ThinkingPanel({ show, onClose, content, title }) {
  if (!show) return null
  return (
    <div className="tp-wrap">
      <div className="tp-overlay" onClick={onClose} />
      <div className={`tp ${show?'s':''}`}>
        <div className="tp-handle" />
        <div className="tp-header">
          <div className="tp-indicator">
            <div className="tp-sparkle">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C4916E" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            </div>
            <span className="tp-label">{title || '思考'}</span>
          </div>
          <button className="tp-close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="tp-body">
          <pre className="tp-text">{content || '正在思考...'}</pre>
        </div>
      </div>
    </div>
  )
}