import { useState, useEffect } from "react";
import { getBooks } from "../api/books";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      <h1 className="text-3xl font-bold mb-6">My Books</h1>

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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Books;
