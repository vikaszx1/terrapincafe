import { useState } from 'react'

// Change this password to whatever the owner prefers
const ADMIN_PASSWORD = 'terrapin2024'

export default function Login({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('tc_admin', '1')
      onLogin()
    } else {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <h1>Terrapin Creek</h1>
          <p>Admin Panel</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="admin-login__error">{error}</div>}

          <div className="admin-login__field">
            <label htmlFor="pwd">Password</label>
            <input
              id="pwd"
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              placeholder="Enter admin password"
              autoFocus
            />
          </div>

          <button type="submit" className="admin-login__btn">
            Sign In
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', fontSize: '0.72rem', textAlign: 'center', color: '#94a3b8' }}>
          Default password: <code>terrapin2024</code>
        </p>
      </div>
    </div>
  )
}
