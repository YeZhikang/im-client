import React, {useMemo} from 'react';
import {Client} from "../websocket/client";

export const MessageContext = React.createContext<null | IMessageService>(null);


interface IMessageService {
    sendMessage(type, message): void;

    socket: Client;

    connect(): void;
}


class MessageService implements IMessageService {
    readonly socket: Client;

    constructor(url) {
        this.socket = new Client(url);
    };

    sendMessage(type, message) {
        debugger;
        this.socket.sendMessage({
            type,
            message
        })
    }

    connect(){
        this.socket.connect()
    }
}

export const MessageProvider = ({children}) => {
    const messageService = useMemo(() => new MessageService('ws://localhost:3008'), []);

    return (
        <MessageContext.Provider value={messageService}>
            {children}
        </MessageContext.Provider>
    )
}

