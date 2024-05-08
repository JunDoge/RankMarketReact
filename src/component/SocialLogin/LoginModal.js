import React from 'react';
import Modal from 'react-bootstrap/Modal';
import '../../css/SocialLogin/LoginModal.css'
import KaKaoLogin from './KaKaoLogin';
import NaverLogin from "./NaverLogin";
import GoogleLogin from "./GoogleLogin";

function LoginModal({show, handleClose, setIsLoggedIn}) {

    const kakaoLoginHandler = KaKaoLogin(setIsLoggedIn);
    const naverLoginHandler = NaverLogin(setIsLoggedIn)
    const googleLoginHandler = GoogleLogin(setIsLoggedIn)

    return(
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header className="modal-background">
                <Modal.Title>로그인하기!</Modal.Title>
            </Modal.Header>
            <Modal.Body className="loginButtons">
                <button onClick={kakaoLoginHandler} >
                    <img src="https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/icon/kakaoLoginButton.png" className="loginImg" alt="KakaoLogin"/>
                </button>
                <button onClick={naverLoginHandler}>
                    <img src="https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/icon/naverLoginButton.png" className="loginImg" alt="NaverLogin" /></button>
                <button onClick={googleLoginHandler}>
                    <img src="https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/icon/googleLoginButton.png" className="loginImg" alt="GoogleLogin" /></button>
            </Modal.Body>
        </Modal>
    )
}
export default LoginModal;
