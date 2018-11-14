/* eslint-env mocha */

import expect from "expect";
import middleware from "../src/";
import { createWebsocket } from "../src/utils/websocket";
import td from "testdouble";

// This does not exist in the Node env, but does in the browser
import WebSocket from "ws";
global.WebSocket = WebSocket;

class Socket {
  constructor(url) {
    this.url = url;
  }
}
describe("middleware", () => {
  it("should be a curried function that calls next(action)", () => {
    const action = {};
    const next = td.func("next");

    middleware()(next)(action);

    td.verify(next(action));
  });

  describe("createWebsocket", () => {
    it("should accept a default payload", () => {
      const payload = { url: "ws://localhost" };

      const ws = createWebsocket(payload);
      //expect(typeof ws).toBe(new WebSocket(payload.url));
      expect(ws.url).toEqual(payload.url);
    });

    // it("accepts an alternative WebSocket", () => {
    //   const ws = createWebsocket({ socket: Socket });
    //   expect(typeof ws).toBe(Socket);
    // });
  });
});
