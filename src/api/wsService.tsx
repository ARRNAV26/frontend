import { API_CONFIG } from '../config/apiConfig';

export const wsService = {
  connectRoom: (roomId: string): WebSocket => {
    const ws = new WebSocket(`${API_CONFIG.wsURL}/${roomId}`);
    return ws;
  },
};
