import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { register } from "../api/auth";
import { useToast } from "../hooks/ToastContext";
import ThemeToggle from "../components/ThemeToggle";

function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(email, password, name);
      showToast("Account created! You can sign in now.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-ink flex items-center justify-center px-4 transition-colors">
      <div className="fixed top-3 right-3 z-50">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-ink dark:text-cream">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-muted">Join your personal library</p>
        </div>

        <div className="bg-surface dark:bg-dark-surface rounded-2xl shadow-sm p-8 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 rounded text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full py-2 bg-transparent border-b border-muted/40 dark:border-muted/30 focus:outline-none focus:border-gold transition-colors text-ink dark:text-cream placeholder:text-muted/50"
                placeholder="Your name"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full py-2 bg-transparent border-b border-muted/40 dark:border-muted/30 focus:outline-none focus:border-gold transition-colors text-ink dark:text-cream placeholder:text-muted/50"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full py-2 bg-transparent border-b border-muted/40 dark:border-muted/30 focus:outline-none focus:border-gold transition-colors text-ink dark:text-cream placeholder:text-muted/50"
                placeholder="At least 8 characters"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy dark:bg-gold text-cream dark:text-ink hover:opacity-90 disabled:opacity-50 rounded-lg font-semibold tracking-wide transition-colors"
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link to="/login" className="text-gold hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
