import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', { email, password });
      localStorage.setItem('token', data.access_token);
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-midnight-ink)' }}
    >
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(186,207,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(186,207,247,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div
        className="relative w-full max-w-md rounded-[12px] px-6 py-24"
        style={{
          backgroundColor: 'var(--color-graphite-plate)',
          boxShadow: 'inset 0px 1px 1px 0px rgba(199,211,234,0.12), inset 0px 24px 48px 0px rgba(199,211,234,0.05), 0px 24px 32px 0px rgba(6,6,14,0.7)',
        }}
      >
        <p
          className="text-center mb-4 tracking-[0.1em] uppercase"
          style={{
            color: 'var(--color-fog)',
            fontFamily: 'var(--font-dotdigital)',
            fontSize: '15px',
            lineHeight: '1.2',
          }}
        >
          Get started
        </p>

        <h1
          className="text-center mb-6"
          style={{
            color: 'var(--color-glacier)',
            fontFamily: 'var(--font-aeonikpro)',
            fontSize: '28px',
            lineHeight: '1.17',
            fontWeight: 500,
          }}
        >
          Create your account
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              style={{
                color: 'var(--color-moonlight)',
                fontFamily: 'var(--font-untitled-sans)',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-3 py-2 outline-none rounded-[2px]"
              style={{
                backgroundColor: 'var(--color-midnight-ink)',
                border: '1px solid var(--color-steel-border)',
                color: 'var(--color-moonlight)',
                fontFamily: 'var(--font-untitled-sans)',
                fontSize: '16px',
                letterSpacing: '-0.01em',
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              style={{
                color: 'var(--color-moonlight)',
                fontFamily: 'var(--font-untitled-sans)',
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '-0.01em',
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-3 py-2 outline-none rounded-[2px]"
              style={{
                backgroundColor: 'var(--color-midnight-ink)',
                border: '1px solid var(--color-steel-border)',
                color: 'var(--color-moonlight)',
                fontFamily: 'var(--font-untitled-sans)',
                fontSize: '16px',
                letterSpacing: '-0.01em',
              }}
            />
          </div>

          {error && (
            <p style={{ color: 'var(--color-ember)', fontFamily: 'var(--font-untitled-sans)', fontSize: '14px' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-[10px] rounded-[2px] transition-opacity hover:opacity-90"
            style={{
              backgroundColor: 'var(--color-electric-iris)',
              color: '#ffffff',
              fontFamily: 'var(--font-untitled-sans)',
              fontSize: '16px',
              fontWeight: 500,
              lineHeight: '1.5',
              letterSpacing: '-0.01em',
            }}
          >
            Create account
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-steel-border)' }} />
          <span style={{ color: 'var(--color-fog)', fontSize: '14px', fontFamily: 'var(--font-untitled-sans)' }}>or</span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-steel-border)' }} />
        </div>

        <p
          className="text-center"
          style={{
            color: 'var(--color-pebble)',
            fontFamily: 'var(--font-untitled-sans)',
            fontSize: '14px',
            letterSpacing: '-0.01em',
          }}
        >
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--color-frost-link)' }} className="hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
