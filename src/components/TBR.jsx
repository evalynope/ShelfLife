import React, { useEffect, useState } from "react";
import { getBooks } from "../api/BookAPI";

function TBR({ currentUserEmail }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      if (!currentUserEmail) return;
      const userBooks = await getBooks(currentUserEmail);
      setBooks(userBooks);
    }
    fetchBooks();
  }, [currentUserEmail]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My TBR List</h2>
      {books.length === 0 ? (
        <p>No books yet. Try adding one from the Search page!</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {books.map((b) => (
            <div
              key={b.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px",
                padding: "10px",
                width: "200px",
              }}
            >
              {b.coverUrl && <img src={b.coverUrl} alt={b.title} width="100%" />}
              <h4>{b.title}</h4>
              <p>{b.author}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TBR;

