const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

function getStorage<T>(key: string): T[] {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setStorage<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

export const api = {
  get: async (endpoint: string) => {
    await delay(100);
    return { data: getStorage(endpoint) };
  },
  post: async (endpoint: string, item: any) => {
    await delay(100);
    const data = getStorage<any>(endpoint);
    const newItem = { ...item, id: crypto.randomUUID() };
    data.push(newItem);
    setStorage(endpoint, data);
    return { data: newItem };
  },
  put: async (endpoint: string, id: string, item: any) => {
    await delay(100);
    let data = getStorage<any>(endpoint);
    data = data.map((d) => (d.id === id ? { ...item, id } : d));
    setStorage(endpoint, data);
    return { data: item };
  },
  delete: async (endpoint: string, id: string) => {
    await delay(100);
    let data = getStorage<any>(endpoint);
    data = data.filter((d) => d.id !== id);
    setStorage(endpoint, data);
  },
};
