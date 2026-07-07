const API_URL = "http://localhost:5002";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// GET
export async function getBooks() {
  const response = await fetch(`${API_URL}/books`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch books");
  }

  return data;
}

// POST
export async function addBook(book) {
  const response = await fetch(`${API_URL}/books`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(book),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add book");
  }

  return data;
}

// DELETE
export async function deleteBook(id) {
  const response = await fetch(`${API_URL}/books/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || "Failed to delete book");
  }

  return;
}

// PATCH
export async function toggleBookStatus(id) {
  const response = await fetch(`${API_URL}/books/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update status");
  }

  return data;
}

// GET — Google Books proxy
export async function searchBooks(query) {
  const response = await fetch(
    `${API_URL}/search?q=${encodeURIComponent(query)}`,
    {
      headers: getAuthHeaders(),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to search books");
  }

  return data;
}

// POST
export async function addReview(id, rating, comment) {
  const response = await fetch(`${API_URL}/books/${id}/reviews`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ rating, comment }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to add review");
  }

  return data;
}
