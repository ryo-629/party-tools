function saveLS(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function loadLS(key, fallback) {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}
