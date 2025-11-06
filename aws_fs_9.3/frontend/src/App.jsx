import { useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export default function App() {
  const [health, setHealth] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API}/api/health`).then(r => r.json()).then(setHealth).catch(console.error);
    fetch(`${API}/api/messages`).then(r => r.json()).then(setMessages).catch(console.error);
  }, []);

  const addMessage = async () => {
    setError(null);
    try {
      const res = await fetch(`${API}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      if (!res.ok) throw new Error('Failed');
      const item = await res.json();
      setMessages(m => [...m, item]);
      setText('');
    } catch (e) {
      setError('Failed to add message');
    }
  };

  return (
    <div style={{maxWidth: 600, margin: '40px auto', fontFamily: 'system-ui'}}>
      <h1>AWS ALB Full Stack Demo</h1>
      <p><strong>API Base:</strong> {API}</p>
      <h3>Health:</h3>
      <pre>{health ? JSON.stringify(health, null, 2) : 'Loading...'}</pre>
      <h3>Messages</h3>
      <ul>
        {messages.map(m => <li key={m.id}>{m.text}</li>)}
      </ul>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message"/>
      <button onClick={addMessage}>Add</button>
      {error && <p style={{color:'red'}}>{error}</p>}
    </div>
  )
}
