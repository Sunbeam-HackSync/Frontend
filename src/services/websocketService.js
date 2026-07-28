// src/services/websocketService.js
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
    constructor() {
        this.client = null;
        this.isConnected = false;
        this.subscriptions = new Map();
        // Since we are using standard Vite proxy or accessing directly:
        // Adjust the base URL depending on environment, assuming backend is on 8080 usually.
        // If API calls use proxy, we can just use the current origin or API base.
        // For local development, usually http://localhost:8080/ws
        this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    }

    connect(onConnected, onError) {
        if (this.client && this.client.active) {
            if (onConnected) onConnected();
            return;
        }

        const socketUrl = `${this.baseUrl}/ws`;

        this.client = new Client({
            webSocketFactory: () => new SockJS(socketUrl),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                this.isConnected = true;
                console.log('Connected to WebSocket');
                if (onConnected) onConnected();
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
                if (onError) onError(frame);
            },
            onWebSocketClose: () => {
                this.isConnected = false;
                console.log('WebSocket connection closed');
            }
        });

        // Add authentication headers if needed (Token)
        const token = localStorage.getItem('token');
        if (token) {
            this.client.connectHeaders = {
                Authorization: `Bearer ${token}`
            };
        }

        this.client.activate();
    }

    disconnect() {
        if (this.client !== null) {
            this.client.deactivate();
            this.isConnected = false;
            this.subscriptions.clear();
            console.log("Disconnected from WebSocket");
        }
    }

    subscribe(topic, callback) {
        if (!this.client || !this.client.connected) {
            console.warn("WebSocket is not connected. Cannot subscribe to", topic);
            return null;
        }
        
        // Unsubscribe if already subscribed to prevent duplicates
        if (this.subscriptions.has(topic)) {
            this.subscriptions.get(topic).unsubscribe();
        }

        const subscription = this.client.subscribe(topic, (message) => {
            if (message.body) {
                try {
                    const parsed = JSON.parse(message.body);
                    callback(parsed);
                } catch (e) {
                    callback(message.body);
                }
            }
        });

        this.subscriptions.set(topic, subscription);
        return subscription;
    }

    unsubscribe(topic) {
        if (this.subscriptions.has(topic)) {
            this.subscriptions.get(topic).unsubscribe();
            this.subscriptions.delete(topic);
        }
    }

    sendMessage(destination, body) {
        if (this.client && this.client.connected) {
            this.client.publish({
                destination: destination,
                body: JSON.stringify(body)
            });
        } else {
            console.warn("WebSocket is not connected. Cannot send message to", destination);
        }
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
