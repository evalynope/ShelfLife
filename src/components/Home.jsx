import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBooks } from "../api/BookAPI";
import { getCurrentUser } from "../api/UserAPI";
import "./Home.css";

function Home() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);

    async function loadBooks() {
      if (!user?.email) return;
      const allBooks = await getBooks(user.email);
      setBooks(allBooks);
    }

    loadBooks();
  }, []);

  const tbrBooks = books.filter((b) => b.status === "tbr").slice(0, 3);
  const readBooks = books.filter((b) => b.status === "read").slice(0, 3);

  return (
    <div className="home">
      <h1 className="title">Welcome to Shelf Life</h1>

      {!currentUser ? (
        <>
          <p>Your personal tracker for books you want to read.</p>
          <div className="home-buttons">
            <button onClick={() => navigate("/login")}>Login</button>
            <button onClick={() => navigate("/signup")}>Sign Up</button>
          </div>
        </>
      ) : (
        <>
          <h2 className="welcome-in">Hello, {currentUser.displayName || currentUser.email}!</h2>
          <p className="short">Here’s a quick look at your books:</p>

          {/* TBR Preview */}
          {tbrBooks.length > 0 && (
            <div className="book-preview">
              <h3>To Be Read</h3>
              <div className="book-grid">
                {tbrBooks.map((book) => (
                  <div key={book.id} className="book-card">
                    {book.coverUrl && (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="book-cover"
                      />
                    )}
                    <p>{book.title}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/tbr")}>View All TBR</button>
            </div>
          )}

          {/* Read Preview */}
          {readBooks.length > 0 && (
            <div className="book-preview">
              <h3>Read Books</h3>
              <div className="book-grid">
                {readBooks.map((book) => (
                  <div key={book.id} className="book-card">
                    {book.coverUrl && (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="book-cover"
                      />
                    )}
                    <p>{book.title}</p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate("/mytitles")}>View All Read</button>
            </div>
          )}

          {tbrBooks.length === 0 && readBooks.length === 0 && (
            <p>You don’t have any books yet — try adding some from Search!</p>
          )}
        </>
      )}
    </div>
  );
}

export default Home;
