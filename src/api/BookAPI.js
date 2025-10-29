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
    id,
    type: b.type ?? BOOK_TYPE,
    title: b.title ?? "",
    author: b.author ?? "",
    description: b.description ?? "",
    status: b.status ?? "tbr",
    coverUrl: b.coverUrl ?? null,
    workKey: b.workKey ?? "",
    ownerEmail: b.ownerEmail ?? "",
    createdAt: b.createdAt ?? null
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

/**
 * Get detailed book info by work key (e.g. '/works/OL82563W')
 */
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

    // Optional filter for per-user views
    return currentUserEmail
      ? normalized.filter((b) => b.ownerEmail === currentUserEmail)
      : normalized;
  } catch (err) {
    console.error("❌ getBooks failed:", err.message);
    throw err;
  }
}

export async function addBookFromOpenLibrary(openBook, userEmail) {
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
  };
  const res = await createRecord(payload);
  const created = res?.[0] ?? null;
  return created ? normalizeBookRecord(created) : null;
}

export async function updateBook(recordId, updatedFields) {
  const payload = {
    title: updatedFields.title ?? "",
    author: updatedFields.author ?? "",
    description: updatedFields.description ?? "",
    coverUrl: updatedFields.coverUrl ?? null,
    status: updatedFields.status ?? undefined,
  };

  try {
    const res = await updateRecord(recordId, payload);
    const updated = res?.[0] ?? null;
    return updated ? normalizeBookRecord(updated) : null;
  } catch (err) {
    console.error("❌ updateBook failed:", err.message);
    throw err;
  }
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
