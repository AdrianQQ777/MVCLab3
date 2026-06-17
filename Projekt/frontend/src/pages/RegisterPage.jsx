import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import { UserContext } from "../context/UserContext"

export default function Register() {
  const { setCurrentUser } = useContext(UserContext)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    if (!name || !email || !password) {
      setError("Wypełnij wszystkie pola.")
      return
    }

  try {
    const res = await api.post("/users/", {
      name,
      email,
      password
    });

    const user = res.data;

    if (user?.id) {
        setCurrentUser(user);
        navigate("/");
      } else {
        setMessage("Użytkownik utworzony. Zaloguj się poprzez email.");
      }
  } catch (err) {
    if (err.response) {
      switch (err.response.status) {
        case 400:
          setError("Nieprawidłowe dane.");
          break;
        case 409:
          setError("Użytkownik z takim emailem już istnieje.");
          break;
        case 500:
          setError("Błąd serwera. Spróbuj później.");
          break;
        default:
          setError("Nie udało się zarejestrować.");
      }
    } else {
      setError("Brak połączenia z serwerem.");
    }
  }
  }

  return (
    <div style={styles.container}>
      <h2>Rejestracja</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Imię"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />
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
        <button type="submit" style={styles.button}>Utwórz konto</button>
      </form>
      {message && <div style={styles.message}>{message}</div>}
      {error && <div style={styles.error}>{error}</div>}
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
  message: {
    color: "#4ade80",
    marginTop: "12px"
  },
  error: {
    color: "#f87171",
    marginTop: "12px"
  }
}
