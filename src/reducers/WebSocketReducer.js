import { initialWebSocketState } from "../constants/initialWebSocketState";
import * as ActionConstants from "../constants/WebSocketConstants";

export function WebSocketStates(state = initialWebSocketState, action = {}) {
  switch (action.type) {
    case ActionConstants.CONNECTED:
      return Object.assign({}, state, { status: action.status });
    case ActionConstants.CONNECTING:
      return Object.assign({}, state, { status: action.status });
    case ActionConstants.DISCONNECTED:
      return Object.assign({}, state, { status: action.status });
    case ActionConstants.WEBSOCKETERROR:
      return Object.assign({}, state, { status: action.status });
    default:
      return state;
  }
}
