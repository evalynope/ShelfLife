import axios from "axios";

// --- CONFIGURATION ---
const API_BASE_URL = "https://unit-4-project-app-24d5eea30b23.herokuapp.com/";
const TEAM_ID = 1;

// --- AXIOS CLIENT ---
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  params: { teamId: TEAM_ID }, // Heroku expects capital I
  headers: { "Content-Type": "application/json" },
});

// --- NORMALIZATION / UTILITIES ---
function unwrapResponse(response) {
  return response?.data?.response ?? [];
}

export function logApiDefaults() {
  console.log("API Base URL:", apiClient.defaults.baseURL);
  console.log("Default Params:", apiClient.defaults.params);
}

// --- CRUD HELPERS (Heroku endpoints) ---

/**
 * Fetch all records for the team.
 * GET /get/all?teamId=1
 */
export async function fetchAllRecords() {
  try {
    const res = await apiClient.get("/get/all", {
      params: { teamId: TEAM_ID },
    });
    return unwrapResponse(res);
  } catch (error) {
    console.error("❌ fetchAllRecords failed:", error.message);
    throw error;
  }
}

/**
 * Create a new record.
 * POST /post/data
 * Body: { team: 1, body: { ...data_json } }
 */
export async function createRecord(dataPayload) {
  try {
    const res = await apiClient.post("/post/data", {
      team: TEAM_ID,
      body: dataPayload,
    });
    return unwrapResponse(res);
  } catch (error) {
    console.error("❌ createRecord failed:", error.message);
    throw error;
  }
}

/**
 * Update an existing record by ID.
 * POST /update/data?teamId=1&recordId=<id>
 * Body: { ...fieldsToUpdate }
 */
export async function updateRecord(recordId, updatedPayload) {
  try {
    const res = await apiClient.post("/update/data", updatedPayload, {
      params: { teamId: TEAM_ID, recordId },
    });
    return unwrapResponse(res);
  } catch (error) {
    console.error("❌ updateRecord failed:", error.message);
    throw error;
  }
}

/**
 * Delete a record by ID.
 * POST /delete/data
 * Body: { id: <recordId>, team: 1 }
 */
export async function deleteRecord(recordId) {
  try {
    const res = await apiClient.post("/delete/data", {
      id: recordId,
      team: TEAM_ID,
    });
    return res?.data ?? { id: recordId };
  } catch (error) {
    console.error("❌ deleteRecord failed:", error.message);
    throw error;
  }
}

/**
 * Ping the API to confirm connectivity.
 */
export async function pingApi() {
  try {
    const res = await apiClient.get("/get/all", { params: { teamId: TEAM_ID } });
    console.log("✅ Ping successful:", (res.data?.response || []).length, "records found");
  } catch (error) {
    console.error("❌ API Ping failed:", error.message);
  }
}
