import jwt from "jsonwebtoken";

// Sign custom JWT session token
export function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "default_jwt_secret_32_chars_or_more", {
    expiresIn: "7d",
  });
}

// Verify custom JWT session token
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "default_jwt_secret_32_chars_or_more");
  } catch {
    return null;
  }
}

// Verify a user is an admin by matching against ADMIN_EMAILS env variable
export function isAdminEmail(email) {
  if (!email) return false;
  const adminEmailsStr = process.env.ADMIN_EMAILS || "musamusakannike@gmail.com";
  const adminEmails = adminEmailsStr.split(",").map((e) => e.trim().toLowerCase());
  return adminEmails.includes(email.toLowerCase());
}

// Parse custom JWT session token from request cookies
export function getSessionUser(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => c.trim().split("="))
  );
  const token = cookies["auth_token"];
  if (!token) return null;
  return verifyToken(token);
}

// Verify Firebase Google ID token directly using Google's public certificates
export async function verifyFirebaseIdToken(idToken) {
  try {
    if (!idToken) return null;

    // 1. Decode token to find Key ID (kid)
    const decoded = jwt.decode(idToken, { complete: true });
    if (!decoded || !decoded.header || !decoded.header.kid) {
      throw new Error("Invalid Google/Firebase ID Token structure");
    }

    const { kid } = decoded.header;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

    if (!projectId) {
      throw new Error("NEXT_PUBLIC_FIREBASE_PROJECT_ID is not configured");
    }

    // 2. Fetch Google's public certs
    const certsRes = await fetch(
      "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
    );
    if (!certsRes.ok) {
      throw new Error("Failed to fetch Google public certificates");
    }
    const certs = await certsRes.json();

    // 3. Find certificate for the kid
    const pubKey = certs[kid];
    if (!pubKey) {
      throw new Error("Corresponding public certificate not found for kid");
    }

    // 4. Verify token using Google public cert
    const verified = jwt.verify(idToken, pubKey, {
      algorithms: ["RS256"],
      audience: projectId,
      issuer: `https://securetoken.google.com/${projectId}`,
    });

    return verified;
  } catch (error) {
    console.error("Firebase ID Token verification failed:", error);
    return null;
  }
}
