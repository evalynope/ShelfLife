import React, { useState } from "react";
import axios from "axios";
import { addBookIfNotExists, fetchUserBookLists } from "../api/BookAPI";
import { getCurrentUser } from "../api/UserAPI";

function SearchBooks() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Search Open Library API ---
  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await axios.get(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );

      const books = response.data.docs.slice(0, 10).map((b) => ({
        title: b.title,
        author: Array.isArray(b.author_name)
          ? b.author_name.join(", ")
          : b.author_name || "Unknown",
        description: b.first_publish_year
          ? `First published in ${b.first_publish_year}`
          : "No description available",
        workKey: b.key,
        coverUrl: b.cover_i
          ? `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`
          : null,
      }));

      setResults(books);
    } catch (err) {
      console.error("Error searching Open Library:", err);
    } finally {
      setLoading(false);
    }
  }

  // --- Debug helper: view user lists in console ---
  async function viewMyLists() {
    const user = getCurrentUser();
    if (!user) {
      alert("You must be logged in to view your lists.");
      return;
    }

    const { tbrBooks, readBooks } = await fetchUserBookLists(user.email);
    console.log("TBR:", tbrBooks);
    console.log("Read:", readBooks);
  }

  // --- Add book to user's list ---
  async function handleAdd(book, status) {
    try {
      const added = await addBookIfNotExists(book, status);
      if (added) {
        alert(
          `✅ "${book.title}" added to your ${
            status === "read" ? "Read" : "TBR"
          } list!`
        );
      } else {
        alert(`⚠️ "${book.title}" is already in your lists.`);
      }
    } catch (err) {
      alert(`❌ Failed to add: ${err.message}`);
    }
  }

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Search Books</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title..."
          style={{ padding: "8px", width: "60%" }}
        />
        <button
          type="submit"
          style={{ marginLeft: "10px", padding: "8px 16px" }}
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "15px",
        }}
      >
        {results.map((book) => (
          <div
            key={book.workKey}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "10px",
              width: "220px",
              textAlign: "center",
              backgroundColor: "#faf9f6",
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
            <p>{book.author}</p>
            <p style={{ fontSize: "0.9em", color: "#666" }}>
              {book.description}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "6px",
                marginTop: "8px",
              }}
            >
              <button onClick={() => handleAdd(book, "tbr")}>Add to TBR</button>
              <button onClick={() => handleAdd(book, "read")}>Mark Read</button>
            </div>
          </div>
        ))}
      </div>

      <button onClick={viewMyLists} style={{ marginTop: "30px" }}>
        View My Lists (console)
      </button>
    </div>
  );
}

export default SearchBooks;
