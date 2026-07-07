import { useState, useEffect } from "react";
import { getBooks, addBook, deleteBook, toggleBookStatus } from "../api/books";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/AuthContext";
import { useTheme } from "../hooks/ThemeContext";

function Books() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { dark, toggle } = useTheme();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [pages, setPages] = useState("");
  const [status, setStatus] = useState("unread");

  useEffect(() => {
    async function fetchBooks() {
      try {
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  const handleAddBook = async (e) => {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const newBook = {
        name,
        author,
        language,
        pages: Number(pages),
        status,
      };
      const result = await addBook(newBook);

      setBooks([...books, { ...newBook, _id: result.id }]);

      setName("");
      setAuthor("");
      setLanguage("");
      setPages("");
      setStatus("unread");
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBook(id);
      setBooks(books.filter((book) => book._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const result = await toggleBookStatus(id);
      setBooks(
        books.map((book) =>
          book._id === id ? { ...book, status: result.status } : book,
        ),
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream dark:bg-ink flex items-center justify-center transition-colors">
        <p className="text-muted">Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream dark:bg-ink flex items-center justify-center transition-colors">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-ink text-ink dark:text-cream transition-colors">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-4 py-2 bg-navy dark:bg-gold text-cream dark:text-ink rounded-lg text-sm font-semibold hover:opacity-90 transition-colors"
            >
              {showForm ? "Cancel" : "+ Add Book"}
            </button>
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="px-3 py-2 rounded-lg text-sm text-muted hover:text-ink dark:hover:text-cream border border-muted/30 hover:border-muted/60 transition-colors"
            >
              {dark ? "☀︎" : "☾"}
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-sm text-muted hover:text-gold transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Add Book Form */}
        {showForm && (
          <form
            onSubmit={handleAddBook}
            className="mb-8 p-6 bg-surface dark:bg-dark-surface rounded-2xl shadow-sm transition-colors"
          >
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-5">
              New Book
            </h2>
            {formError && (
              <div className="mb-4 p-3 rounded text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                {formError}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted">
                  Book Title
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. The Great Gatsby"
                  required
                  className="w-full py-2 bg-transparent border-b border-muted/40 dark:border-muted/30 focus:outline-none focus:border-gold transition-colors text-ink dark:text-cream placeholder:text-muted/50"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. F. Scott Fitzgerald"
                  required
                  className="w-full py-2 bg-transparent border-b border-muted/40 dark:border-muted/30 focus:outline-none focus:border-gold transition-colors text-ink dark:text-cream placeholder:text-muted/50"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted">
                  Language
                </label>
                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="e.g. English"
                  required
                  className="w-full py-2 bg-transparent border-b border-muted/40 dark:border-muted/30 focus:outline-none focus:border-gold transition-colors text-ink dark:text-cream placeholder:text-muted/50"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted">
                  Pages
                </label>
                <input
                  type="number"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                  placeholder="e.g. 180"
                  required
                  min="1"
                  className="w-full py-2 bg-transparent border-b border-muted/40 dark:border-muted/30 focus:outline-none focus:border-gold transition-colors text-ink dark:text-cream placeholder:text-muted/50"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full py-2 bg-transparent border-b border-muted/40 dark:border-muted/30 focus:outline-none focus:border-gold transition-colors text-ink dark:text-cream"
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full py-3 bg-navy dark:bg-gold text-cream dark:text-ink hover:opacity-90 disabled:opacity-50 rounded-lg font-semibold tracking-wide transition-colors"
            >
              {submitting ? "Adding…" : "Add Book"}
            </button>
          </form>
        )}

        {/* Books Grid */}
        {books.length === 0 ? (
          <p className="text-muted text-center py-16">
            No books yet — add your first one.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <div
                key={book._id}
                className="p-5 bg-surface dark:bg-dark-surface rounded-2xl shadow-sm transition-colors flex flex-col"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="font-bold text-ink dark:text-cream leading-snug">
                    {book.name}
                  </h2>
                  <span
                    onClick={() => handleToggleStatus(book._id)}
                    className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                      book.status === "read"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-gold"
                    }`}
                  >
                    {book.status}
                  </span>
                </div>
                <p className="text-sm text-muted mb-3">{book.author}</p>
                <div className="flex gap-2 text-xs text-muted mt-auto">
                  <span>{book.language}</span>
                  <span>·</span>
                  <span>{book.pages} pages</span>
                </div>
                <button
                  onClick={() => handleDelete(book._id)}
                  className="mt-4 text-xs text-muted hover:text-red-500 dark:hover:text-red-400 transition-colors self-start"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Books;
