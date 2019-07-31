import * as io from "socket.io-client";

export interface SocketClientInterface {
  endpoint: string;
  hicID: string;
  userID: string;
  onConnected: () => any;
  emit: (ev, []) => any;
  close: () => any;
}

export class SocketClient implements SocketClientInterface {
  private connected = false;
  //@ts-ignore
  socket: SocketIOClient.Socket;
  constructor(
    readonly endpoint: string,
    readonly hicID: string,
    readonly userID: string,
    onMessage: (data: string) => any
  ) {
    //queryは"hicId"とする
    this.socket = io(`${endpoint}`, {
      query: {
        hicId: hicID
      }
    });

    this.socket.on("error", error => {
      if (this.connected) {
        console.error(error);
      }
    });

    this.socket.on("hic:message", (data: string) => {
        console.info(`onMessage : ${data}`);
      if (this.connected) {
        onMessage(data);
      } else {
        console.warn(`socket closed. message[${event}] was ignored`);
      }
    });

    if (this.socket.connected) {
      this.onConnected();
    } else {
      this.socket.on("connect", this.onConnected);
    }
  }

  bufferedEvents = [];

  onConnected = () => {
    console.info("connected");
    this.connected = true;

    let ev;
    while ((ev = this.bufferedEvents.shift())) {
        console.log(ev);
      this.emit(ev[0], ...ev[1]);
    }
  };

  emit(ev, ...args) {
    if (!this.connected) {
      this.bufferedEvents.push([ev, args]);
    } else {
      this.socket.emit(ev, ...args);
    }
  }

  close() {
    this.socket.close();
    this.connected = false;
    console.info("closed.");
  }
}

export const createSocketIOClient = (
  endpoint: string,
  roomID: string,
  userID: string,
  //onMessage: (message: LNQSocketMessage) => any
  onMessage: (message: string) => any
): SocketClientInterface => {
  return new SocketClient(endpoint, roomID, userID, onMessage);
};