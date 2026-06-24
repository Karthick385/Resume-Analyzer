import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return setMessage("Please select a file.");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      await axios.post("https://resume-analyzer-api-2yf7.onrender.com/api/resume/upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("success");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped && dropped.type === "application/pdf") {
      setFile(dropped);
      setMessage("");
    } else {
      setMessage("Only PDF files are allowed.");
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
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
        <button
          onClick={() => navigate("/dashboard")}
          style={styles.backBtn}
          onMouseEnter={e => e.target.style.background = "#f1f5f9"}
          onMouseLeave={e => e.target.style.background = "transparent"}
        >
          ← Back to Dashboard
        </button>
      </nav>

      {/* Main */}
      <main style={styles.main}>

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerIcon}>
            <svg width="32" height="32" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h1 style={styles.title}>Upload Your Resume</h1>
          <p style={styles.subtitle}>Our AI will analyze your skills and match you with the best jobs</p>
        </div>

        {/* Upload Card */}
        <div style={styles.card}>

          {/* Drag & Drop Zone */}
          <div
            style={{
              ...styles.dropZone,
              borderColor: dragOver ? "#3b82f6" : file ? "#10b981" : "#e2e8f0",
              background: dragOver ? "rgba(59,130,246,0.04)" : file ? "rgba(16,185,129,0.04)" : "#fafafa",
            }}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />

            {file ? (
              <div style={styles.fileSelected}>
                <div style={styles.fileIcon}>
                  <svg width="28" height="28" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <p style={styles.fileName}>{file.name}</p>
                <p style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</p>
                <p style={{ fontSize: "12px", color: "#10b981", fontWeight: "600" }}>
                  ✓ Ready to upload
                </p>
              </div>
            ) : (
              <div style={styles.dropContent}>
                <div style={styles.dropIcon}>
                  <svg width="32" height="32" fill="none" stroke="#94a3b8" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p style={styles.dropTitle}>Drag & drop your resume here</p>
                <p style={styles.dropSubtitle}>or <span style={{ color: "#3b82f6", fontWeight: "600" }}>browse files</span></p>
                <p style={styles.dropHint}>Supports PDF up to 5MB</p>
              </div>
            )}
          </div>

          {/* Message */}
          {message && message !== "success" && (
            <div style={styles.errorMsg}>
              ⚠️ {message}
            </div>
          )}

          {message === "success" && (
            <div style={styles.successMsg}>
               Resume uploaded successfully! Redirecting...
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            style={{
              ...styles.uploadBtn,
              opacity: loading || !file ? 0.6 : 1,
              cursor: loading || !file ? "not-allowed" : "pointer",
            }}
            onMouseEnter={e => { if (file && !loading) e.target.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)"; }}
            onMouseLeave={e => { e.target.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)"; }}
          >
            {loading ? (
              <span style={styles.loadingText}>
                <span style={styles.spinner} /> Uploading...
              </span>
            ) : (
              "Upload Resume"
            )}
          </button>

        </div>

        {/* Tips */}
        <div style={styles.tipsRow}>
          {[
            {  text: "Use a clean PDF format" },
            {  text: "Include your skills clearly" },
            {  text: "Results in seconds" },
          ].map((tip, i) => (
            <div key={i} style={styles.tip}>
              <span style={{ fontSize: "20px" }}>{tip.icon}</span>
              <span style={styles.tipText}>{tip.text}</span>
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
  main: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "60px 24px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  headerIcon: {
    width: "64px",
    height: "64px",
    borderRadius: "20px",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
    boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: "-0.5px",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "15px",
    color: "#64748b",
  },
  card: {
    background: "white",
    borderRadius: "24px",
    padding: "36px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    border: "1px solid rgba(0,0,0,0.04)",
    marginBottom: "24px",
  },
  dropZone: {
    border: "2px dashed",
    borderRadius: "16px",
    padding: "40px 20px",
    textAlign: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginBottom: "20px",
  },
  dropContent: {},
  dropIcon: {
    marginBottom: "12px",
  },
  dropTitle: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#334155",
    marginBottom: "6px",
  },
  dropSubtitle: {
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "8px",
  },
  dropHint: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  fileSelected: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  fileIcon: {
    marginBottom: "8px",
  },
  fileName: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#0f172a",
  },
  fileSize: {
    fontSize: "13px",
    color: "#64748b",
  },
  errorMsg: {
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#dc2626",
    marginBottom: "16px",
  },
  successMsg: {
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
    color: "#16a34a",
    marginBottom: "16px",
  },
  uploadBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    color: "white",
    fontWeight: "700",
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(59,130,246,0.3)",
  },
  loadingText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid rgba(255,255,255,0.3)",
    borderTop: "2px solid white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  tipsRow: {
    display: "flex",
    justifyContent: "center",
    gap: "32px",
    flexWrap: "wrap",
  },
  tip: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  tipText: {
    fontSize: "13px",
    fontWeight: "500",
    color: "#64748b",
  },
};

export default Upload;