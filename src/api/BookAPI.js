// BookAPI.js
// Integrates Open Library search and Heroku persistence.

import { fetchAllRecords, createRecord, updateRecord, deleteRecord } from "./CoreAPI.js";

const BOOK_TYPE = "book";

// Normalize a Heroku book record
function normalizeBookRecord(raw) {
  if (!raw) return null;
  const { id, data_json } = raw;
  const b = data_json || raw.body || {};
  return {
    id: id ?? b.id ?? null,
    title: b.title ?? "",
    author: b.author ?? "",
    description: b.description ?? "",
    coverUrl: b.coverUrl ?? null,
    workKey: b.workKey ?? "",
    ownerEmail: b.ownerEmail ?? "",
    createdAt: b.createdAt ?? null,
  };
}

// Normalize Open Library search result
function normalizeOpenLibraryResult(entry) {
  return {
    workKey: entry.key ?? "",
    title: entry.title ?? "",
    authors: entry.author_name ?? [],
    firstPublishedYear: entry.first_publish_year ?? "",
    coverId: entry.cover_i ?? null,
    coverUrl: entry.cover_i
      ? `https://covers.openlibrary.org/b/id/${entry.cover_i}-L.jpg`
      : null,
  };
}

// ----------------------
// 🔹 Open Library Search
// ----------------------

/**
 * Search books by title on Open Library.
 * Example: https://openlibrary.org/search.json?title=Dune
 */
export async function searchBooksByTitle(title) {
  if (!title?.trim()) return [];
  const query = encodeURIComponent(title.trim());
  const url = `https://openlibrary.org/search.json?title=${query}&limit=20`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open Library search failed (${res.status})`);
  const data = await res.json();
  return (data.docs || []).map(normalizeOpenLibraryResult);
}

/**
 * Get detailed book info by work key (e.g. '/works/OL82563W')
 */
export async function getBookDetails(workKey) {
  if (!workKey) return null;
  const res = await fetch(`https://openlibrary.org${workKey}.json`);
  if (!res.ok) throw new Error(`Open Library details failed (${res.status})`);
  return await res.json();
}

// ----------------------
// 🔹 Heroku CRUD
// ----------------------

export async function getBooks(currentUserEmail = null) {
  const all = await fetchAllRecords();
  const books = all.filter(r => r.data_json?.type === BOOK_TYPE);
  const filtered = currentUserEmail
    ? books.filter(r => r.data_json?.ownerEmail === currentUserEmail)
    : books;
  return filtered.map(normalizeBookRecord);
}

export async function addBookFromOpenLibrary(openBook, currentUserEmail) {
  // openBook comes directly from searchBooksByTitle()
  const payload = {
    type: BOOK_TYPE,
    title: openBook.title,
    author: (openBook.authors || []).join(", "),
    description: openBook.firstPublishedYear
      ? `First published in ${openBook.firstPublishedYear}`
      : "",
    coverUrl: openBook.coverUrl ?? null,
    workKey: openBook.workKey,
    ownerEmail: currentUserEmail ?? "",
    createdAt: Date.now(),
  };

  const result = await createRecord(payload);
  const created = result?.[0] ?? null;
  return created ? normalizeBookRecord(created) : null;
}

export async function updateBook(recordId, updatedFields) {
  const payload = {
    title: updatedFields.title ?? "",
    author: updatedFields.author ?? "",
    description: updatedFields.description ?? "",
    coverUrl: updatedFields.coverUrl ?? null,
  };
  const result = await updateRecord(recordId, payload);
  const updated = result?.[0] ?? null;
  return updated ? normalizeBookRecord(updated) : null;
}

export async function deleteBook(recordId) {
  return await deleteRecord(recordId);
}
