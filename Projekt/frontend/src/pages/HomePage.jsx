import { useContext, useEffect, useMemo, useState } from "react"
import api from "../api/api"
import { UserContext } from "../context/UserContext"

function HomePage() {
  const { currentUser } = useContext(UserContext)
  const [activeTab, setActiveTab] = useState("all")
  const [auctions, setAuctions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categoryFilter, setCategoryFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [bidAmounts, setBidAmounts] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({})
  const [createData, setCreateData] = useState({
    name: "",
    description: "",
    category: "",
    starting_price: "",
    start_date: "",
    end_date: ""
  })
  const [formMessage, setFormMessage] = useState("")
  const [createMessage, setCreateMessage] = useState("")

  const categories = useMemo(() => {
    const allCategories = auctions.map((auction) => auction.category)
    return [...new Set(allCategories)]
  }, [auctions])

  const filteredAuctions = useMemo(() => {
    let filtered = auctions
    if (activeTab === "my" && currentUser) {
      filtered = auctions.filter((auction) => auction.owner_id === currentUser.id)
    }
    return filtered
  }, [auctions, activeTab, currentUser])

  useEffect(() => {
    fetchAuctions()
  }, [categoryFilter, statusFilter])

  const fetchAuctions = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = {}
      if (categoryFilter) params.category = categoryFilter
      if (statusFilter) params.status = statusFilter

      const response = await api.get("/auctions/", { params })
      setAuctions(response.data)
    } catch (err) {
      setError("Nie udało się pobrać aukcji.")
    } finally {
      setLoading(false)
    }
  }

  const handleBidChange = (auctionId, value) => {
    setBidAmounts((prev) => ({ ...prev, [auctionId]: value }))
  }

  const handleBidSubmit = async (auctionId) => {
    if (!currentUser) {
      alert("Zaloguj się, aby składać oferty.")
      return
    }

    const amount = parseFloat(bidAmounts[auctionId])
    if (!amount || amount <= 0) {
      alert("Wprowadź poprawną kwotę.")
      return
    }

    try {
      await api.post(`/auctions/${auctionId}/bids/`, { amount })
      setFormMessage("Oferta została przyjęta.")
      fetchAuctions()
      setBidAmounts((prev) => ({ ...prev, [auctionId]: "" }))
    } catch (err) {
      setFormMessage("Oferta nie została przyjęta. Sprawdź kwotę i status aukcji.")
    }
  }

  const handleCreateAuction = async (event) => {
    event.preventDefault()
    setCreateMessage("")

    if (!currentUser) {
      setCreateMessage("Musisz być zalogowany, aby wystawić aukcję.")
      return
    }

    const payload = {
      name: createData.name,
      description: createData.description,
      category: createData.category,
      starting_price: parseFloat(createData.starting_price) || 0,
      start_date: createData.start_date,
      end_date: createData.end_date,
      owner_id: currentUser.id
    }

    if (!payload.name || !payload.description || !payload.category || !payload.start_date || !payload.end_date) {
      setCreateMessage("Wypełnij wszystkie pola formularza aukcji.")
      return
    }

    try {
      await api.post("/auctions/", payload)
      setCreateMessage("Aukcja została utworzona.")
      setCreateData({
        name: "",
        description: "",
        category: "",
        starting_price: "",
        start_date: "",
        end_date: ""
      })
      fetchAuctions()
    } catch (err) {
      setCreateMessage("Nie udało się utworzyć aukcji. Sprawdź dane i spróbuj ponownie.")
    }
  }

  const startEdit = (auction) => {
    setEditingId(auction.id)
    setEditData({
      name: auction.name,
      description: auction.description,
      category: auction.category,
      starting_price: auction.starting_price,
      start_date: auction.start_date,
      end_date: auction.end_date
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditData({})
  }

  const handleUpdateAuction = async (auctionId) => {
    if (!editData.name || !editData.description || !editData.category || !editData.start_date || !editData.end_date) {
      setFormMessage("Wypełnij wszystkie pola.")
      return
    }

    try {
      await api.put(`/auctions/${auctionId}/`, {
        name: editData.name,
        description: editData.description,
        category: editData.category,
        starting_price: parseFloat(editData.starting_price),
        owner_id: currentUser.id,
        start_date: editData.start_date,
        end_date: editData.end_date
      })
      setFormMessage("Aukcja została zaktualizowana.")
      setEditingId(null)
      setEditData({})
      fetchAuctions()
    } catch (err) {
      setFormMessage("Nie udało się zaktualizować aukcji.")
    }
  }

  const handleDeleteAuction = async (auctionId) => {
    if (!window.confirm("Na pewno chcesz usunąć tę aukcję?")) return

    try {
      await api.delete(`/auctions/${auctionId}/`)
      setFormMessage("Aukcja została usunięta.")
      fetchAuctions()
    } catch (err) {
      setFormMessage("Nie udało się usunąć aukcji.")
    }
  }

  return (
    <main style={styles.container}>
      <section style={styles.intro}>
        <div>
          <h1>Internetowy system aukcyjny</h1>
          <p>Zobacz dostępne aukcje, wystaw przedmiot lub złóż ofertę.</p>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div style={styles.tabsContainer}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "all" ? styles.tabButtonActive : styles.tabButtonInactive)
          }}
          onClick={() => {
            setActiveTab("all")
            setCategoryFilter("")
            setStatusFilter("")
          }}
        >
          Wszystkie aukcji
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "my" ? styles.tabButtonActive : styles.tabButtonInactive)
          }}
          onClick={() => setActiveTab("my")}
        >
          Moje aukcji
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === "create" ? styles.tabButtonActive : styles.tabButtonInactive)
          }}
          onClick={() => setActiveTab("create")}
        >
          Nowa Aukcja
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}
      {formMessage && <div style={styles.message}>{formMessage}</div>}

      {/* All Auctions Tab */}
      {activeTab === "all" && (
        <>
          <section style={styles.filters}>
            <div>
              <label>
                Kategoria:
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="">Wszystkie</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div>
              <label>
                Status:
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="">Wszystkie</option>
                  <option value="active">Active</option>
                  <option value="ended">Ended</option>
                </select>
              </label>
            </div>
          </section>

          <section style={styles.auctionGrid}>
            {loading ? (
              <p>Ładowanie aukcji...</p>
            ) : filteredAuctions.length === 0 ? (
              <p>Brak aukcji do wyświetlenia.</p>
            ) : (
              filteredAuctions.map((auction) => (
                <article key={auction.id} style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h2>{auction.name}</h2>
                    <span style={styles.status}>{auction.status}</span>
                  </div>
                  <p>{auction.description}</p>
                  <p>
                    <strong>Kategoria:</strong> {auction.category}
                  </p>
                  <p>
                    <strong>Cena wywoławcza:</strong> {auction.starting_price}
                  </p>
                  <p>
                    <strong>Aktualna oferta:</strong> {auction.current_price}
                  </p>
                  <p>
                    <strong>Start:</strong> {new Date(auction.start_date).toLocaleString()}
                  </p>
                  <p>
                    <strong>Koniec:</strong> {new Date(auction.end_date).toLocaleString()}
                  </p>

                  <div style={styles.bidRow}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Kwota"
                      value={bidAmounts[auction.id] || ""}
                      onChange={(e) => handleBidChange(auction.id, e.target.value)}
                      disabled={auction.status === "ended"}
                      style={styles.bidInput}
                    />
                    <button
                      type="button"
                      onClick={() => handleBidSubmit(auction.id)}
                      disabled={auction.status === "ended"}
                      style={styles.bidButton}
                    >
                      Złóż ofertę
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        </>
      )}

      {/* My Auctions Tab */}
      {activeTab === "my" && (
        <>
          {!currentUser ? (
            <div style={styles.emptyState}>
              <h2>Moje aukcje</h2>
              <p>Aby zobaczyć swoje aukcje, musisz się zalogować lub zarejestrować.</p>
              <p>Przejdź do <strong>Rejestracja</strong> lub <strong>Login</strong> w menu górnym.</p>
            </div>
          ) : (
            <>
              <section style={styles.auctionGrid}>
                {loading ? (
                  <p>Ładowanie aukcji...</p>
                ) : filteredAuctions.length === 0 ? (
                  <p>Nie masz żadnych aukcji.</p>
                ) : (
                  filteredAuctions.map((auction) => (
                    <article key={auction.id} style={styles.card}>
                      {editingId === auction.id ? (
                        // Edit Mode
                        <div style={styles.editForm}>
                          <h3>Edytuj aukcję</h3>
                          <label>
                            Nazwa:
                            <input
                              type="text"
                              value={editData.name || ""}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                              style={styles.input}
                            />
                          </label>
                          <label>
                            Opis:
                            <textarea
                              value={editData.description || ""}
                              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                              style={styles.input}
                            />
                          </label>
                          <label>
                            Kategoria:
                            <input
                              type="text"
                              value={editData.category || ""}
                              onChange={(e) => setEditData({ ...editData, category: e.target.value })}
                              style={styles.input}
                            />
                          </label>
                          <label>
                            Cena wywoławcza:
                            <input
                              type="number"
                              value={editData.starting_price || ""}
                              onChange={(e) => setEditData({ ...editData, starting_price: e.target.value })}
                              style={styles.input}
                            />
                          </label>
                          <label>
                            Data rozpoczęcia:
                            <input
                              type="datetime-local"
                              value={editData.start_date || ""}
                              onChange={(e) => setEditData({ ...editData, start_date: e.target.value })}
                              style={styles.input}
                            />
                          </label>
                          <label>
                            Data zakończenia:
                            <input
                              type="datetime-local"
                              value={editData.end_date || ""}
                              onChange={(e) => setEditData({ ...editData, end_date: e.target.value })}
                              style={styles.input}
                            />
                          </label>
                          <div style={styles.buttonGroup}>
                            <button
                              onClick={() => handleUpdateAuction(auction.id)}
                              style={styles.saveButton}
                            >
                              Zapisz
                            </button>
                            <button onClick={cancelEdit} style={styles.cancelButton}>
                              Anuluj
                            </button>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <>
                          <div style={styles.cardHeader}>
                            <h2>{auction.name}</h2>
                            <span style={styles.status}>{auction.status}</span>
                          </div>
                          <p>{auction.description}</p>
                          <p>
                            <strong>Kategoria:</strong> {auction.category}
                          </p>
                          <p>
                            <strong>Cena wywoławcza:</strong> {auction.starting_price}
                          </p>
                          <p>
                            <strong>Aktualna oferta:</strong> {auction.current_price}
                          </p>
                          <p>
                            <strong>Start:</strong> {new Date(auction.start_date).toLocaleString()}
                          </p>
                          <p>
                            <strong>Koniec:</strong> {new Date(auction.end_date).toLocaleString()}
                          </p>
                          <div style={styles.buttonGroup}>
                            <button
                              onClick={() => startEdit(auction)}
                              style={styles.editButton}
                            >
                              Edytuj
                            </button>
                            <button
                              onClick={() => handleDeleteAuction(auction.id)}
                              style={styles.deleteButton}
                            >
                              Usuń
                            </button>
                          </div>
                        </>
                      )}
                    </article>
                  ))
                )}
              </section>
            </>
          )}
        </>
      )}

      {/* Create Auction Tab */}
      {activeTab === "create" && (
        <section style={styles.createSection}>
          <h2>Wystaw przedmiot na aukcję</h2>
          {!currentUser ? (
            <div style={styles.emptyState}>
              <p>Aby wystawić aukcję, musisz się zalogować lub zarejestrować.</p>
              <p>Przejdź do <strong>Rejestracja</strong> lub <strong>Login</strong> w menu górnym.</p>
            </div>
          ) : (
            <>
              {createMessage && <div style={styles.message}>{createMessage}</div>}
              <form onSubmit={handleCreateAuction} style={styles.form}>
                <label>
                  Nazwa przedmiotu
                  <input
                    type="text"
                    value={createData.name}
                    onChange={(e) => setCreateData({ ...createData, name: e.target.value })}
                  />
                </label>
                <label>
                  Opis
                  <textarea
                    value={createData.description}
                    onChange={(e) => setCreateData({ ...createData, description: e.target.value })}
                  />
                </label>
                <label>
                  Kategoria
                  <input
                    type="text"
                    value={createData.category}
                    onChange={(e) => setCreateData({ ...createData, category: e.target.value })}
                  />
                </label>
                <label>
                  Cena wywoławcza
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={createData.starting_price}
                    onChange={(e) => setCreateData({ ...createData, starting_price: e.target.value })}
                  />
                </label>
                <label>
                  Data rozpoczęcia
                  <input
                    type="datetime-local"
                    value={createData.start_date}
                    onChange={(e) => setCreateData({ ...createData, start_date: e.target.value })}
                  />
                </label>
                <label>
                  Data zakończenia
                  <input
                    type="datetime-local"
                    value={createData.end_date}
                    onChange={(e) => setCreateData({ ...createData, end_date: e.target.value })}
                  />
                </label>
                <button type="submit" style={styles.submitButton}>
                  Utwórz aukcję
                </button>
              </form>
            </>
          )}
        </section>
      )}
    </main>
  )
}

const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto"
  },
  intro: {
    marginBottom: "24px"
  },
  tabsContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "24px",
    borderBottom: "2px solid var(--border)"
  },
  tabButton: {
    padding: "12px 20px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.3s ease"
  },
  tabButtonActive: {
    color: "var(--accent)",
    borderBottom: "3px solid var(--accent)",
    marginBottom: "-2px"
  },
  tabButtonInactive: {
    color: "var(--text-secondary)",
    opacity: 0.6
  },
  filters: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "24px",
    justifyContent: "center"
  },
  error: {
    color: "#f87171",
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "12px",
    border: "1px solid #f87171"
  },
  message: {
    color: "#4ade80",
    backgroundColor: "rgba(74, 222, 128, 0.1)",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "12px",
    border: "1px solid #4ade80"
  },
  notice: {
    padding: "20px",
    textAlign: "center",
    color: "var(--text-secondary)",
    fontSize: "1.1rem"
  },
  emptyState: {
    padding: "40px 20px",
    textAlign: "center",
    color: "var(--text-secondary)",
    backgroundColor: "rgba(0,0,0,0.1)",
    borderRadius: "8px",
    border: "1px dashed var(--border)"
  },
  auctionGrid: {
    display: "grid",
    gap: "20px",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    marginBottom: "40px"
  },
  card: {
    padding: "18px",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    background: "var(--code-bg)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    color: "var(--text)",
    transition: "box-shadow 0.3s ease"
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
  },
  status: {
    padding: "4px 10px",
    borderRadius: "20px",
    background: "var(--border)",
    textTransform: "capitalize",
    fontSize: "0.9rem"
  },
  bidRow: {
    display: "flex",
    gap: "10px",
    marginTop: "12px",
    alignItems: "center"
  },
  bidInput: {
    flex: 1,
    padding: "10px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    background: "var(--bg)",
    color: "var(--text)"
  },
  bidButton: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "8px",
    background: "var(--accent)",
    color: "white",
    cursor: "pointer",
    transition: "opacity 0.3s ease"
  },
  editForm: {
    padding: "12px",
    background: "var(--bg)",
    borderRadius: "8px"
  },
  input: {
    width: "100%",
    padding: "8px",
    border: "1px solid var(--border)",
    borderRadius: "4px",
    background: "var(--code-bg)",
    color: "var(--text)",
    boxSizing: "border-box",
    marginTop: "4px"
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
    marginTop: "12px"
  },
  editButton: {
    flex: 1,
    padding: "10px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    background: "var(--bg)",
    color: "var(--accent)",
    cursor: "pointer",
    transition: "background 0.3s ease"
  },
  deleteButton: {
    flex: 1,
    padding: "10px",
    border: "1px solid #f87171",
    borderRadius: "8px",
    background: "transparent",
    color: "#f87171",
    cursor: "pointer",
    transition: "background 0.3s ease"
  },
  saveButton: {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    background: "#4ade80",
    color: "white",
    cursor: "pointer",
    transition: "opacity 0.3s ease"
  },
  cancelButton: {
    flex: 1,
    padding: "10px",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    background: "var(--bg)",
    color: "var(--text)",
    cursor: "pointer",
    transition: "opacity 0.3s ease"
  },
  createSection: {
    padding: "20px",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    background: "var(--code-bg)",
    color: "var(--text)"
  },
  form: {
    display: "grid",
    gap: "14px"
  },
  submitButton: {
    width: "fit-content",
    padding: "10px 18px",
    background: "var(--accent)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    transition: "opacity 0.3s ease"
  }
}

export default HomePage
