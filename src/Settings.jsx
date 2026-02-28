import { useState } from 'react'
import { C } from './constants.js'
import { Card, Label } from './components.jsx'

export default function Settings({ initialBalance, onSave }) {
  const [value, setValue] = useState(initialBalance)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!value || Number(value) <= 0) {
      alert('Please enter a valid balance')
      return
    }
    onSave(Number(value))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="fade-in">
      <h1
        style={{
          fontSize: 18,
          letterSpacing: '0.1em',
          marginBottom: 24,
        }}
      >
        SETTINGS
      </h1>

      <Card style={{ maxWidth: 480 }}>
        <Label>Initial Account Balance ($)</Label>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 16 }}>
          This is your starting balance. It's used to calculate
          risk percentages and track overall performance.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <input
            type="number"
            min="1"
            step="1"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            style={{
              flex: 1,
              background: C.surface2,
              border: `1px solid ${C.border2}`,
              borderRadius: 7,
              padding: '9px 12px',
              color: C.text,
              fontSize: 14,
              outline: 'none',
            }}
          />
          <button
            onClick={handleSave}
            style={{
              background: saved ? C.accent : C.green,
              borderRadius: 8,
              padding: '9px 20px',
              color: '#0a0a0c',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'background 0.3s',
              whiteSpace: 'nowrap',
            }}
          >
            {saved ? '✓ Saved!' : 'Save'}
          </button>
        </div>
      </Card>
    </div>
  )
}
