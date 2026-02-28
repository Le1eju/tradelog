const STORAGE_KEY = "tradelog-data";

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    trades: [],
    initialBalance: 1000,
  };
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export function generateId() {
  return Math.random().toString(36).slice(2, 10);
}
