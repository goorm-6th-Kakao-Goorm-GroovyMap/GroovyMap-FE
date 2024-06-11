import React from 'react';
import SockJS from 'sockjs-client';
import StompJs from '@stomp/stompjs';

const ChatWindow = async () => {
    const client = new StompJs.Client({
        brokerURL: '',
        connectHeaders: {},
    });
};

export default ChatWindow;
