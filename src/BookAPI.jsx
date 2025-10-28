import axios from "axios";

const API_BASE = "https://unit-4-project-app-24d5eea30b23.herokuapp.com";
const TEAM_ID = 1;

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

//// Normalization
function normalizeBookRecord(raw) {
  if (!raw) return null;
  const { id, data_json } = raw;
  return {
    id,
    title: data_json?.title ?? "",
    author: data_json?.author ?? "",
    description: data_json?.description ?? "",
  };
}

//// Extractors
function extractBookList(res) {
  const list = res?.data?.response ?? [];
  return list.map(normalizeBookRecord).filter(Boolean);
}

//// CRUD
export async function getBooks() {
  const res = await api.get("/get/all", { params: { teamId: TEAM_ID } });
  return extractBookList(res);
}

export async function addBook(book) {
  const res = await api.post("/post/data", {
    team: 1,
    body: { ...book },
  });
  const created = res?.data?.response?.[0];
  if (created) {
    const newId = created.id ?? created.data_json?.id ?? null;
    const payload = created.body ?? created.data_json ?? {};
    return { id: newId, title: payload.title ?? "", author: payload.author ?? "", description: payload.description ?? "" };
  }

  return null;
}


export async function updateBook(id, book) {
  const res = await api.post(
    "/update/data",
    { title: book.title, author: book.author, description: book.description },
    { params: { teamId: 1, recordId: id } }
  );
  return res?.data?.response?.[0] ?? null;
}
export async function deleteBook(id) {
  const res = await api.post("/delete/data", { id, team: TEAM_ID });
  return res?.data ?? { id };
}
