import { fetchAllRecords, createRecord } from "./CoreAPI";

async function generateSHA256Hash(text) {
  const encodedText = new TextEncoder().encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", encodedText);
  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function generateSalt(length = 16) {
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

export async function registerUser({ email, password, displayName }) {
  const normalizedEmail = email.trim().toLowerCase();
  const allRecords = await fetchAllRecords();
  const existingUsers = allRecords.filter(
    (record) => record.data_json?.type === "user"
  );

  const isEmailTaken = existingUsers.some(
    (userRecord) => userRecord.data_json.email === normalizedEmail
  );
  if (isEmailTaken) throw new Error("That email is already registered.");

  const salt = generateSalt();
  const hashedPassword = await generateSHA256Hash(salt + password);

  await createRecord({
    type: "user",
    email: normalizedEmail,
    displayName: displayName || normalizedEmail,
    salt,
    passwordHash: hashedPassword,
    createdAt: Date.now(),
  });

  const sessionToken = btoa(`${normalizedEmail}|${Date.now()}`);
  localStorage.setItem("session_token", sessionToken);
  localStorage.setItem(
    "current_user",
    JSON.stringify({ email: normalizedEmail, displayName })
  );
}

export async function loginUser({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const allRecords = await fetchAllRecords();
  const existingUsers = allRecords.filter(
    (record) => record.data_json?.type === "user"
  );

  const matchingUser = existingUsers.find(
    (record) => record.data_json.email === normalizedEmail
  );
  if (!matchingUser) throw new Error("Invalid email or password.");

  const expectedHash = await generateSHA256Hash(
    matchingUser.data_json.salt + password
  );
  if (expectedHash !== matchingUser.data_json.passwordHash)
    throw new Error("Invalid email or password.");

  const sessionToken = btoa(`${normalizedEmail}|${Date.now()}`);
  localStorage.setItem("session_token", sessionToken);
  localStorage.setItem(
    "current_user",
    JSON.stringify({
      email: normalizedEmail,
      displayName: matchingUser.data_json.displayName,
    })
  );
}

export function logoutUser() {
  localStorage.removeItem("session_token");
  localStorage.removeItem("current_user");
}

export function getCurrentUser() {
  const storedUser = localStorage.getItem("current_user");
  return storedUser ? JSON.parse(storedUser) : null;
}
