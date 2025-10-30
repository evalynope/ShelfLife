import React, { useState } from "react";
import { searchBooksByTitle, addBookFromOpenLibrary } from "../api/BookAPI";

function SearchBooks({ currentUserEmail }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setMessage("");

    try {
      const books = await searchBooksByTitle(query);
      setResults(books);
      if (books.length === 0) setMessage("No results found.");
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (book) => {
    try {
      await addBookFromOpenLibrary(book, currentUserEmail, "tbr");
      alert(`✅ Added "${book.title}" to your TBR shelf!`);
    } catch (err) {
      alert(`❌ Failed to add book: ${err.message}`);
    }
  };

 
  const handleMarkAsRead = async (book) => {
    try {
        await addBookFromOpenLibrary(book, currentUserEmail, "read");
        alert(`✅ Marked "${book.title}" as read!`);
    } catch (err) {
     alert(`❌ Failed to mark as read: ${err.message}`);
    }
};

    

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Search Books</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a book title..."
          style={{ padding: "8px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit">Search</button>
      </form>

      {loading && <p>Loading...</p>}
      {message && <p>{message}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {results.map((book) => (
          <div
            key={book.workKey}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              margin: "10px",
              padding: "10px",
              width: "200px",
              textAlign: "center",
            }}
          >
            {book.coverUrl && (
              <img
                src={book.coverUrl}
                alt={book.title}
                style={{ width: "100%", borderRadius: "6px" }}
              />
            )}
            <h4>{book.title}</h4>
            <p>{book.authors?.join(", ")}</p>
            <button onClick={() => handleAddBook(book)}>Add to TBR Shelf</button>
            <button onClick={() => handleMarkAsRead(book)} style={{ marginTop: "5px" }}>
             Mark as Read
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SearchBooks;
