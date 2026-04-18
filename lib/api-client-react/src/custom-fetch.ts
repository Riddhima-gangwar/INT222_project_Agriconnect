export type AuthTokenGetter = () => string | null | Promise<string | null>;
export type ErrorType<T> = T;
export type BodyType<T> = T;

let baseUrl = "http://localhost:5001";
let authTokenGetter: AuthTokenGetter | null = null;

export function setBaseUrl(url: string) {
  baseUrl = url;
}

export function setAuthTokenGetter(getter: AuthTokenGetter) {
  authTokenGetter = getter;
}

export async function customFetch<T = any>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const token = authTokenGetter ? await authTokenGetter() : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options?.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  if (response.status === 304) {
    // 304 Not Modified has no body, return empty array for list endpoints
    return [] as T;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}
