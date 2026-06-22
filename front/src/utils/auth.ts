export default async function getRole(): Promise<string | null> {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const response = await fetch("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) {
      if (response.status === 401) localStorage.removeItem("token");
      return null;
    }
    const data = await response.json();
    return data.role ?? null;
  } catch {
    return null;
  }
}
