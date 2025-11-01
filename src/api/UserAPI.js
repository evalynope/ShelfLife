import { fetchAllRecords, createRecord } from "./CoreAPI";

// --- Utility functions for secure password hashing ---
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

// --- Register a new user ---
export async function registerUser({ email, password, displayName }) {
  const normalizedEmail = email.trim().toLowerCase();

  // Fetch all existing user records
  const allRecords = await fetchAllRecords();
  const existingUsers = allRecords.filter(
    (record) => record.data_json?.type === "user"
  );

  // Check if email already exists
  const isEmailTaken = existingUsers.some(
    (userRecord) => userRecord.data_json.email === normalizedEmail
  );
  if (isEmailTaken) throw new Error("That email is already registered.");

  // Generate secure salt and hash
  const salt = generateSalt();
  const hashedPassword = await generateSHA256Hash(salt + password);

  // Create user record on Heroku

const formattedDisplayName = displayName
  ? displayName
      .trim()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  : normalizedEmail;

await createRecord({
  type: "user",
  email: normalizedEmail,
  displayName: formattedDisplayName,
  salt,
  passwordHash: hashedPassword,
  createdAt: Date.now(),
});
 
  // Save session locally (include true Heroku record id)
  const sessionToken = btoa(`${normalizedEmail}|${Date.now()}`);
  localStorage.setItem("session_token", sessionToken);
  localStorage.setItem(
    "current_user",
    JSON.stringify({
      email: normalizedEmail,
      displayName: displayName || normalizedEmail,
    })
  );
}

// --- Login existing user ---
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

  // Validate password hash
  const expectedHash = await generateSHA256Hash(
    matchingUser.data_json.salt + password
  );
  if (expectedHash !== matchingUser.data_json.passwordHash)
    throw new Error("Invalid email or password.");

  // Save the *actual* displayName from the Heroku record
  const userData = {
    email: normalizedEmail,
    displayName: matchingUser.data_json.displayName,
  };

  const sessionToken = btoa(`${normalizedEmail}|${Date.now()}`);
  localStorage.setItem("session_token", sessionToken);
  localStorage.setItem("current_user", JSON.stringify(userData));

  // ✅ Return the user data so your components can update immediately
  return userData;
}

// --- Logout current user ---
export function logoutUser() {
  localStorage.removeItem("session_token");
  localStorage.removeItem("current_user");
}

// --- Get logged in user from local storage ---
export function getCurrentUser() {
  try {
    const storedUser = localStorage.getItem("current_user");
    if (!storedUser) return null;
    const user = JSON.parse(storedUser);
    if (!user || !user.email) return null;
    return user;
  } catch (err) {
    console.warn("Error reading current_user:", err);
    return null;
  }
}


