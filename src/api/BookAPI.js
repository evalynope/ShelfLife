import { fetchAllRecords, createRecord, updateRecord, deleteRecord } from "./CoreAPI.js";
import { getCurrentUser } from "./UserAPI.js";

const BOOK_TYPE = "book";

// Normalize a Heroku book record
function normalizeBookRecord(raw) {
  if (!raw) return null;
  const { id, data_json } = raw;
  const b = data_json || raw.body || {};
  return {
    id,
    type: b.type ?? BOOK_TYPE,
    title: b.title ?? "",
    author: b.author ?? "",
    description: b.description ?? "",
    status: b.status ?? "tbr",
    coverUrl: b.coverUrl ?? null,
    workKey: b.workKey ?? "",
    ownerEmail: b.ownerEmail ?? "",
    createdAt: b.createdAt ?? null,
  };
}

// ----------------------
// 🔹 Open Library Search
// ----------------------

export async function searchBooksByTitle(title) {
  if (!title?.trim()) return [];
  const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}&limit=20`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open Library search failed (${res.status})`);
  const data = await res.json();
  return (data.docs || []).map((entry) => ({
    workKey: entry.key ?? "",
    title: entry.title ?? "",
    authors: entry.author_name ?? [],
    firstPublishedYear: entry.first_publish_year ?? "",
    coverUrl: entry.cover_i
      ? `https://covers.openlibrary.org/b/id/${entry.cover_i}-L.jpg`
      : null,
  }));
}

export async function getBookDetails(workKey) {
  if (!workKey) return null;
  const normalizedKey = workKey.startsWith("/works/") ? workKey : `/works/${workKey}`;
  const res = await fetch(`https://openlibrary.org${normalizedKey}.json`);
  if (!res.ok) throw new Error(`Open Library details failed (${res.status})`);
  return await res.json();
}

// ----------------------
// 🔹 Heroku CRUD
// ----------------------

export async function getBooks(currentUserEmail = null) {
  try {
    const allRecords = await fetchAllRecords();
    const bookRecords = allRecords.filter((r) => r.data_json?.type === BOOK_TYPE);
    const normalized = bookRecords.map(normalizeBookRecord);
    return currentUserEmail
      ? normalized.filter((b) => b.ownerEmail === currentUserEmail)
      : normalized;
  } catch (err) {
    console.error("❌ getBooks failed:", err.message);
    throw err;
  }
}

// ✅ Fixed: use createRecord instead of api.post()
export async function addBook(bookData) {
  const payload = {
    ...bookData,
    type: BOOK_TYPE,
    createdAt: Date.now(),
  };
  const res = await createRecord(payload);
  const created = res?.[0] ?? null;
  return created ? normalizeBookRecord(created) : null;
}

export async function addBookFromOpenLibrary(openBook, userEmail, book_status) {
  const payload = {
    type: BOOK_TYPE,
    title: openBook.title,
    author: (openBook.authors || []).join(", "),
    description: openBook.firstPublishedYear
      ? `First published in ${openBook.firstPublishedYear}`
      : "",
    coverUrl: openBook.coverUrl ?? null,
    workKey: openBook.workKey,
    ownerEmail: userEmail ?? "",
    createdAt: Date.now(),
    status: book_status,
  };
  const res = await createRecord(payload);
  const created = res?.[0] ?? null;
  return created ? normalizeBookRecord(created) : null;
}

export async function updateBook(recordId, updatedFields) {
  const allRecords = await fetchAllRecords();
  const record = allRecords.find((r) => r.id === recordId);
  if (!record) throw new Error(`Book with ID ${recordId} not found`);
  const current = record.data_json || record.body || {};
  const merged = { ...current, ...updatedFields };
  const result = await updateRecord(recordId, merged);
  const updated = result?.[0];
  return updated ? normalizeBookRecord(updated) : null;
}

export async function deleteBook(recordId) {
  try {
    const res = await deleteRecord(recordId);
    const deleted = res?.data?.response?.[0] ?? res;
    return deleted ? normalizeBookRecord(deleted) : { id: recordId, deleted: true };
  } catch (err) {
    console.error("❌ deleteBook failed:", err.message);
    throw err;
  }
}

// ----------------------
// 🔹 Helpers
// ----------------------

export async function fetchUserBookLists(userEmail) {
  if (!userEmail) throw new Error("Missing user email");
  const allBooks = await getBooks(userEmail);
  const tbrBooks = allBooks.filter((b) => b.status === "tbr");
  const readBooks = allBooks.filter((b) => b.status === "read");
  return { tbrBooks, readBooks };
}

export async function addBookIfNotExists(bookData, status = "tbr") {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("You must be logged in to add books.");

  const { tbrBooks, readBooks } = await fetchUserBookLists(currentUser.email);
  const allUserBooks = [...tbrBooks, ...readBooks];
  const alreadyExists = allUserBooks.some((b) => b.workKey === bookData.workKey);

  if (alreadyExists) {
    console.log("Book already exists in user list, skipping add.");
    return null;
  }

  const newBook = {
    ...bookData,
    type: BOOK_TYPE,
    ownerEmail: currentUser.email,
    status,
    createdAt: Date.now(),
  };

  return await addBook(newBook);
}
