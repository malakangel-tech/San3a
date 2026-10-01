
const API_URL = import.meta.env.VITE_API_URL;

console.log("API_URL =", API_URL);

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  // إذا الطلب ليس FormData، نرسله كـJSON
  // أما FormData فلا نضع Content-Type يدويًا،
  // لأن المتصفح يضيف multipart/form-data + boundary تلقائيًا.
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      "Something went wrong"
    );
  }

  return data;
}
