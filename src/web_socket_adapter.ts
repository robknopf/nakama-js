/**
 * Copyright 2020 The Nakama Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * An interface used by Nakama's web socket to determine the payload protocol. 
 */
export interface WebSocketAdapter {
    
    /**
     * Dispatched when the web socket closes.
     */
    onClose : SocketCloseHandler | null;

    /**
     * Dispatched when the web socket receives an error.
     */
    onError : SocketErrorHandler | null;

    /**
     * Dispatched when the web socket receives a normal message.
     */
    onMessage : SocketMessageHandler | null;

    /**
     * Dispatched when the web socket opens.
     */
    onOpen : SocketOpenHandler | null;

    readonly isConnected: boolean;
    close() : void;
    connect(scheme: string, host: string, port : string, createStatus: boolean, token : string) : void;
    send(msg : any) : void;
}

export interface SocketCloseHandler {
    (this : WebSocket, evt: CloseEvent): void;
}

export interface SocketErrorHandler {
    (this : WebSocket, evt: Event): void;
}

export interface SocketMessageHandler {
    (message: any): void;
}

export interface SocketOpenHandler {
    (this : WebSocket, evt : Event) : void
}

/**
 * A text-based socket adapter that accepts and transmits payloads over UTF-8.
 */
export class WebSocketAdapterText implements WebSocketAdapter {

    private _isConnected: boolean = false;

    private _socket?: WebSocket;

    get onClose(): SocketCloseHandler | null {
        return this._socket!.onclose;
    }

    set onClose(value: SocketCloseHandler | null) {
        this._socket!.onclose = value;
    }

    get onError(): SocketErrorHandler | null {
        return this._socket!.onerror;
    }

    set onError(value: SocketErrorHandler | null) {
        this._socket!.onerror = value;
    }

    get onMessage(): SocketMessageHandler | null {
        return this._socket!.onmessage;
    }

    set onMessage(value: SocketMessageHandler | null) {

        if (value) {
            this._socket!.onmessage = (evt: MessageEvent) => {
                const message: any = JSON.parse(evt.data);                
                value!(message);
            };
        }
        else {
            value = null;
        }
    }

    get onOpen(): SocketOpenHandler | null {
        return this._socket!.onopen;
    }

    set onOpen(value: SocketOpenHandler | null) {
        this._socket!.onopen = value;
    }

    get isConnected(): boolean {
        return this._isConnected;
    }

    connect(scheme: string, host: string, port: string, createStatus: boolean, token: string): void {
        const url = `${scheme}${host}:${port}/ws?lang=en&status=${encodeURIComponent(createStatus.toString())}&token=${encodeURIComponent(token)}`;
        this._socket = new WebSocket(url);
        this._isConnected = true;
    }

    close() {
        this._isConnected = false;
        this._socket!.close();
        this._socket = undefined;
    }

    send(msg: any): void {
        if (msg.match_data_send)
        {
            // TODO document why this is necessary, if at all.
            msg.match_data_send.op_code = msg.match_data_send.op_code.toString();
        }
        
        this._socket!.send(JSON.stringify(msg));
    }
}