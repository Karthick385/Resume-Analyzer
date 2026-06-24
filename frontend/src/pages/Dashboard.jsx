import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimated(true), 100);
  }, []);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate("/login");
  };

  const handleViewJobs = () => {
    sessionStorage.setItem("viewJobs", "true");
    navigate("/recommendations");
  };

  return (
    <div style={styles.page}>
      {/* Background blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.navLogo}>R</div>
          <span style={styles.navTitle}>ResumeAI</span>
        </div>
        <button onClick={logout} style={styles.logoutBtn}
          onMouseEnter={e => e.target.style.background = "#dc2626"}
          onMouseLeave={e => e.target.style.background = "transparent"}
        >
          Logout
        </button>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>

        {/* Welcome Section */}
        <div style={{
          ...styles.welcomeSection,
          opacity: animated ? 1 : 0,
          transform: animated ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}>
          <p style={styles.greeting}>Good to see you back 👋</p>
          <h1 style={styles.welcomeTitle}>
            Welcome, <span style={styles.nameHighlight}>{user?.name}</span>
          </h1>
          <p style={styles.subtitle}>What would you like to do today?</p>
        </div>

        {/* Cards */}
        <div style={styles.cardsGrid}>

          {/* Upload Card */}
          <div style={{
            ...styles.card,
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease 0.2s",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 20px 60px rgba(59,130,246,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
            }}
          >
            <div style={{ ...styles.cardIcon, background: "linear-gradient(135deg, #3b82f6, #2563eb)" }}>
              <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Upload Resume</h3>
            <p style={styles.cardDesc}>
              Upload your latest resume and let our AI analyze your skills and experience.
            </p>
            <div style={styles.cardFooter}>
              <button
                onClick={() => navigate("/upload")}
                style={styles.cardBtn}
                onMouseEnter={e => {
                  e.target.style.background = "#2563eb";
                  e.target.style.paddingRight = "24px";
                }}
                onMouseLeave={e => {
                  e.target.style.background = "#3b82f6";
                  e.target.style.paddingRight = "20px";
                }}
              >
                Upload Now →
              </button>
            </div>
          </div>

          {/* Jobs Card */}
          <div style={{
            ...styles.card,
            opacity: animated ? 1 : 0,
            transform: animated ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.6s ease 0.4s",
          }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-6px)";
              e.currentTarget.style.boxShadow = "0 20px 60px rgba(16,185,129,0.15)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
            }}
          >
            <div style={{ ...styles.cardIcon, background: "linear-gradient(135deg, #10b981, #059669)" }}>
              <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
              </svg>
            </div>
            <h3 style={styles.cardTitle}>Job Recommendations</h3>
            <p style={styles.cardDesc}>
              View personalized job matches based on your resume skills and experience.
            </p>
            <div style={styles.cardFooter}>
              <button
                onClick={handleViewJobs}
                style={{ ...styles.cardBtn, background: "#10b981" }}
                onMouseEnter={e => {
                  e.target.style.background = "#059669";
                  e.target.style.paddingRight = "24px";
                }}
                onMouseLeave={e => {
                  e.target.style.background = "#10b981";
                  e.target.style.paddingRight = "20px";
                }}
              >
                View Jobs →
              </button>
            </div>
          </div>

        </div>

        {/* Stats Bar */}
        <div style={{
          ...styles.statsBar,
          opacity: animated ? 1 : 0,
          transition: "all 0.6s ease 0.6s",
        }}>
          {[
            { label: "AI Powered" },
            { label: "Instant Match" },
            { label: "Smart Analysis" },
          ].map((stat, i) => (
            <div key={i} style={styles.statItem}>
              <span style={styles.statIcon}>{stat.icon}</span>
              <span style={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f8fafc",
    fontFamily: "'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  blob1: {
    position: "fixed",
    top: "-100px",
    right: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  blob2: {
    position: "fixed",
    bottom: "-100px",
    left: "-100px",
    width: "400px",
    height: "400px",
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    background: "rgba(255,255,255,0.8)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(0,0,0,0.06)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  navBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  navLogo: {
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "18px",
  },
  navTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    letterSpacing: "-0.5px",
  },
  logoutBtn: {
    padding: "8px 20px",
    border: "1.5px solid #ef4444",
    borderRadius: "8px",
    background: "transparent",
    color: "#ef4444",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  main: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "60px 24px",
  },
  welcomeSection: {
    marginBottom: "48px",
  },
  greeting: {
    fontSize: "15px",
    color: "#64748b",
    marginBottom: "8px",
    fontWeight: "500",
  },
  welcomeTitle: {
    fontSize: "42px",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-1px",
    marginBottom: "10px",
    lineHeight: 1.1,
  },
  nameHighlight: {
    background: "linear-gradient(135deg, #3b82f6, #10b981)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "48px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    padding: "32px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    border: "1px solid rgba(0,0,0,0.04)",
    transition: "all 0.3s ease",
    cursor: "default",
  },
  cardIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "20px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "10px",
  },
  cardDesc: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
    marginBottom: "24px",
  },
  cardFooter: {
    borderTop: "1px solid #f1f5f9",
    paddingTop: "20px",
  },
  cardBtn: {
    padding: "10px 20px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  statsBar: {
    display: "flex",
    justifyContent: "center",
    gap: "40px",
    padding: "24px",
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
    border: "1px solid rgba(0,0,0,0.04)",
  },
  statItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  statIcon: {
    fontSize: "20px",
  },
  statLabel: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#475569",
  },
};

export default Dashboard;