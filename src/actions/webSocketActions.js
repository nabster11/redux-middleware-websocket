import * as webSocketActionTypes from "../constants/webSocketConstants";

export const connect_initiate = () => ({
  type: webSocketActionTypes.CONNECT
});

export const connected = status => ({
  type: webSocketActionTypes.CONNECTED,
  status
});

export const connecting = status => ({
  type: webSocketActionTypes.CONNECTING,
  status
});

export const disconnected = status => ({
  type: webSocketActionTypes.DISCONNECTED,
  status
});

export const disconect_initiate = () => ({
  type: webSocketActionTypes.DISCONNECT
});

export const webSocketErrorHandling = reason => ({
  type: webSocketActionTypes.WEBSOCKETERROR,
  status: reason
});

export const webSocketMessage = (message) => ({
  type: WEBSOCKET_MESSAGE,
  payload: {
    timestamp: new Date(),
    data: message.data,
    message
  }
});
