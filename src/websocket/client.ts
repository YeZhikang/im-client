import EventEmitter from "eventemitter3";
import Socket from "./socket";

export class Client {
    readonly eventbus = new EventEmitter();
    private socket: Socket;

    constructor(url) {
        this.socket = new Socket(this.eventbus, url);
        // this.socket.connect();
    }

    sendMessage(packet){
        this.socket.sendMessage(packet);
    }

    connect(){
        this.socket.connect();
    }
}