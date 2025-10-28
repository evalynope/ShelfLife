import { fetchAllRecords, createRecord } from "./CoreAPI";
import { getCurrentUser } from "./UserAPI";


export async function searchBooksByTitle(bookTitle) {
  const queryUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(
    bookTitle
  )}&limit=20`;
  const response = await fetch(queryUrl);
  const data = await response.json();

  return (data.docs || []).map((bookDoc) => ({
    workKey: (bookDoc.key || "").replace("/works/", ""),
    title: bookDoc.title,
    authors: bookDoc.author_name || [],
    coverId: bookDoc.cover_i || null,
    year: bookDoc.first_publish_year || null,
  }));
}

export async function getUserBooks() {
  const currentUser = getCurrentUser();
  const allRecords = await fetchAllRecords();

  return allRecords
    .filter(
      (record) =>
        record.data_json?.type === "book" &&
        record.data_json.ownerEmail === currentUser?.email
    )
    .map((record) => ({ id: record.id, ...record.data_json }));
}

export async function addBookToUserList(bookData) {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("You must be logged in to save books.");

  const bookPayload = {
    type: "book",
    ownerEmail: currentUser.email,
    workKey: bookData.workKey,
    title: bookData.title,
    authors: bookData.authors || [],
    coverId: bookData.coverId || null,
    notes: "",
    status: "to-read",
    createdAt: Date.now(),
  };

  await createRecord(bookPayload);
}
