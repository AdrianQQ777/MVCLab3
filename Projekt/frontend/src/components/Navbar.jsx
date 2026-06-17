import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import { UserContext } from "../context/UserContext"

function Navbar() {
  const { currentUser, setCurrentUser } = useContext(UserContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    setCurrentUser(null)
    navigate("/")
  }

  return (
    <nav style={styles.nav}>
      <div>
        <h2>Auction App</h2>
        {currentUser ? (
          <p style={styles.user}>Zalogowany: {currentUser.name}</p>
        ) : (
          <p style={styles.user}>Nie zalogowano</p>
        )}
      </div>

      <div style={styles.links}>
        <Link to="/">Główna</Link>
        {currentUser ? (
          <button type="button" style={styles.button} onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Rejestracja</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    gap: "20px",
    background: "var(--code-bg)",
    borderBottom: "1px solid var(--border)",
    flexWrap: "wrap"
  },
  links: {
    display: "flex",
    gap: "15px",
    alignItems: "center"
  },
  user: {
    margin: 0,
    fontSize: "0.9rem",
    color: "var(--text)"
  },
  button: {
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "6px 12px",
    cursor: "pointer"
  }
}

export default Navbar
