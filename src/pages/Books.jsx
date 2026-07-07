import { useState, useEffect } from "react";
import { getBooks, addBook, deleteBook } from "../api/books";

function Books() {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Books</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded font-medium"
        >
          {showForm ? "Cancel" : "+ Add Book"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddBook}
          className="mb-6 p-4 bg-slate-800 rounded-lg space-y-3"
        >
          {formError && (
            <div className="p-2 bg-red-900 text-red-100 rounded text-sm">
              {formError}
            </div>
          )}

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Book name"
            required
            className="w-full px-3 py-2 bg-slate-700 rounded"
          />
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Author"
            required
            className="w-full px-3 py-2 bg-slate-700 rounded"
          />
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="Language"
            required
            className="w-full px-3 py-2 bg-slate-700 rounded"
          />
          <input
            type="number"
            value={pages}
            onChange={(e) => setPages(e.target.value)}
            placeholder="Pages"
            required
            min="1"
            className="w-full px-3 py-2 bg-slate-700 rounded"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 bg-slate-700 rounded"
          >
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded font-medium"
          >
            {submitting ? "Adding..." : "Add Book"}
          </button>
        </form>
      )}

      {books.length === 0 ? (
        <p className="text-slate-400">No books yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div key={book._id} className="p-4 bg-slate-800 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{book.name}</h2>
              <p className="text-slate-400">{book.author}</p>
              <div className="mt-2 flex gap-2 text-sm">
                <span className="px-2 py-1 bg-slate-700 rounded">
                  {book.language}
                </span>
                <span className="px-2 py-1 bg-slate-700 rounded">
                  {book.pages} pages
                </span>

                <span
                  className={`px-2 py-1 rounded ${
                    book.status === "read" ? "bg-green-700" : "bg-yellow-700"
                  }`}
                >
                  {book.status}
                </span>
              </div>
              <button
                onClick={() => handleDelete(book._id)}
                className="mt-3 w-full py-1 bg-red-700 hover:bg-red-800 rounded text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Books;
