import { fetchAllRecords, createRecord, updateRecord, deleteRecord } from "./CoreAPI";
import { getCurrentUser } from "./UserAPI";

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

export async function getReviewsForBook(workKey) {
  const allRecords = await fetchAllRecords();
  const reviewRecords = allRecords
    .filter(
      (record) =>
        record.data_json?.type === "review" &&
        record.data_json.workKey === workKey
    )
    .map((record) => ({ id: record.id, ...record.data_json }))
    .sort((a, b) => b.createdAt - a.createdAt);

  return reviewRecords;
}
