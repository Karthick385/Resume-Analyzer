import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Recommendations() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [animated, setAnimated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const canView = sessionStorage.getItem("viewJobs");

    if (!canView) {
      navigate("/dashboard");
      return;
    }

    sessionStorage.removeItem("viewJobs");
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const res = await axios.get("https://resume-analyzer-api-2yf7.onrender.com/api/match", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(res.data);
      setTimeout(() => setAnimated(true), 100);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login");
      } else if (error.response?.status === 404) {
        setError("No resume found. Please upload your resume first.");
      } else {
        setError("Failed to load recommendations. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" };
    if (score >= 50) return { color: "#d97706", bg: "#fffbeb", border: "#fde68a" };
    return { color: "#dc2626", bg: "#fef2f2", border: "#fecaca" };
  };

  const getScoreLabel = (score) => {
    if (score >= 75) return "Great Match";
    if (score >= 50) return "Good Match";
    return "Partial Match";
  };

  if (loading)
    return (
      <div style={styles.page}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />
        <nav style={styles.navbar}>
          <div style={styles.navBrand}>
            <div style={styles.navLogo}>R</div>
            <span style={styles.navTitle}>ResumeAI</span>
          </div>
        </nav>
        <div style={styles.centered}>
          <div style={styles.loadingCard}>
            <div style={styles.loadingSpinner} />
            <p style={styles.loadingText}>Analyzing your resume...</p>
            <p style={styles.loadingSubtext}>Finding the best matches for you</p>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div style={styles.page}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />
        <nav style={styles.navbar}>
          <div style={styles.navBrand}>
            <div style={styles.navLogo}>R</div>
            <span style={styles.navTitle}>ResumeAI</span>
          </div>
        </nav>
        <div style={styles.centered}>
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>⚠️</div>
            <h3 style={styles.errorTitle}>No Resume Found</h3>
            <p style={styles.errorDesc}>{error}</p>
            <button
              onClick={() => navigate("/upload")}
              style={styles.primaryBtn}
              onMouseEnter={e => e.target.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"}
              onMouseLeave={e => e.target.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)"}
            >
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    );

  if (jobs.length === 0)
    return (
      <div style={styles.page}>
        <div style={styles.blob1} />
        <div style={styles.blob2} />
        <nav style={styles.navbar}>
          <div style={styles.navBrand}>
            <div style={styles.navLogo}>R</div>
            <span style={styles.navTitle}>ResumeAI</span>
          </div>
        </nav>
        <div style={styles.centered}>
          <div style={styles.errorCard}>
            <div style={styles.errorIcon}>🔍</div>
            <h3 style={styles.errorTitle}>No Jobs Found</h3>
            <p style={styles.errorDesc}>No job recommendations available right now.</p>
            <button
              onClick={() => navigate("/dashboard")}
              style={styles.primaryBtn}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );

  return (
    <div style={styles.page}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <div style={styles.navLogo}>R</div>
          <span style={styles.navTitle}>ResumeAI</span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.backBtn}
          onMouseEnter={e => e.target.style.background = "#f1f5f9"}
          onMouseLeave={e => e.target.style.background = "transparent"}
        >
          ← Dashboard
        </button>
      </nav>

      <main style={styles.main}>

        {/* Header */}
        <div style={{
          ...styles.header,
          opacity: animated ? 1 : 0,
          transform: animated ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.6s ease",
        }}>
          <div style={styles.headerIcon}>
            <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
            </svg>
          </div>
          <h1 style={styles.title}>Job Recommendations</h1>
          <p style={styles.subtitle}>
            Found <span style={styles.countBadge}>{jobs.length} matches</span> based on your resume
          </p>
        </div>

        {/* Jobs List */}
        <div style={styles.jobsList}>
          {jobs.map((job, index) => {
            const scoreStyle = getScoreColor(job.matchScore);
            return (
              <div
                key={job.jobId}
                style={{
                  ...styles.jobCard,
                  opacity: animated ? 1 : 0,
                  transform: animated ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.5s ease ${index * 0.1}s`,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.06)";
                }}
              >
                {/* Card Header */}
                <div style={styles.jobHeader}>
                  <div style={styles.jobLeft}>
                    <div style={styles.companyAvatar}>
                      {job.company.charAt(0)}
                    </div>
                    <div>
                      <h2 style={styles.jobTitle}>{job.title}</h2>
                      <p style={styles.jobCompany}>🏢 {job.company}</p>
                    </div>
                  </div>

                  {/* Score Badge */}
                  <div style={{
                    ...styles.scoreBadge,
                    background: scoreStyle.bg,
                    border: `1.5px solid ${scoreStyle.border}`,
                  }}>
                    <span style={{ ...styles.scoreNumber, color: scoreStyle.color }}>
                      {job.matchScore}%
                    </span>
                    <span style={{ ...styles.scoreLabel, color: scoreStyle.color }}>
                      {getScoreLabel(job.matchScore)}
                    </span>
                  </div>
                </div>

                {/* Score Bar */}
                <div style={styles.scoreBarContainer}>
                  <div style={styles.scoreBarBg}>
                    <div style={{
                      ...styles.scoreBarFill,
                      width: animated ? `${job.matchScore}%` : "0%",
                      background: job.matchScore >= 75
                        ? "linear-gradient(90deg, #10b981, #059669)"
                        : job.matchScore >= 50
                        ? "linear-gradient(90deg, #f59e0b, #d97706)"
                        : "linear-gradient(90deg, #ef4444, #dc2626)",
                      transition: `width 1s ease ${index * 0.1 + 0.3}s`,
                    }} />
                  </div>
                </div>

                {/* Description */}
                {job.description && (
                  <p style={styles.jobDesc}>{job.description}</p>
                )}

                <div style={styles.skillsRow}>
                  {/* Matched Skills */}
                  <div style={styles.skillsSection}>
                    <p style={styles.skillsLabel}>
                      <span style={{ color: "#16a34a" }}>✓</span> Matched Skills
                    </p>
                    <div style={styles.skillTags}>
                      {job.matchedSkills.length > 0
                        ? job.matchedSkills.map((skill, i) => (
                            <span key={i} style={styles.matchedTag}>{skill}</span>
                          ))
                        : <span style={styles.noSkill}>None</span>
                      }
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div style={styles.skillsSection}>
                    <p style={styles.skillsLabel}>
                      <span style={{ color: "#dc2626" }}>✗</span> Missing Skills
                    </p>
                    <div style={styles.skillTags}>
                      {job.missingSkills.length > 0
                        ? job.missingSkills.map((skill, i) => (
                            <span key={i} style={styles.missingTag}>{skill}</span>
                          ))
                        : <span style={styles.noSkill}>None 🎉</span>
                      }
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
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
  backBtn: {
    padding: "8px 16px",
    border: "1.5px solid #e2e8f0",
    borderRadius: "8px",
    background: "transparent",
    color: "#475569",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "14px",
    transition: "all 0.2s ease",
  },
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
  },
  loadingCard: {
    background: "white",
    borderRadius: "24px",
    padding: "48px",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
  },
  loadingSpinner: {
    width: "48px",
    height: "48px",
    border: "4px solid #e2e8f0",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
    margin: "0 auto 20px",
  },
  loadingText: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "8px",
  },
  loadingSubtext: {
    fontSize: "14px",
    color: "#64748b",
  },
  errorCard: {
    background: "white",
    borderRadius: "24px",
    padding: "48px",
    textAlign: "center",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    maxWidth: "400px",
  },
  errorIcon: {
    fontSize: "48px",
    marginBottom: "16px",
  },
  errorTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "10px",
  },
  errorDesc: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "24px",
  },
  primaryBtn: {
    padding: "12px 28px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    fontWeight: "700",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
  },
  main: {
    maxWidth: "800px",
    margin: "0 auto",
    padding: "60px 24px",
  },
  header: {
    textAlign: "center",
    marginBottom: "48px",
  },
  headerIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #10b981, #059669)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: "0 8px 24px rgba(16,185,129,0.3)",
  },
  title: {
    fontSize: "36px",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.5px",
    marginBottom: "12px",
  },
  subtitle: {
    fontSize: "16px",
    color: "#64748b",
  },
  countBadge: {
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    padding: "2px 10px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "700",
  },
  jobsList: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  jobCard: {
    background: "white",
    borderRadius: "20px",
    padding: "28px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    border: "1px solid rgba(0,0,0,0.04)",
    transition: "all 0.3s ease",
  },
  jobHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
    flexWrap: "wrap",
    gap: "12px",
  },
  jobLeft: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  companyAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "20px",
    flexShrink: 0,
  },
  jobTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: "4px",
  },
  jobCompany: {
    fontSize: "14px",
    color: "#64748b",
  },
  scoreBadge: {
    borderRadius: "12px",
    padding: "8px 14px",
    textAlign: "center",
    flexShrink: 0,
  },
  scoreNumber: {
    display: "block",
    fontSize: "22px",
    fontWeight: "800",
    lineHeight: 1,
  },
  scoreLabel: {
    display: "block",
    fontSize: "11px",
    fontWeight: "600",
    marginTop: "2px",
  },
  scoreBarContainer: {
    marginBottom: "16px",
  },
  scoreBarBg: {
    height: "6px",
    background: "#f1f5f9",
    borderRadius: "99px",
    overflow: "hidden",
  },
  scoreBarFill: {
    height: "100%",
    borderRadius: "99px",
  },
  jobDesc: {
    fontSize: "14px",
    color: "#64748b",
    lineHeight: "1.6",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #f1f5f9",
  },
  skillsRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "16px",
  },
  skillsSection: {},
  skillsLabel: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  skillTags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
  },
  matchedTag: {
    padding: "4px 10px",
    borderRadius: "20px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    color: "#16a34a",
    fontSize: "12px",
    fontWeight: "600",
  },
  missingTag: {
    padding: "4px 10px",
    borderRadius: "20px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#dc2626",
    fontSize: "12px",
    fontWeight: "600",
  },
  noSkill: {
    fontSize: "13px",
    color: "#94a3b8",
  },
};

export default Recommendations;