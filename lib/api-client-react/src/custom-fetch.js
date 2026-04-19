let baseUrl = typeof window !== "undefined" && window.location.hostname !== "localhost"
  ? ""
  : "http://localhost:5001";
let authTokenGetter = null;

export function setBaseUrl(url) {
  baseUrl = url;
}

export function setAuthTokenGetter(getter) {
  authTokenGetter = getter;
}

export async function customFetch(url, options) {
  const token = authTokenGetter ? await authTokenGetter() : null;

  const headers = {
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
    return [];
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
