import React, { useEffect, useState } from "react";
import { getBooks, deleteBook } from "../api/BookAPI";
import { addBookReview, getReviewsForBook } from "../api/ReviewAPI";

function StarRating({ value, onChange }) {
  return (
    <div style={{ margin: "6px 0" }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= value;
        return (
          <span
            key={star}
            onClick={() => onChange(star)}
            style={{
              cursor: "pointer",
              fontSize: "1.8rem",
              color: isFilled ? "#f5c518" : "#ddd",
              transition: "color 0.2s",
              userSelect: "none",
              WebkitTextStroke: isFilled ? "0" : "1px #999",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}

function MyTitles({ currentUserEmail }) {
  const [books, setBooks] = useState([]);
  const [activeBook, setActiveBook] = useState(null); // which book is being reviewed
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviews, setReviews] = useState({}); // store fetched reviews

  // Fetch only read books
  useEffect(() => {
    async function fetchReadBooks() {
      if (!currentUserEmail) return;

      // Get all books for the user
      const userBooks = await getBooks(currentUserEmail);

      // Filter for read books
      const readBooks = userBooks.filter((b) => b.status === "read");
      setBooks(readBooks);

      // Fetch reviews for each read book
      const reviewData = {};
      for (const b of readBooks) {
        const r = await getReviewsForBook(b.workKey);
        reviewData[b.workKey] = r;
      }
      setReviews(reviewData);
    }

    fetchReadBooks();
  }, [currentUserEmail]);

  // Remove book
  const handleRemove = async (id) => {
    await deleteBook(id);
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  // Add review
  const handleAddReview = async (book) => {
    try {
      await addBookReview({
        workKey: book.workKey,
        rating,
        text: reviewText,
      });
      alert("✅ Review added!");

      // Refresh reviews for this book
      const updated = await getReviewsForBook(book.workKey);
      setReviews((prev) => ({ ...prev, [book.workKey]: updated }));

      // Reset form
      setActiveBook(null);
      setReviewText("");
      setRating(0);
    } catch (err) {
      alert(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>My Books: Read</h2>

      {books.length === 0 ? (
        <p>No read books yet.</p>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {books.map((book) => (
            <div
              key={book.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                margin: "10px",
                padding: "10px",
                width: "220px",
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
              <p>{book.author}</p>

              {/* Remove + Review buttons */}
              <button onClick={() => handleRemove(book.id)}>Remove</button>

              {/* Only show Rate/Review if user hasn't reviewed this book */}
              {!reviews[book.workKey]?.some(
                (r) => r.ownerEmail === currentUserEmail
              ) && (
                <button onClick={() => setActiveBook(book)}>Rate/Review</button>
              )}

              {/* Show review form if this book is active */}
              {activeBook?.id === book.id && (
                <div style={{ marginTop: "10px" }}>
                  <h5>Add a Review</h5>
                  <StarRating value={rating} onChange={setRating} />

                  <br />
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Write your thoughts..."
                    rows={3}
                    style={{ width: "90%", marginTop: "5px" }}
                  />
                  <br />
                  <button onClick={() => handleAddReview(book)}>Submit</button>
                </div>
              )}

              {/* Show existing reviews */}
              {reviews[book.workKey]?.length > 0 && (
                <div style={{ marginTop: "10px", textAlign: "left" }}>
                  <h5>Reviews:</h5>
                  {reviews[book.workKey].map((r) => (
                    <div
                      key={r.id}
                      style={{ borderTop: "1px solid #eee", paddingTop: "4px" }}
                    >
                      <p>
                        ⭐ {r.rating}/5
                        <br />
                        {r.text}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTitles;
