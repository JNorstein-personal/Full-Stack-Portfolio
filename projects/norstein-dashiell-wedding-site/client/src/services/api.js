const configuredApiBasePath =
  import.meta.env.VITE_API_BASE_PATH || "/wedding/api";

const API_BASE_PATH =
  configuredApiBasePath.replace(/\/+$/, "");

if (!API_BASE_PATH.startsWith("/")) {
  throw new Error(
    "VITE_API_BASE_PATH must be a same-origin path beginning with '/'.",
  );
}

function buildApiUrl(path = "") {
  if (!path) {
    return API_BASE_PATH;
  }

  const normalizedPath =
    path.startsWith("/") ? path : `/${path}`;

  return `${API_BASE_PATH}${normalizedPath}`;
}

export async function apiRequest(
  path,
  options = {},
) {
  const response = await fetch(
    buildApiUrl(path),
    {
      ...options,

      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    },
  );

  const contentType =
    response.headers.get("content-type") || "";

  const payload =
    contentType.includes("application/json")
      ? await response.json()
      : await response.text();

  if (!response.ok) {
    const error = new Error(
      `API request failed with status ${response.status}.`,
    );

    error.status = response.status;
    error.payload = payload;

    throw error;
  }

  return payload;
}

export function getApiHealth() {
  return apiRequest("/health");
}

export {
  API_BASE_PATH,
  buildApiUrl,
};