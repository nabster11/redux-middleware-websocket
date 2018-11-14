import * as actions from "./actions/webSocketActions";
import * as WebSocketConstants from "./constants/webSocketConstants";
import { getProtocol } from "./utils";
import { websocketProperties } from "./constants/properties";

import { createWebsocket } from "./utils/websocket";

// const websocketUrl = `${getProtocol() + websocketProperties.hostname}/${
//   websocketProperties.client
// }`;

let attempts = 1;

const generateInterval = k => Math.min(30, Math.pow(2, k) - 1) * 1000;

const webSocketMiddleware = (function() {
  let socket = null;

  const onOpen = (ws, store) => evt => {
    // Send a handshake, or authenticate with remote end

    // reset the tries back to 1 since we have a new connection opened.
    attempts = 1;

    // Tell the store we're connected
    store.dispatch(actions.connected(WebSocketConstants.CONNECTED));
  };

  const onClose = (ws, store) => event => {
    // Tell the store we've disconnected.
    store.dispatch(actions.disconnected(WebSocketConstants.DISCONNECTED));

    // Reconnection Attempt
    console.log("close event code", event.code);
    if (event.code == 1006) {
      console.log("abnormal close event, destroying connection");
      store.dispatch(actions.disconect_initiate()); // just in case no close frame was sent.
    }

    if (event.code == 1011) {
      console.log("Runtime exception detected");
      store.dispatch(actions.disconect_initiate());
      return;
    }

    /* 
    generate random intervals (<= 30s) for reconnection attempts to
    avoid flooding the server.
    */
    const time = generateInterval(attempts);
    setTimeout(() => {
      console.log("Reconnection attempt", attempts);
      attempts++;
      store.dispatch(actions.connect_initiate());
    }, time);
  };

  const onMessage = (ws, store) => message => {
    store.dispatch(actions.webSocketMessage(message));
  };

  const onError = (socket, store) => evt => {
    // could have sent evt.data in the reason.
    const reason = "ERROR";
    console.log(evt);
    store.dispatch(actions.webSocketErrorHandling(reason));
  };

  // useful to wait for socket connection before sending the message
  // this will have syncronization issues and doesnt guarentee message delivery in order
  // need to find a better way of implementation using callbacks or promise
  const sendToSocket = message => {
    if (_.isNull(socket) || socket.readyState !== 1) {
      setTimeout(() => sendToSocket(message), 100);
    } else socket.send(message);
  };

  return store => next => action => {
    switch (action.type) {
      // The user wants us to connect
      case WebSocketConstants.CONNECT:
        // Start a new connection to the server
        if (socket != null) {
          socket.close();
        }

        // Send an action that shows a "connecting..." status for now
        store.dispatch(
          actions.connecting(
            `${WebSocketConstants.CONNECTING} Attempt: ${attempts}`
          )
        );

        // Attempt to connect (we could send a 'failed' action on error)
        socket = createWebsocket(action.payload);

        socket.onmessage = onMessage(socket, store);
        socket.onclose = onClose(socket, store);
        socket.onopen = onOpen(socket, store);
        socket.onerror = onError(socket, store);

        break;

      // The user wants us to disconnect
      case WebSocketConstants.DISCONNECT:
        if (socket != null) {
          socket.close();
        }
        socket = null;
        break;

      // This action is irrelevant to us, pass it on to the next middleware
      default:
        return next(action);
    }
  };
})();

export default webSocketMiddleware;
