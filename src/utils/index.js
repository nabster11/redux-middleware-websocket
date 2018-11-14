export function getProtocol() {
    return window.location.protocol === "https:" ? "wss://" : "ws://";
  }
  