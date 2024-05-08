import SockJs from "sockjs-client";
import StompJs from "stompjs";

let roomId = '특정 채팅방 ID';
let sender_nick = '현재 사용자의 닉네임';
let message = '보낼 메시지';
let now = new Date(); // 현재 시간

const sock = new SockJs(`http://localhost:3000/mypage/chatroom/${roomId}`);
const stomp = StompJs.over(sock);

let currentUser = '현재 로그인한 사용자';
const token = localStorage.getItem("token")
const stompConnect = () => {
    try {
        stomp.debug = null;
        stomp.connect(token, () => {
            stomp.subscribe(
                `localhost:8089`,
                (data) => {
                    const newMessage = JSON.parse(data.body);
                    if (newMessage.sender === currentUser) {
                        console.log(`나: ${newMessage.message}`);
                    } else {
                        console.log(`${newMessage.sender}: ${newMessage.message}`);
                    }
                },
                token
            );
        });
    } catch (err) {
        console.error('웹소켓 에러:', err);
    }
};

const stompDisConnect = () => {
    try {
        stomp.debug = null;
        stomp.disconnect(() => {
            stomp.unsubscribe("sub-0");
        }, token);
    } catch (err) {
        console.error('웹소켓 에러:', err);
    }
};

const SendMessage = () => {
    stomp.debug = null;
    const data = {
        type: "TALK",
        roomId: roomId,
        sender: sender_nick,
        message: message,
        createdAt: now,
    };
    stomp.send("/pub/chat/message", token, JSON.stringify(data));
};
