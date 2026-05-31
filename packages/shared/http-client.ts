export function assertResponseOk(response: Response, label: string): void {
  if (!response.ok) throw new Error(`Failed to fetch ${label}: ${response.status}`);
}

function logApiFallback(scope: string, error: unknown): void {
  console.warn(`[${scope}] Using mock data — API unavailable`, error);
}

export function recoverWithMock<T>(scope: string, error: unknown, fallback: T): T {
  logApiFallback(scope, error);
  return fallback;
}

export async function httpJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  assertResponseOk(response, url);
  return response.json() as Promise<T>;
}
