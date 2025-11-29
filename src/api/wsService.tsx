interface WSMessage {
  type: "init" | "update_code";
  code: string;
}

export const wsService = {
  connectRoom: (roomId: string): WebSocket => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    return ws;
  },
};
