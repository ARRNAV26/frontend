export const wsService = {
  connectRoom: (roomId: string): WebSocket => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    return ws;
  },
};
