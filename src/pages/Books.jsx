import { useState, useEffect } from "react";
import {
  getBooks,
  addBook,
  deleteBook,
  toggleBookStatus,
  searchBooks,
  addReview,
} from "../api/books";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/AuthContext";
import BottomNav from "../components/BottomNav";
import ThemeToggle from "../components/ThemeToggle";

// ── Cover placeholder ────────────────────────────────────────────────────────
const COVER_COLORS = [
  "bg-amber-200 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  "bg-emerald-200 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200",
  "bg-sky-200 text-sky-800 dark:bg-sky-900/40 dark:text-sky-200",
  "bg-rose-200 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200",
  "bg-violet-200 text-violet-800 dark:bg-violet-900/40 dark:text-violet-200",
];

function coverColor(title) {
  return COVER_COLORS[(title?.charCodeAt(0) ?? 0) % COVER_COLORS.length];
}

// ── BookCard ─────────────────────────────────────────────────────────────────
function BookCard({ book, onToggle, onDelete, onOpen }) {
  return (
    <div
      onClick={() => onOpen(book._id)}
      className="flex flex-col bg-surface dark:bg-dark-surface rounded-xl border border-muted/10 overflow-hidden transition-colors cursor-pointer"
    >
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt={book.name}
          className="w-full aspect-2/3 object-cover"
        />
      ) : (
        <div
          className={`w-full aspect-2/3 flex items-center justify-center font-bold text-3xl ${coverColor(book.name)}`}
        >
          {book.name?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}

      <div className="p-2.5 flex flex-col gap-1.5">
        <p className="font-semibold text-sm text-ink dark:text-cream leading-snug line-clamp-2">
          {book.name}
        </p>
        <p className="text-xs text-muted truncate">{book.author}</p>

        <div className="flex items-center justify-between mt-1">
          <span
            onClick={(e) => {
              e.stopPropagation();
              onToggle(book._id);
            }}
            className={`text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
              book.status === "read"
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-gold"
            }`}
          >
            {book.status === "read" ? "Read" : "Unread"}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(book._id);
            }}
            aria-label="Remove book"
            className="text-xs text-muted/50 hover:text-red-500 dark:hover:text-red-400 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Stars ────────────────────────────────────────────────────────────────────
function Stars({ value, onChange, size = "text-xl" }) {
  const interactive = typeof onChange === "function";
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= value;
        const starClass = `${size} leading-none transition-colors ${
          filled ? "text-gold" : "text-muted/30"
        } ${interactive ? "cursor-pointer hover:text-gold" : ""}`;

        return interactive ? (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            className={starClass}
          >
            ★
          </button>
        ) : (
          <span key={n} className={starClass} aria-hidden="true">
            ★
          </span>
        );
      })}
    </div>
  );
}

// ── ReviewSection ────────────────────────────────────────────────────────────
function ReviewSection({ book, onSubmit }) {
  const existing = book.reviews?.[0];
  const [editing, setEditing] = useState(!existing);
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Pick a rating.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await onSubmit(rating, comment);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!editing && existing) {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
            Your Review
          </h3>
          <button
            onClick={() => setEditing(true)}
            className="text-xs text-gold hover:underline"
          >
            Edit
          </button>
        </div>
        <Stars value={existing.rating} />
        {existing.comment && (
          <p className="mt-2 text-sm text-ink dark:text-cream leading-relaxed">
            {existing.comment}
          </p>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-widest text-muted">
        {existing ? "Edit Your Review" : "Add a Review"}
      </h3>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Stars value={rating} onChange={setRating} size="text-3xl" />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you think?"
        rows={3}
        className="w-full p-3 bg-surface dark:bg-dark-surface border border-muted/20 rounded-lg focus:outline-none focus:border-gold transition-colors text-ink dark:text-cream placeholder:text-muted/50 resize-none"
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 py-2.5 bg-navy dark:bg-gold text-cream dark:text-ink rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-colors"
        >
          {submitting
            ? "Saving…"
            : existing
              ? "Update Review"
              : "Submit Review"}
        </button>
        {existing && (
          <button
            type="button"
            onClick={() => {
              setEditing(false);
              setRating(existing.rating);
              setComment(existing.comment ?? "");
              setError("");
            }}
            className="px-4 py-2.5 text-sm text-muted hover:text-ink dark:hover:text-cream transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ── BookDetail ───────────────────────────────────────────────────────────────
function BookDetail({ book, onBack, onToggle, onDelete, onAddReview }) {
  const handleDelete = () => {
    onDelete(book._id);
    onBack();
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-muted hover:text-ink dark:hover:text-cream transition-colors"
        >
          ← Back
        </button>
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center text-center mb-6">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.name}
            className="w-40 aspect-2/3 object-cover rounded-xl shadow-md mb-4"
          />
        ) : (
          <div
            className={`w-40 aspect-2/3 rounded-xl shadow-md mb-4 flex items-center justify-center font-bold text-5xl ${coverColor(book.name)}`}
          >
            {book.name?.[0]?.toUpperCase() ?? "?"}
          </div>
        )}

        <h1 className="text-xl font-bold tracking-tight text-ink dark:text-cream">
          {book.name}
        </h1>
        <p className="text-sm text-muted mt-1">{book.author}</p>

        <div className="flex items-center gap-2 mt-3 text-xs text-muted/70">
          {book.language && <span>{book.language}</span>}
          {book.language && book.pages ? <span>·</span> : null}
          {book.pages && <span>{book.pages} pages</span>}
        </div>

        <span
          onClick={() => onToggle(book._id)}
          className={`mt-4 text-xs font-semibold px-3 py-1 rounded-full cursor-pointer transition-colors ${
            book.status === "read"
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-gold"
          }`}
        >
          {book.status === "read" ? "Read" : "Unread"}
        </span>
      </div>

      <div className="border-t border-muted/10 pt-6 mb-6">
        <ReviewSection
          book={book}
          onSubmit={(rating, comment) =>
            onAddReview(book._id, rating, comment)
          }
        />
      </div>

      <button
        onClick={handleDelete}
        className="w-full py-3 text-sm font-semibold text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
      >
        Delete Book
      </button>
    </div>
  );
}

// ── Books (main page) ────────────────────────────────────────────────────────
function Books() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeView, setActiveView] = useState("library");

  // ── Existing state ──
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Book detail view
  const [selectedBookId, setSelectedBookId] = useState(null);

  // Manual-form state (existing)
  const [showManualForm, setShowManualForm] = useState(false);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [language, setLanguage] = useState("");
  const [pages, setPages] = useState("");
  const [status, setStatus] = useState("unread");

  // ── Search state ──
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [addingBookId, setAddingBookId] = useState(null);

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

  // ── Existing handlers ────────────────────────────────────────────────────
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
      setShowManualForm(false);
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

  const handleAddReview = async (id, rating, comment) => {
    await addReview(id, rating, comment);
    setBooks((prev) =>
      prev.map((book) =>
        book._id === id ? { ...book, reviews: [{ rating, comment }] } : book,
      ),
    );
  };

  // ── New handlers ─────────────────────────────────────────────────────────
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchError("");
    setSearchResults([]);
    setSearching(true);

    try {
      const results = await searchBooks(searchQuery);
      setSearchResults(results);
    } catch (err) {
      setSearchError(err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleAddFromSearch = async (result) => {
    setAddingBookId(result.googleBookId);
    try {
      const newBook = {
        name: result.title,
        author: result.author,
        language: result.language || "en",
        pages: result.pages || 1,
        status: "unread",
        googleBookId: result.googleBookId,
        coverUrl: result.coverUrl,
      };
      const apiResult = await addBook(newBook);
      setBooks((prev) => [...prev, { ...newBook, _id: apiResult.id }]);
    } catch (err) {
      alert(err.message);
    } finally {
      setAddingBookId(null);
    }
  };

  // ── Early returns ─────────────────────────────────────────────────────────
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

  // ── Derived data ──────────────────────────────────────────────────────────
  const unreadBooks = books.filter((b) => b.status !== "read");
  const readBooks = books.filter((b) => b.status === "read");
  const addedIds = new Set(books.map((b) => b.googleBookId).filter(Boolean));
  const selectedBook = books.find((b) => b._id === selectedBookId) ?? null;

  // Shared style strings
  const inputClass =
    "w-full py-2 bg-transparent border-b border-muted/40 dark:border-muted/30 focus:outline-none focus:border-gold transition-colors text-ink dark:text-cream placeholder:text-muted/50";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-widest text-muted mb-1";

  // ── Render ────────────────────────────────────────────────────────────────
  if (selectedBook) {
    return (
      <div className="min-h-screen bg-cream dark:bg-ink text-ink dark:text-cream transition-colors">
        <main className="max-w-4xl mx-auto px-4 py-6">
          <BookDetail
            book={selectedBook}
            onBack={() => setSelectedBookId(null)}
            onToggle={handleToggleStatus}
            onDelete={handleDelete}
            onAddReview={handleAddReview}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-ink text-ink dark:text-cream transition-colors">
      <BottomNav activeView={activeView} onViewChange={setActiveView} />

      {/* pt-6 pb-24 on mobile leaves room for bottom nav; md+ flips to top nav */}
      <main className="max-w-4xl mx-auto px-4 pt-6 pb-24 md:pt-20 md:pb-8">

        {/* ── LIBRARY VIEW ──────────────────────────────────────────────── */}
        {activeView === "library" && (
          <>
            {books.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <p className="text-muted">Your library is empty.</p>
                <button
                  onClick={() => setActiveView("add")}
                  className="text-sm text-gold hover:underline"
                >
                  Search for a book to add →
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {unreadBooks.length > 0 && (
                  <section>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
                      Reading · Unread{" "}
                      <span className="text-gold">{unreadBooks.length}</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {unreadBooks.map((book) => (
                        <BookCard
                          key={book._id}
                          book={book}
                          onToggle={handleToggleStatus}
                          onDelete={handleDelete}
                          onOpen={setSelectedBookId}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {readBooks.length > 0 && (
                  <section>
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-4">
                      Read{" "}
                      <span className="text-gold">{readBooks.length}</span>
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {readBooks.map((book) => (
                        <BookCard
                          key={book._id}
                          book={book}
                          onToggle={handleToggleStatus}
                          onDelete={handleDelete}
                          onOpen={setSelectedBookId}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </>
        )}

        {/* ── ADD VIEW ──────────────────────────────────────────────────── */}
        {activeView === "add" && (
          <div>
            {/* Manual add — top */}
            <div className="mb-8">
              <button
                onClick={() => setShowManualForm(!showManualForm)}
                className="text-xs text-muted hover:text-gold transition-colors"
              >
                {showManualForm
                  ? "Hide manual form ↑"
                  : "Can't find it? Add manually ↓"}
              </button>

              {showManualForm && (
                <form onSubmit={handleAddBook} className="mt-5 space-y-5">
                  {formError && (
                    <div className="p-3 rounded text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Book Title</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. The Great Gatsby"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Author</label>
                      <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g. F. Scott Fitzgerald"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Language</label>
                      <input
                        type="text"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        placeholder="e.g. English"
                        required
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Pages</label>
                      <input
                        type="number"
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                        placeholder="e.g. 180"
                        required
                        min="1"
                        className={inputClass}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelClass}>Status</label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={inputClass}
                      >
                        <option value="unread">Unread</option>
                        <option value="read">Read</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-navy dark:bg-gold text-cream dark:text-ink hover:opacity-90 disabled:opacity-50 rounded-lg font-semibold tracking-wide transition-colors"
                  >
                    {submitting ? "Adding…" : "Add Book"}
                  </button>
                </form>
              )}
            </div>

            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted mb-5 border-t border-muted/10 pt-6">
              Search Books
            </h2>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Title, author, ISBN…"
                className="flex-1 py-2 bg-transparent border-b border-muted/40 dark:border-muted/30 focus:outline-none focus:border-gold transition-colors text-ink dark:text-cream placeholder:text-muted/50"
              />
              <button
                type="submit"
                disabled={searching}
                className="px-4 py-2 bg-navy dark:bg-gold text-cream dark:text-ink rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-colors shrink-0"
              >
                {searching ? "…" : "Search"}
              </button>
            </form>

            {searchError && (
              <p className="mb-4 text-sm text-red-500">{searchError}</p>
            )}

            {searchResults.length > 0 && (
              <div className="space-y-2 mb-8">
                {searchResults.map((result) => {
                  const alreadyAdded = addedIds.has(result.googleBookId);
                  const isAdding = addingBookId === result.googleBookId;
                  return (
                    <div
                      key={result.googleBookId}
                      className="flex items-center gap-3 p-3 bg-surface dark:bg-dark-surface rounded-xl border border-muted/10 transition-colors"
                    >
                      {result.coverUrl ? (
                        <img
                          src={result.coverUrl}
                          alt={result.title}
                          className="w-10 h-14 object-cover rounded shrink-0"
                        />
                      ) : (
                        <div
                          className={`w-10 h-14 rounded shrink-0 flex items-center justify-center font-bold text-lg ${coverColor(result.title)}`}
                        >
                          {result.title?.[0]?.toUpperCase() ?? "?"}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-ink dark:text-cream truncate leading-snug">
                          {result.title}
                        </p>
                        <p className="text-xs text-muted truncate">
                          {result.author}
                        </p>
                        {result.pages && (
                          <p className="text-xs text-muted/70 mt-0.5">
                            {result.pages} pages
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() =>
                          !alreadyAdded && handleAddFromSearch(result)
                        }
                        disabled={alreadyAdded || isAdding}
                        className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                          alreadyAdded
                            ? "text-muted cursor-default"
                            : "bg-navy dark:bg-gold text-cream dark:text-ink hover:opacity-90 disabled:opacity-50"
                        }`}
                      >
                        {isAdding ? "…" : alreadyAdded ? "Added" : "+ Add"}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE VIEW ──────────────────────────────────────────────── */}
        {activeView === "profile" && (
          <div className="max-w-sm">
            <div className="mb-8">
              <div className="w-16 h-16 rounded-full bg-gold/20 dark:bg-gold/10 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-gold">
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-ink dark:text-cream">
                {user?.name ?? "—"}
              </h2>
              {user?.email && (
                <p className="text-sm text-muted mt-1">{user.email}</p>
              )}
              <p className="text-xs text-muted/70 mt-1">
                {books.length} book{books.length !== 1 ? "s" : ""} in library
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full py-3 text-sm font-semibold text-red-500 dark:text-red-400 border border-red-200 dark:border-red-800/40 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

export default Books;
