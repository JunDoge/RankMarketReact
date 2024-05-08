import React, {createContext, useContext, useState, useRef} from 'react';
import { Client } from '@stomp/stompjs';
import axios from 'axios';
const ChatRoomContext = createContext();

export const ChatRoomProvider = ({ children }) => {
    const [rooms, setRooms] = useState([]);
    const client = useRef({});
    
    const addRoom = (roomName, roomId, userName, prd_id) => {
        const exists = rooms.find(room => room.roomId === roomId);
        if (exists) {

            return;
        }
    
        setRooms(prevRooms => [...prevRooms, { roomName, roomId, userName, messages: [], prd_id }]);

        client.current[roomId] = new Client({
            brokerURL: `ws://1.251.115.6:8089/mypage/chatroom/${roomId}`,
            onConnect: () => {
                console.log(`${roomId} 웹소켓 연결 성공`);
                subscribeToRoom(roomId);
            },
            onStompError: (frame) => {
                console.log('Broker reported error: ' + frame.headers['message']);
                console.log('Additional details: ' + frame.body);
            },
            onWebSocketClose: (event) => {
                console.log('웹소켓 연결 종료', event);
            },
            onWebSocketError: (event) => {
                console.log('웹소켓 에러', event);
            },
            connectHeaders: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`
            },
        });

        client.current[roomId].activate();
    };

    const removeRoom = (roomId) => {
        if (client.current[roomId]) {
            client.current[roomId].deactivate();
            delete client.current[roomId];
        }
    };

    const addMessage = (roomId, message) => {
        setRooms(prevRooms => {
            return prevRooms.map(room => {
                if (room.roomId !== roomId) {
                    return room;
                }
                return {
                    ...room,
                    messages: [...room.messages, message],
                };
            });
        });
    };

    const updateMessage = (roomId, message) => {
        setRooms(prevRooms => {
            return prevRooms.map(room => {
                if (room.roomId !== roomId) {
                    return room;
                }
                return {
                    ...room,
                    messages: [message,...room.messages],
                };
            });
        });
    };
    const sendWebSocketMessage = (roomId, message) => {
        const room = rooms.find(room => room.roomId === roomId);
        console.log(room)
        if (room) {
            const data = {
                chatId: room.roomId, // roomId를 chat_id로 변경
                usrId: room.userName, // sender를 usr_id로 변경
                msg: message, // message를 msg로 변경
                creDtm: new Date().toISOString(),
            };
            client.current[roomId].publish({destination: `/pub/mypage/chatroom/${roomId}`, body: JSON.stringify(data)});
        } else {
            console.error(`Room ${roomId} does not exist.`);
        }
    };

    const subscribeToRoom = (roomId) => {
        client.current[roomId].subscribe('/sub/chatroom/' + roomId, (message) => {
            console.log('Received message: ' + message.body);
            console.log('Received message: ' + message.body);
            const newMessage = JSON.parse(message.body);
            addMessage(roomId, newMessage);
        });
    };
    
    const addDelDtm = (prd_id,usr_id, dealDtm) =>{
        const param = new URLSearchParams()
        param.append('prdId', prd_id)
        param.append('usrId', usr_id)
        for(let item in dealDtm){
            console.log("key값",item)
            console.log("value값",dealDtm[item])
            param.append(item,dealDtm[item])
        }

        axios.post('/add/dealDtm',param,{
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`
            }
        }).catch(e=>console.log(e))
    }
    return (
        <ChatRoomContext.Provider value={{ rooms, addRoom, removeRoom, addMessage, updateMessage, sendWebSocketMessage, subscribeToRoom, addDelDtm }}>
            {children}
        </ChatRoomContext.Provider>
    );
};

export const useChatRoom = () => useContext(ChatRoomContext);
