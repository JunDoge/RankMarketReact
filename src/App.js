import React, {useState,useEffect} from "react";
import {Route, Routes, useLocation,useNavigate} from "react-router-dom";
import {Modal} from 'react-bootstrap'
import Main from "./component/Main/Main";
import KaKaoLogin from "./component/SocialLogin/KaKaoLogin";
import KakaoCode from "./api/KakaoCode";
import SingUp from "./component/SocialLogin/SignUp";
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";
import Products from "./component/Products/Products";
import Error from "./component/Error";
import NaverCode from "./api/NaverCode";
import GoogleCode from "./api/GoogleCode";
import ProductAdd from "./component/Products/ProductAdd";
import ProductDetail from "./component/Products/ProductDetail";
import MyPage from "./component/MyPage/MyPage";
import Test from "./test";
import KakaoMap from "./api/KakaoMap";
import axios from "axios";
import success from "./component/PaySuccess";
import PaySuccess from "./component/PaySuccess";
import { ModalBody } from "react-bootstrap";

function App() {
    const location = useLocation();
    const pathName = location.pathname;
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const navigate = useNavigate();
    useEffect(() => {
        setIsLoggedIn(!!window.localStorage.getItem("token"));
    }, []);
    // useEffect(() => {
    //     const handleBeforeUnload = (e) => {
    //         setShowModal(true)
    //         e.preventDefault();
    //         e.returnValue = "";
    //     };
    //     window.addEventListener("beforeunload", handleBeforeUnload);
    
    //     return () => {
    //         window.removeEventListener("beforeunload", handleBeforeUnload);
    //     };
    // }, []);
    useEffect(() => {
        const timer = setInterval(() => {
            axios.post('/reload/accessToken',null,{
                headers:{
                    'Authorization': `Bearer ${window.localStorage.getItem("token")}`
                }
            }).then(r=> {
                const token = r.headers['authorization'];
                localStorage.setItem('token', token);
                console.log(localStorage.getItem('token'))
             }).catch(()=>{

                setIsLoggedIn(false);
                localStorage.removeItem("token");
            
            navigate('/')
             })
         }, 1200000);
        return () => {
            clearInterval(timer);
        };
    }, [window.localStorage.getItem('token'),isLoggedIn]);
    return (
        <>
            {pathName !== '/singup' && pathName !== '/error' && pathName !== '/success' && <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/singup" element={<SingUp setIsLoggedIn={setIsLoggedIn}/>} />
                <Route exact path='/kakao' element={<KakaoCode setIsLoggedIn={setIsLoggedIn} />} />
                <Route exact path='/naver' element={<NaverCode setIsLoggedIn={setIsLoggedIn} />} />
                <Route exact path='/google' element={<GoogleCode setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<Products />} />
                <Route path="/product/detail/:id" element={<ProductDetail />} />
                <Route path="/productAdd" element={<ProductAdd />} />
                <Route path="/mypage/*" element={<MyPage setIsLoggedIn={setIsLoggedIn}/>} />
                <Route path="/error" element={<Error setIsLoggedIn={setIsLoggedIn} />} />
                <Route path="/*" element={<Error />} />
                <Route path="/test" element={<Test />} />
                <Route path="/main/map" element={<KakaoMap />} />
                <Route path="/success" element={<PaySuccess />}/>
            </Routes>
            {pathName !== '/singup' && pathName !== '/error' && pathName !== '/success' && <Footer />}
        </>
    );
};

export default App;
