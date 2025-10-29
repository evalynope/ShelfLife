import React, { useEffect, useState } from "react";
import { getBooks, updateBook, deleteBook } from "../api/BookAPI";



function TBR({ currentUserEmail }) {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    async function fetchBooks() {
      if (!currentUserEmail) return;
      const userBooks = await getBooks(currentUserEmail);
      const tbrBooks = userBooks.filter((b) => b.status === "tbr");
      setBooks(tbrBooks);
    }
    fetchBooks();
  }, [currentUserEmail]);

const handleMarkAsRead = async (book) => {
  try {
    await updateBook(book.id, { status: "read" });
    alert(`📚 "${book.title}" marked as read!`);
    // Remove the book from TBR list immediately
    setBooks((prev) => prev.filter((b) => b.id !== book.id));

  } catch (err) {
    alert(`❌ Failed to update: ${err.message}`);
  }
};

const handleDelete = async (bookId) => {
  try {
    await deleteBook(bookId);
    // Remove the book locally from the state so the UI updates immediately
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    alert("✅ Book deleted successfully!");
  } catch (err) {
    alert(`❌ Failed to delete book: ${err.message}`);
  }
};



  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>My TBR List</h2>
      {books.length === 0 ? (
        <p>No books yet. Try adding one from the Search page!</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
          {books.map((b) => (
            <div
              key={b.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                margin: "10px",
                padding: "10px",
                width: "200px",
                textAlign: "center",
              }}
            >
              {b.coverUrl && (
                <img
                  src={b.coverUrl}
                  alt={b.title}
                  style={{ width: "100%", borderRadius: "6px" }}
                />
              )}
              <h4>{b.title}</h4>
              <p>{b.author}</p>
                  <div style={{ display: "flex", justifyContent: "center", gap: "5px", marginTop: "10px" }}>
              <button onClick={() => handleMarkAsRead(b)}>Mark as Read</button>
              <button onClick={() => handleDelete(b.id)} >Delete</button>
            </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TBR;

