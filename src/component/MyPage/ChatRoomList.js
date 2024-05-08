import React, {useState ,useEffect} from 'react';
import {Link, useLocation, useNavigate, useRoutes} from 'react-router-dom';
import {useChatRoom} from './ChatRoomContext';
import ChatRoom from './ChatRoom';
import '../../css/MyPage/ChatRoomList.css';
import axios from 'axios';

function ChatLink({ to, children }) {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link to={to} className={`chat-nav-link ${isActive ? 'chat-action' : ''}`}>
            {children}
        </Link>
    );
}

function ChatRoomList() {
    const navigate = useNavigate()
    const { rooms, addRoom } = useChatRoom();
    const [isChatVisible, setIsChatVisible] = useState(true);
    const [isTitleVisible, setIsTitleVisible] = useState(true); // 추가된 부분

    useEffect(() => {
        axios.get('/chatroom',{
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem("token")}`,
            }
        }).then(r => {
            console.log(r.data)
            const usr_id = r.data.response.usrId;
            const item = r.data.response.chatDto;
            item.forEach((item) => addRoom(item.prdTitle, item.chatId, usr_id,item.prdId));
        }).catch(e =>{
            navigate('/error')
        })
        
    }, []);
    useEffect(() => {
        if(!isChatVisible){
            setIsTitleVisible(false);
        }else{
            setTimeout(() => {setIsTitleVisible(true);}, 500);
        }
    }, [isChatVisible]);


    const chatRoomRoute = useRoutes([
        {
            path: "/:roomId", // 수정된 부분
            element: <ChatRoom />
        }
    ]);

    return (
        <div className="chat-room-list">
            <div className={`chat-nav-div ${isChatVisible ? '' : 'slide-out'}`}>
                <p className={`chatTitle ${isTitleVisible ? '' : 'hide'}`}>메세지</p>
                <div className="borderBottom">{' '}</div>
                <button
                    className={`chatroom-toggle ${isChatVisible ? 'right' : 'left'}`}
                    onClick={() => {
                        setIsChatVisible(!isChatVisible);
                    }}
                ></button>
                {rooms.map((room, index) => (
                    <ChatLink key={index} to={`/mypage/chatroom/${encodeURIComponent(room.roomId)}`}>{room.roomName}</ChatLink>
                ))}
            </div>
            <div className="chat-room-route">
                {chatRoomRoute}
            </div>
        </div>
    );
}

export default ChatRoomList;
