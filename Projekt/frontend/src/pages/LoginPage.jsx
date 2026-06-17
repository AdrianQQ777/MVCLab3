import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import { UserContext } from "../context/UserContext"

function LoginPage() {
  const { setCurrentUser } = useContext(UserContext)
  const [users, setUsers] = useState([])
  const [email, setEmail] = useState("")
  const [error, setError] = useState(null)
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await api.get("/users/")
        setUsers(response.data)
      } catch (err) {
        setError("Nie udało się pobrać użytkowników.")
      }
    }
    loadUsers()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    try {
      const response = await api.post("/users/login/", {
        email,
        password
      })

      setCurrentUser(response.data)
      navigate("/")
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Nieprawidłowy email lub hasło.")
      } else {
        setError("Nie udało się zalogować.")
      }
    }
  }

  return (
    <div style={styles.container}>
      <h2>Login</h2>
      <p>Wprowadź email użytkownika, aby się zalogować.</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Zaloguj się</button>
      </form>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.hint}>
        <p>Dostępni użytkownicy:</p>
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name} ({user.email})</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "520px",
    margin: "0 auto",
    textAlign: "left"
  },
  form: {
    display: "grid",
    gap: "12px",
    marginTop: "12px"
  },
  input: {
    background: "var(--code-bg)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "10px"
  },
  button: {
    background: "var(--accent)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 16px",
    cursor: "pointer"
  },
  error: {
    color: "#f87171",
    marginTop: "12px"
  },
  hint: {
    marginTop: "18px",
    padding: "14px",
    background: "var(--code-bg)",
    border: "1px solid var(--border)",
    borderRadius: "12px"
  }
}

export default LoginPage
