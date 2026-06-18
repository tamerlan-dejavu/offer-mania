import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

const STEPS = ['Target Role', 'Stack & Level', 'Focus Areas'];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    target_role: '',
    stack: '',
    experience_level: 'junior',
    focus_areas: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError('');
    try {
      await api.post('/onboarding/setup', {
        target_role: form.target_role,
        stack: form.stack.split(',').map(s => s.trim()).filter(Boolean),
        experience_level: form.experience_level,
        focus_areas: form.focus_areas.split(',').map(s => s.trim()).filter(Boolean),
      });
      navigate('/select');
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--color-midnight-ink)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* step indicator */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
          {STEPS.map((label, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: i <= step ? 'var(--color-electric-iris)' : 'var(--color-graphite-plate)',
                color: i <= step ? '#fff' : 'var(--color-fog)',
                fontSize: '13px', fontFamily: 'var(--font-untitled-sans)', fontWeight: 600,
              }}>
                {i + 1}
              </div>
              <span style={{ color: i === step ? 'var(--color-moonlight)' : 'var(--color-fog)', fontSize: '13px', fontFamily: 'var(--font-untitled-sans)' }}>
                {label}
              </span>
              {i < STEPS.length - 1 && <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--color-steel-border)' }} />}
            </div>
          ))}
        </div>

        {/* card */}
        <div style={{
          backgroundColor: 'var(--color-graphite-plate)',
          borderRadius: '12px', padding: '32px',
          boxShadow: 'inset 0px 1px 1px 0px rgba(199,211,234,0.12), 0px 24px 32px 0px rgba(6,6,14,0.7)',
        }}>

          {/* Step 1 */}
          {step === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ color: 'var(--color-glacier)', fontFamily: 'var(--font-aeonikpro)', fontSize: '24px', fontWeight: 500 }}>
                What role are you targeting?
              </h2>
              <input
                name="target_role"
                value={form.target_role}
                onChange={handleChange}
                placeholder="e.g. Backend Engineer, Frontend Developer"
                style={{
                  backgroundColor: 'var(--color-midnight-ink)', border: '1px solid var(--color-steel-border)',
                  color: 'var(--color-moonlight)', padding: '8px 12px', borderRadius: '2px',
                  fontFamily: 'var(--font-untitled-sans)', fontSize: '16px', outline: 'none',
                }}
              />
            </div>
          )}

          {/* Step 2 */}
          {step === 1 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ color: 'var(--color-glacier)', fontFamily: 'var(--font-aeonikpro)', fontSize: '24px', fontWeight: 500 }}>
                Your stack & experience level
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--color-moonlight)', fontSize: '14px', fontFamily: 'var(--font-untitled-sans)' }}>
                  Tech stack (comma-separated)
                </label>
                <input
                  name="stack"
                  value={form.stack}
                  onChange={handleChange}
                  placeholder="e.g. Python, FastAPI, PostgreSQL"
                  style={{
                    backgroundColor: 'var(--color-midnight-ink)', border: '1px solid var(--color-steel-border)',
                    color: 'var(--color-moonlight)', padding: '8px 12px', borderRadius: '2px',
                    fontFamily: 'var(--font-untitled-sans)', fontSize: '16px', outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--color-moonlight)', fontSize: '14px', fontFamily: 'var(--font-untitled-sans)' }}>
                  Experience level
                </label>
                <select
                  name="experience_level"
                  value={form.experience_level}
                  onChange={handleChange}
                  style={{
                    backgroundColor: 'var(--color-midnight-ink)', border: '1px solid var(--color-steel-border)',
                    color: 'var(--color-moonlight)', padding: '8px 12px', borderRadius: '2px',
                    fontFamily: 'var(--font-untitled-sans)', fontSize: '16px', outline: 'none',
                  }}
                >
                  <option value="junior">Junior</option>
                  <option value="middle">Middle</option>
                  <option value="senior">Senior</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 2 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h2 style={{ color: 'var(--color-glacier)', fontFamily: 'var(--font-aeonikpro)', fontSize: '24px', fontWeight: 500 }}>
                What do you want to focus on?
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ color: 'var(--color-moonlight)', fontSize: '14px', fontFamily: 'var(--font-untitled-sans)' }}>
                  Focus areas (comma-separated)
                </label>
                <input
                  name="focus_areas"
                  value={form.focus_areas}
                  onChange={handleChange}
                  placeholder="e.g. System Design, Algorithms, Databases"
                  style={{
                    backgroundColor: 'var(--color-midnight-ink)', border: '1px solid var(--color-steel-border)',
                    color: 'var(--color-moonlight)', padding: '8px 12px', borderRadius: '2px',
                    fontFamily: 'var(--font-untitled-sans)', fontSize: '16px', outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {error && (
            <p style={{ color: 'var(--color-ember)', fontSize: '14px', fontFamily: 'var(--font-untitled-sans)', marginTop: '12px' }}>
              {error}
            </p>
          )}

          {/* navigation buttons */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px', gap: '12px' }}>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: '2px', cursor: 'pointer',
                  backgroundColor: 'transparent', border: '1px solid var(--color-steel-border)',
                  color: 'var(--color-moonlight)', fontFamily: 'var(--font-untitled-sans)', fontSize: '16px',
                }}
              >
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => setStep(step + 1)}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: '2px', cursor: 'pointer',
                  backgroundColor: 'var(--color-electric-iris)', border: 'none',
                  color: '#fff', fontFamily: 'var(--font-untitled-sans)', fontSize: '16px', fontWeight: 500,
                }}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                style={{
                  flex: 1, padding: '10px 16px', borderRadius: '2px', cursor: 'pointer',
                  backgroundColor: 'var(--color-electric-iris)', border: 'none',
                  color: '#fff', fontFamily: 'var(--font-untitled-sans)', fontSize: '16px', fontWeight: 500,
                }}
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
