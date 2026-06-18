import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError('');

    try {
      const { data } = await api.post('/chat', {
        user_message: text,
        session_id: id,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);

      if (data.done) {
        navigate(`/report/${id}`);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: 'var(--color-midnight-ink)' }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid var(--color-steel-border)' }}
      >
        <h1
          style={{
            color: 'var(--color-glacier)',
            fontFamily: 'var(--font-aeonikpro)',
            fontSize: '20px', fontWeight: 500,
          }}
        >
          Offer Mania
        </h1>
        <span
          style={{
            color: 'var(--color-fog)',
            fontFamily: 'var(--font-untitled-sans)',
            fontSize: '13px',
          }}
        >
          Session #{id.slice(0, 8)}
        </span>
      </div>

      {/* messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-4 max-w-3xl w-full mx-auto">
        {messages.length === 0 && !loading && (
          <p
            className="text-center mt-16"
            style={{ color: 'var(--color-fog)', fontFamily: 'var(--font-untitled-sans)', fontSize: '16px' }}
          >
            The interviewer is ready. Send your first message to begin.
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className="flex"
            style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}
          >
            <div
              className="rounded-[10px] px-4 py-3 max-w-[75%]"
              style={{
                backgroundColor: msg.role === 'user' ? 'var(--color-electric-iris)' : 'var(--color-graphite-plate)',
                boxShadow: 'inset 0px 1px 1px 0px rgba(199,211,234,0.08)',
                color: msg.role === 'user' ? '#fff' : 'var(--color-moonlight)',
                fontFamily: 'var(--font-untitled-sans)',
                fontSize: '15px', lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="rounded-[10px] px-4 py-3"
              style={{
                backgroundColor: 'var(--color-graphite-plate)',
                color: 'var(--color-fog)',
                fontFamily: 'var(--font-untitled-sans)',
                fontSize: '15px',
              }}
            >
              Thinking...
            </div>
          </div>
        )}

        {error && (
          <p className="text-center" style={{ color: 'var(--color-ember)', fontFamily: 'var(--font-untitled-sans)', fontSize: '14px' }}>
            {error}
          </p>
        )}

        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div
        className="px-4 py-4"
        style={{ borderTop: '1px solid var(--color-steel-border)' }}
      >
        <div className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your answer... (Enter to send)"
            rows={2}
            className="flex-1 resize-none outline-none rounded-[2px] px-3 py-2"
            style={{
              backgroundColor: 'var(--color-graphite-plate)',
              border: '1px solid var(--color-steel-border)',
              color: 'var(--color-moonlight)',
              fontFamily: 'var(--font-untitled-sans)',
              fontSize: '15px', lineHeight: '1.5',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-5 rounded-[2px] transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-electric-iris)',
              color: '#fff',
              fontFamily: 'var(--font-untitled-sans)',
              fontSize: '15px', fontWeight: 500,
              opacity: loading || !input.trim() ? 0.5 : 1,
              cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
