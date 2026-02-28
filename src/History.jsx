import { useState } from 'react'
import { Modal } from './components.jsx'
import TradeForm from './TradeForm.jsx'

export default function History({
  trades,
  onAdd,
  onEdit,
  onDelete,
  currentBalance,
}) {
  const [showAdd, setShowAdd] = useState(false)

  return (
    <div className="fade-in">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <h1 style={{ fontSize: 18, letterSpacing: '0.1em' }}>
          TRADE HISTORY
        </h1>
        <button
          onClick={() => setShowAdd(true)}
          style={{
            background: '#22c55e',
            borderRadius: 8,
            padding: '9px 18px',
            color: '#0a0a0c',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          + Add Trade
        </button>
      </div>

      <p style={{ color: '#5a5a72' }}>
        {trades.length} trades logged
      </p>

      <Modal open={showAdd} onClose={() => setShowAdd(false)}>
        <TradeForm
          onSave={(t) => {
            onAdd(t)
            setShowAdd(false)
          }}
          onClose={() => setShowAdd(false)}
          currentBalance={currentBalance}
          allTrades={trades}
        />
      </Modal>
    </div>
  )
}
