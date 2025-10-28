import React, { useState } from "react";


export default function BookForm({ onAddBook }) {
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    description: "",
  });

  // updates the right field as the user types
  function handleInputChange(event) {
    const { name, value } = event.target;
    setNewBook(prevBook => ({
      ...prevBook,
      [name]: value,
    }));
  }

  // adds the book when the button is clicked
  function handleAddBook() {
    if (!newBook.title.trim() || !newBook.author.trim()) return;
    onAddBook(newBook); // pass the book to parent (App.js)
    setNewBook({ title: "", author: "", description: "" }); // reset form
  }

  return (
    <div className="book-form">
      <input
        type="text"
        name="title"
        placeholder="Book Title"
        value={newBook.title}
        onChange={handleInputChange}
      />

      <input
        type="text"
        name="author"
        placeholder="Author"
        value={newBook.author}
        onChange={handleInputChange}
      />

      <input
        type="text"
        name="description"
        placeholder="Description"
        value={newBook.description}
        onChange={handleInputChange}
      />

      <div className = "add"><button onClick={handleAddBook}>Add Book</button></div>
    </div>
  );
}
