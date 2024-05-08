import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChatRoom } from "./ChatRoomContext";
import "../../css/MyPage/ChatRoom.css";
import KakaoMap from "../../api/KakaoMap";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { ModalBody } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function ChatRoom() {
    const { roomId } = useParams();
    const {
        rooms,
        // addmessages,
        updateMessage,
        sendWebSocketMessage,
        addDelDtm
    } = useChatRoom();
    const [input, setInput] = useState("");
    const [showMap, setShowMap] = useState(false);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [addr, setAddr] = useState([]);
    const navigate = useNavigate();
    const ExternalLink = ({ children, to }) => (
        <Link to={to} target="_blank" rel="noopener noreferrer">
            {children}
        </Link>
    );
    const isLinkMessage = (message) => {
        return message.msg.startsWith('https://map.kakao.com/link/map/');
    };


    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    useEffect(() => {
        const room = rooms.find(room => room.roomId === roomId);
        if (room) {
            addmessages();
        }
    }, [roomId]);

    const addmessages = () => {
        console.log(roomId)
        axios.get('/add/chatroom/message', {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`
            },
            params: {
                pageNum: room.messages.length,
                chatId : roomId
            }
        }).then(r => {
            console.log(r.data.response)
            if (r.data.response.length === 0) {
                setHasMoreItems(false)
            }
            else {
                r.data.response.forEach((item) => {
                    updateMessage(item.chatId, item)
                })
            }
        }).catch(e => {
            // navigate('/error')
        });
    }

    const handleSendMessage = (message) => {
        if (input) {
            console.log(`roomId: ${roomId}, input: ${input}`);
            const room = rooms.find(room => room.roomId === roomId);
            if (room) {
                sendWebSocketMessage(roomId, input);
                console.log('Sent message: ' + input);
                setInput("");
                console.log(room, roomId, rooms);
            }
        }
        else if (message) {
            console.log(`roomId: ${roomId}, message: ${message}`);
            const room = rooms.find(room => room.roomId === roomId);
            console.log(room, roomId, rooms);
            if (room) {
                sendWebSocketMessage(roomId, message);
                console.log('Sent message: ' + message);
            }
        }
    };

    const handleMapToggle = (chatId) => {
        axios.get(`/address/chatroom/${chatId}`, {
            headers: {
                Authorization: `Bearer ${window.localStorage.getItem('token')}`
            }
        }).then(r => {
            console.log(r.data)
            setAddr(prevAddr => [...prevAddr, ...r.data.response])
            setShowMap((prevShowMap) => !prevShowMap);
        })
    };
    const room = rooms.find(room => room.roomId === roomId);
    if (!room) {
        return navigate('/mypage/chatroom')
    }

    return (
        <div className="chat-container">
            <p className='chatTitle'>{room.roomName}</p>
            <InfiniteScroll
                next={() => addmessages()}
                hasMore={hasMoreItems}
                loader="..."
                style={{ display: "flex", flexDirection: "column-reverse" }}
                inverse={true}
                scrollThreshold={50}
                height={500}
                dataLength={room.messages.length}
            >
                {room && Array.isArray(room.messages) &&
                    room.messages
                        .slice()
                        .reverse()
                        .map((message, index) => (
                            <div className={message.usrId === room.userName ? "chat ch2" : "chat ch1"} key={index}>
                                {isLinkMessage(message) ? (
                                    <p key={index} className="textbox">
                                        <ExternalLink className="textbox" to={message.msg}>
                                            {message.msg}
                                        </ExternalLink>
                                    </p>
                                ) : (
                                    <p key={index} className="textbox">
                                        {message.msg}
                                    </p>
                                )}
                            </div>
                        ))}
            </InfiniteScroll>
            <div>
                <InputGroup className="chat-input">
                    <Form.Control
                        value={input}
                        onChange={handleInputChange}
                        type="text"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage()
                            }
                        }}
                        placeholder="채팅 입력.."
                        aria-label="Recipient's username with two button addons"
                    />
                    <Button variant="outline-secondary" onClick={handleSendMessage}>보내기</Button>
                    <Button variant="outline-secondary" onClick={() => { handleMapToggle(room.roomId) }}>지도 보기</Button>
                </InputGroup>
            </div>
            <Modal size="xl" show={showMap} onHide={() => {
                setShowMap((prevShowMap) => !prevShowMap)
                setAddr([])
            }} centered>
                <Modal.Header>
                    <Modal.Title>위치를 클릭해주세요.</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <KakaoMap addr={addr} handleSendMessage={handleSendMessage} roomId={roomId} sendWebSocketMessage={sendWebSocketMessage} addDelDtm={addDelDtm} usrId={room.userName} />
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default ChatRoom;

