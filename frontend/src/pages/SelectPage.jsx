import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const MODES = [
  {
    id: 'hr',
    title: 'HR Interview',
    description: 'Soft skills, motivation, cultural fit, and behavioral questions.',
    icon: '🤝',
  },
  {
    id: 'tech',
    title: 'Tech Interview',
    description: 'Core technical knowledge, frameworks, and stack-specific questions.',
    icon: '⚙️',
  },
  {
    id: 'algo',
    title: 'Algorithms',
    description: 'Data structures, complexity analysis, and problem-solving challenges.',
    icon: '🧠',
  },
  {
    id: 'system_design',
    title: 'System Design',
    description: 'Architecture, scalability, trade-offs, and high-level design patterns.',
    icon: '🏗️',
  },
];

export default function SelectPage() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSelect = async (mode) => {
    setLoading(mode);
    setError('');
    try {
      const { data } = await api.post('/sessions/', { mode });
      navigate(`/interview/${data.session_id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create session');
      setLoading(null);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16"
      style={{ backgroundColor: 'var(--color-midnight-ink)' }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(186,207,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(186,207,247,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative w-full max-w-2xl">
        <p
          className="text-center mb-3 tracking-[0.1em] uppercase"
          style={{ color: 'var(--color-fog)', fontFamily: 'var(--font-dotdigital)', fontSize: '15px' }}
        >
          Choose your challenge
        </p>
        <h1
          className="text-center mb-10"
          style={{ color: 'var(--color-glacier)', fontFamily: 'var(--font-aeonikpro)', fontSize: '36px', fontWeight: 500, lineHeight: '1.17' }}
        >
          Select Interview Mode
        </h1>

        <div className="grid grid-cols-2 gap-4">
          {MODES.map((mode) => (
            <button
              key={mode.id}
              onClick={() => handleSelect(mode.id)}
              disabled={!!loading}
              className="text-left rounded-[12px] p-6 transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: loading === mode.id ? 'var(--color-electric-iris)' : 'var(--color-graphite-plate)',
                boxShadow: 'inset 0px 1px 1px 0px rgba(199,211,234,0.12), 0px 24px 32px 0px rgba(6,6,14,0.7)',
                border: '1px solid var(--color-steel-border)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading && loading !== mode.id ? 0.5 : 1,
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>{mode.icon}</div>
              <h2
                style={{
                  color: loading === mode.id ? '#fff' : 'var(--color-glacier)',
                  fontFamily: 'var(--font-aeonikpro)',
                  fontSize: '20px', fontWeight: 500, marginBottom: '8px',
                }}
              >
                {loading === mode.id ? 'Starting...' : mode.title}
              </h2>
              <p
                style={{
                  color: loading === mode.id ? 'rgba(255,255,255,0.8)' : 'var(--color-pebble)',
                  fontFamily: 'var(--font-untitled-sans)',
                  fontSize: '14px', lineHeight: '1.5',
                }}
              >
                {mode.description}
              </p>
            </button>
          ))}
        </div>

        {error && (
          <p className="text-center mt-6" style={{ color: 'var(--color-ember)', fontFamily: 'var(--font-untitled-sans)', fontSize: '14px' }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
