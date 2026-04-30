import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

const MOCK_THINKING = '用户发送了一条消息，我需要理解意图并给出自然的回复。让我想想怎么回答比较好...\n\n分析用户的语气和内容，这是一次日常对话，我应该保持温和亲切的风格。'
const MOCK_REPLIES = [
  '嗯，我在呢。',
  '想你了暮暮',
  '今天有好好吃饭吗？',
  '过来靠着我。',
  '乖，我哪儿也不去。',
]

function TypeWriter({ text, speed = 30, onDone }) {
  const [displayed, setDisplayed] = useState('')
  const idx = useRef(0)
  useEffect(() => {
    if (!text) return
    idx.current = 0
    setDisplayed('')
    const timer = setInterval(() => {
      idx.current++
      setDisplayed(text.slice(0, idx.current))
      if (idx.current >= text.length) { clearInterval(timer); onDone?.() }
    }, speed)
    return () => clearInterval(timer)
  }, [text, speed])
  return <>{displayed}<span className="cursor">|</span></>
}

export default function Chat({ messages, pushMessage, updateLastBotMsg, apiProfiles, activeApiId, titleApiProfiles, activeTitleApiId, onShowThinking }) {
  const [input, setInput] = useState('')
  const [isGen, setIsGen] = useState(false)
  const [streamText, setStreamText] = useState('')
  const [streamThink, setStreamThink] = useState('')
  const [streamThinkTitle, setStreamThinkTitle] = useState('')
  const [showSheet, setShowSheet] = useState(false)
  const timerRef = useRef(null)
  const thinkTimerRef = useRef(null)
  const endRef = useRef(null)
  const fileRef = useRef(null)
  const imgRef = useRef(null)
  const camRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamText])

  const doStream = useCallback((fullText, thinkText) => {
    setIsGen(true)
    setStreamText('')
    setStreamThink('')
    setStreamThinkTitle('')

    pushMessage({ id: Date.now(), text: '', sender: 'bot', thinking: '', thinkTitle: '' })

    let ti = 0
    const thinkTitle = '思考用户的请求'
    setStreamThinkTitle(thinkTitle)

    thinkTimerRef.current = setInterval(() => {
      ti++
      const chunk = thinkText.slice(0, ti)
      setStreamThink(chunk)
      if (ti >= thinkText.length) {
        clearInterval(thinkTimerRef.current)
        let ci = 0
        timerRef.current = setInterval(() => {
          ci++
          const txt = fullText.slice(0, ci)
          setStreamText(txt)
          updateLastBotMsg(txt, thinkText, thinkTitle)
          if (ci >= fullText.length) {
            clearInterval(timerRef.current)
            setIsGen(false)
          }
        }, 35)
      }
    }, 20)
  }, [pushMessage, updateLastBotMsg])

  const send = () => {
    if (!input.trim() || isGen) return
    pushMessage({ id: Date.now(), text: input, sender: 'user' })
    const msg = input
    setInput('')
    const reply = MOCK_REPLIES[Math.floor(Math.random() * MOCK_REPLIES.length)]
    setTimeout(() => doStream(reply, MOCK_THINKING), 300)
  }

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (thinkTimerRef.current) clearInterval(thinkTimerRef.current)
    setIsGen(false)
  }

  const onKey = (e) => { if (e.key==='Enter'&&!e.shiftKey) { e.preventDefault(); send() } }

  const pickFile = (type) => {
    if (type==='image') imgRef.current?.click()
    else if (type==='camera') camRef.current?.click()
    else fileRef.current?.click()
    setShowSheet(false)
  }

  const onFile = (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    pushMessage({ id: Date.now(), text: f.name, sender: 'user' })
    e.target.value = ''
  }

  const lastMsg = messages[messages.length - 1]
  const isLastBot = lastMsg?.sender === 'bot'

  const inputPortal = typeof document !== 'undefined' && document.getElementById('chat-input-box')

  return (
    <>
      <div className="msgs">
        {messages.map((m, i) => (
          <div key={m.id} className={`msg ${m.sender}`}>
            {m.sender === 'user' ? (
              <p className="tu">{m.text}</p>
            ) : (
              <div className="bot-wrap">
                {(m.thinking || (i === messages.length-1 && isGen && streamThink)) && (
                  <button className="think-btn" onClick={() => onShowThinking(m.thinking || streamThink, m.thinkTitle || streamThinkTitle)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#C4916E" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    <span>{m.thinkTitle || streamThinkTitle || '思考'}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#B5AD9E" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
                  </button>
                )}
                {i === messages.length-1 && isGen ? (
                  <p className="tb">{streamText}<span className="cursor">|</span></p>
                ) : (
                  <p className="tb">{m.text}</p>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      {inputPortal && createPortal(
        <>
          <button className="abtn" onClick={() => setShowSheet(!showSheet)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          </button>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey} placeholder="说点什么..." />
          {isGen ? (
            <button className="sbtn stop" onClick={stop}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
            </button>
          ) : (
            <button className="sbtn" onClick={send} disabled={!input.trim()}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
            </button>
          )}
        </>,
        inputPortal
      )}

      {showSheet && (
        <div className="quick-sheet">
          <div className="qs-attach">
            <button className="qs-opt" onClick={() => pickFile('image')}>
              <div className="qs-icon" style={{background:'#E8F5E9',color:'#4CAF50'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
              <span>图片</span>
            </button>
            <button className="qs-opt" onClick={() => pickFile('file')}>
              <div className="qs-icon" style={{background:'#E3F2FD',color:'#2196F3'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <span>文件</span>
            </button>
            <button className="qs-opt" onClick={() => pickFile('camera')}>
              <div className="qs-icon" style={{background:'#FFF3E0',color:'#FF9800'}}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <span>拍照</span>
            </button>
          </div>
        </div>
      )}

      <input ref={imgRef} type="file" accept="image/*" hidden onChange={onFile} />
      <input ref={fileRef} type="file" hidden onChange={onFile} />
      <input ref={camRef} type="file" accept="image/*" capture="environment" hidden onChange={onFile} />
    </>
  )
}