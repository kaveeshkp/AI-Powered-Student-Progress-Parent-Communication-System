export function decodeJwt(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
