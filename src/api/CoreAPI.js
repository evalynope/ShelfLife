import axios from "axios";

// ---- CONFIGURATION ----
const API_BASE_URL = "https://unit-4-project-app-24d5eea30b23.herokuapp.com";
const TEAM_ID = 1;

// ---- AXIOS INSTANCE ----
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  params: { teamid: TEAM_ID },
  headers: { "Content-Type": "application/json" },
});

// ---- HELPER TO UNWRAP API RESPONSES ----
const unwrapResponse = (response) => response.data?.response ?? [];

// ---- GENERIC CRUD FUNCTIONS ----
export async function fetchAllRecords() {
  const response = await apiClient.get("/");
  return unwrapResponse(response);
}

export async function fetchRecordById(recordId) {
  const response = await apiClient.get(`/${recordId}`);
  const responseData = Array.isArray(response.data?.response)
    ? response.data.response[0]
    : response.data;
  return responseData;
}

export async function createRecord(dataPayload) {
  const response = await apiClient.post("/", { data_json: dataPayload });
  return response.data;
}

export async function updateRecord(recordId, updatedData) {
  const response = await apiClient.put(`/${recordId}`, { data_json: updatedData });
  return response.data;
}

export async function deleteRecord(recordId) {
  const response = await apiClient.delete(`/${recordId}`);
  return response.data;
}
