"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Loader2, AlertCircle, Cpu } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid credentials. Access denied.");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#050608",
      padding: 20,
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 48 }}>
          <div style={{
            padding: 12,
            backgroundColor: "#00f5ff",
            borderRadius: 16,
            display: "flex",
            boxShadow: "0 0 30px rgba(0,245,255,0.3)",
          }}>
            <Cpu style={{ width: 24, height: 24, color: "#000" }} />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>STELV</div>
            <div style={{ fontSize: 8, fontWeight: 900, color: "#00f5ff", letterSpacing: "0.35em" }}>LEAD.AUDIT</div>
          </div>
        </div>

        {/* Card */}
        <div style={{
          backgroundColor: "#0c0d12",
          border: "1px solid #1a1b21",
          borderRadius: 24,
          padding: 36,
        }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 6 }}>AUTHENTICATE</h2>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#3d4150" }}>Enter credentials to access the terminal.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: 14, marginBottom: 20, borderRadius: 12,
                backgroundColor: "rgba(244,63,94,0.1)",
                border: "1px solid rgba(244,63,94,0.2)",
                fontSize: 12, fontWeight: 700, color: "#f43f5e",
              }}>
                <AlertCircle style={{ width: 16, height: 16, flexShrink: 0 }} />
                {error}
              </div>
            )}

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 9, fontWeight: 900, color: "#6b7280", letterSpacing: "0.2em", marginBottom: 8, textTransform: "uppercase" as const }}>
                Email
              </label>
              <div style={{ position: "relative" }}>
                <Mail style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#3d4150" }} />
                <input
                  type="email"
                  className="input-dark"
                  placeholder="admin@leadaudit.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <label style={{ display: "block", fontSize: 9, fontWeight: 900, color: "#6b7280", letterSpacing: "0.2em", marginBottom: 8, textTransform: "uppercase" as const }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, color: "#3d4150" }} />
                <input
                  type="password"
                  className="input-dark"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: 44 }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", padding: "16px 0", fontSize: 12, opacity: loading ? 0.6 : 1 }}
            >
              {loading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} /> AUTHENTICATING...
                </span>
              ) : (
                "ACCESS TERMINAL"
              )}
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: 24 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: "#3d4150" }}>
              No account?{" "}
              <Link href="/register" style={{ color: "#00f5ff", textDecoration: "none", fontWeight: 800 }}>
                Request Access
              </Link>
            </p>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: 10, fontWeight: 700, color: "#3d4150", marginTop: 20 }}>
          Demo: admin@leadaudit.com / password123
        </p>
      </div>
    </div>
  );
}
