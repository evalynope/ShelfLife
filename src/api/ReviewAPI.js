import { fetchAllRecords, createRecord } from "./CoreAPI";
import { getCurrentUser } from "./UserAPI";

// Optional helper (not required by your components, but kept for clarity)
function normalizeReviewRecord(raw) {
  if (!raw) return null;
  const { id, data_json } = raw;
  const r = data_json || {};
  return {
    id, // true Heroku record ID
    type: r.type ?? "review",
    workKey: r.workKey ?? "",
    bookTitle: r.bookTitle ?? "",
    rating: r.rating ?? 0,
    text: r.text ?? "",
    ownerEmail: r.ownerEmail ?? "",
    createdAt: r.createdAt ?? null,
  };
}

/**
 * Create a new review for the current logged-in user.
 * Backward-compatible: no return value expected.
 */
export async function addBookReview({ workKey, rating, text }) {
  const currentUser = getCurrentUser();
  if (!currentUser) throw new Error("You must be logged in to add a review.");

  const reviewPayload = {
    type: "review",
    ownerEmail: currentUser.email,
    workKey,
    rating,
    text,
    createdAt: Date.now(),
  };

  await createRecord(reviewPayload);
}

/**
 * Fetch all reviews for a given Open Library workKey.
 * Backward-compatible: returns array of { id, ...data_json } sorted newest first.
 */
export async function getReviewsForBook(workKey) {
  const allRecords = await fetchAllRecords();
  const reviewRecords = allRecords
    .filter(
      (record) =>
        record.data_json?.type === "review" &&
        record.data_json.workKey === workKey
    )
    // keep the exact shape your components expect:
    // { id: <heroku id>, ...data_json }
    .map((record) => ({ id: record.id, ...record.data_json }))
    .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

  return reviewRecords;
}
