import { createContext, useCallback, useContext, useRef, useState } from 'react'

// ── Context ───────────────────────────────────────────────────────────────────
const ConfirmCtx = createContext(null)

// ── Provider (mount once in AdminApp) ────────────────────────────────────────
export function ConfirmProvider({ children }) {
  const [state, setState] = useState(null) // { message, title, danger }
  const resolveRef = useRef(null)

  const confirm = useCallback((message, { title = 'Are you sure?', danger = false } = {}) => {
    return new Promise(resolve => {
      resolveRef.current = resolve
      setState({ message, title, danger })
    })
  }, [])

  function answer(value) {
    setState(null)
    resolveRef.current?.(value)
  }

  return (
    <ConfirmCtx.Provider value={confirm}>
      {children}
      {state && (
        <div className="confirm-overlay" onClick={() => answer(false)}>
          <div className="confirm-dialog" onClick={e => e.stopPropagation()} role="alertdialog" aria-modal="true">
            <div className="confirm-dialog__icon">
              {state.danger ? '⚠' : '?'}
            </div>
            <h3 className="confirm-dialog__title">{state.title}</h3>
            <p className="confirm-dialog__message">{state.message}</p>
            <div className="confirm-dialog__actions">
              <button className="btn btn--outline" onClick={() => answer(false)}>
                Cancel
              </button>
              <button
                className={`btn ${state.danger ? 'btn--danger' : 'btn--primary'}`}
                onClick={() => answer(true)}
                autoFocus
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmCtx.Provider>
  )
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useConfirm() {
  const ctx = useContext(ConfirmCtx)
  if (!ctx) throw new Error('useConfirm must be used inside <ConfirmProvider>')
  return ctx
}
