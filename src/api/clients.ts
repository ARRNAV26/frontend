const apiBaseUrl = "http://localhost:8000";

export const api = {
  get: (path: string) =>
    fetch(`${apiBaseUrl}${path}`).then(res => res.json()),

  post: (path: string, body: any) =>
    fetch(`${apiBaseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(res => res.json()),

  ws: (path: string) => new WebSocket(`ws://localhost:8000${path}`),
};