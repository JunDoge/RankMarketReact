// MyPage.js
import React, { useEffect, useState } from 'react';
import {Route, Routes, useNavigate} from 'react-router-dom';
import {ChatRoomProvider} from './ChatRoomContext';
import Sidebar from "./Sidebar";
import UsrUpdate from "./UsrUpdate";
import WishList from "./WishList";
import PrdMgmt from "./PrdMgmt";
import Transactions from "./Transactions";
import Pay from "./Pay";
import '../../css/MyPage/MyPage.css';
import ChatRoomList from "./ChatRoomList";
import Opinion from "./Opinion";
import ProductUpdate from "../Products/ProductUpdate";

function MyPage({setIsLoggedIn}) {
    const navigate = useNavigate()
    useEffect(
        ()=>{
            if(window.localStorage.getItem('token') === null){
                navigate('/')
            }
        }
    )

    const [usrNm , setUsrNm] = useState(window.localStorage.getItem('usrNm'))
    return (
        <ChatRoomProvider>
            <div className="flex-container">
                <div className="sidebar">
                    <Sidebar usrNm={usrNm}/>
                </div>
                <div className="main-content">
                    <Routes>
                        <Route path="usrUpdate" element={<UsrUpdate setUsrNm={setUsrNm} setIsLoggedIn={setIsLoggedIn}/>} />
                        <Route path="wishlist" element={<WishList />} />
                        <Route path="prdmgmt" element={<PrdMgmt />} />
                        <Route path="productUpdate" element={<ProductUpdate />} />
                        <Route path="transactions/*" element={<Transactions />} />
                        <Route path="chatroom/*" element={<ChatRoomList />} />
                        <Route path="pay" element={<Pay />} />
                        <Route path="opinion/*" element={<Opinion />} />
                    </Routes>
                </div>
            </div>
        </ChatRoomProvider>
    );
}

export default MyPage;
