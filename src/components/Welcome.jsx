import { useState, useEffect } from 'react'

export default function Welcome() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(t)
  }, [])

  const wk = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六']
  const h = time.getHours()
  const gr = h<6?'夜深了':h<11?'早上好':h<14?'中午好':h<18?'下午好':'晚上好'
  const ts = time.toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit',hour12:false})
  const ds = `${time.getMonth()+1}月${time.getDate()}日 ${wk[time.getDay()]}`

  return (
    <div className="wlc">
      <div className="wlc-t">{ts}</div>
      <div className="wlc-d">{ds}</div>
      <div className="wlc-g">{gr}</div>
      <div className="wlc-w">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
        <span>暂无天气数据</span>
      </div>
      <div className="wlc-s">有什么想聊的吗</div>
    </div>
  )
}