import { useState } from 'react'
import './App.css'

const API = import.meta.env.VITE_API_URL

function ScoreBadge({ score }) {
  const color = score >= 70 ? '#16A34A' : score >= 50 ? '#EA580C' : '#DC2626'
  const bg = score >= 70 ? '#F0FDF4' : score >= 50 ? '#FFF7ED' : '#FEF2F2'
  return (
    <span style={{ background: bg, color, padding: '4px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>
      {score}%
    </span>
  )
}

function MatchCard({ match }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <p className="job-title">{match.titre}</p>
          <p className="job-company">{match.entreprise}</p>
        </div>
        <ScoreBadge score={match.score} />
      </div>
      <p className="job-summary">{match.raison}</p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        {match.points_forts?.map(p => (
          <span key={p} className="badge badge-blue">{p}</span>
        ))}
        {match.manques?.map(m => (
          <span key={m} className="badge badge-red">{m}</span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <a href={match.url} target="_blank" rel="noreferrer"
          style={{ fontSize: 13, color: '#2563EB', textDecoration: 'none' }}>
          Voir l'offre →
        </a>
        <button onClick={() => setOpen(!open)}
          style={{ fontSize: 13, background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
          {open ? 'Masquer détails' : 'Voir détails'}
        </button>
      </div>
      {open && (
        <div style={{ marginTop: 12, padding: 12, background: '#F8FAFC', borderRadius: 8 }}>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Points forts</p>
          <ul style={{ paddingLeft: 16, marginBottom: 10 }}>
            {match.points_forts?.map(p => <li key={p} style={{ fontSize: 13, color: '#16A34A' }}>{p}</li>)}
          </ul>
          <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Points manquants</p>
          <ul style={{ paddingLeft: 16 }}>
            {match.manques?.map(m => <li key={m} style={{ fontSize: 13, color: '#DC2626' }}>{m}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

function App() {
  const [file, setFile] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleMatch = async () => {
    if (!file || !keyword) return
    setLoading(true)
    setMatches([])
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('keyword', keyword)

    try {
      const res = await fetch(`${API}/match`, { method: 'POST', body: formData })
      if (!res.ok) throw new Error('Erreur serveur')
      const data = await res.json()
      setMatches(data.matches)
    } catch (e) {
      setError('Impossible de contacter le serveur.')
    }
    setLoading(false)
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <p>CV Job Matcher</p>
          <p>Powered by Mistral</p>
        </div>
      </aside>

      <main className="main">
        <h1 className="page-title">Trouver des offres qui matchent</h1>

        <div className="card" style={{ marginBottom: 24 }}>
          <div className="form-group">
            <label className="form-label">Ton CV (PDF)</label>
            <input type="file" accept=".pdf"
              onChange={e => setFile(e.target.files[0])}
              style={{ fontSize: 14 }} />
          </div>
          <div className="form-group">
            <label className="form-label">Poste recherché</label>
            <input className="form-input" value={keyword}
              onChange={e => setKeyword(e.target.value)}
              placeholder="ex: python, ML engineer, devops..." />
          </div>
          <button className="btn btn-primary" onClick={handleMatch} disabled={loading || !file || !keyword}>
            {loading ? 'Analyse en cours... (2-3 min)' : 'Analyser'}
          </button>
          {error && (
            <div style={{ marginTop: 12, padding: '10px 14px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, fontSize: 14, color: '#DC2626' }}>
              {error}
            </div>
          )}
        </div>

        {matches.length > 0 && (
          <div>
            <div className="list-header">
              <h2 className="list-title">Résultats</h2>
              <span className="list-count">{matches.length} offres analysées</span>
            </div>
            {matches.map((m, i) => <MatchCard key={i} match={m} />)}
          </div>
        )}
      </main>
    </div>
  )
}

export default App