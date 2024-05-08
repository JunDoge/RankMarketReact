import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { useNavigate } from "react-router-dom";
import LoginModal from "./SocialLogin/LoginModal";
import '../css/Navbar.css'

import SetUsrNmContext from './SetUsrNmContext'; // 추가

function NavbarComponent({ isLoggedIn, setIsLoggedIn }){
    let navigate = useNavigate();
    let [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
    const [disabled, setDisabled] = useState(false)
    const [usrNm, setUsrNm] = useState(localStorage.getItem('usrNm'));

    useEffect(() => {
        setDisabled(!isLoggedIn);
        setUsrNm(localStorage.getItem('usrNm')); 
    }, [isLoggedIn]);

    const logOut = () => {
        localStorage.removeItem("usrNm");
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUsrNm(null); 
        navigate('/')
    }

    return (
        <SetUsrNmContext.Provider value={setUsrNm}> {/* 추가 */}
            <div className="navbarPosition">
                <Navbar className="bg-body-tertiary" expand="lg">
                    <Container>
                        <Navbar.Brand>
                            <img
                                src="https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/icon/headerLogo.png"
                                width="200"
                                height="40"
                                className="d-inline-block align-top"
                                alt="RankMarket"
                                onClick={() =>{navigate('/')}}
                            />
                            <div className="search_bar">
                                <input type="text"
                                    className="search_input"
                                    placeholder="상품 검색하기"
                                    onKeyPress={
                                        (e) => {
                                            if(e.key === 'Enter'){
                                                navigate(`/products/?prd=${e.target.value}`)
                                            }
                                        }
                                    }
                                    onBlur={(e) => e.target.value = ''}
                                />
                            </div>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav>
                                <Nav.Link className="productPage" onClick={() => navigate('/products')}>상품페이지</Nav.Link>
                                <Nav.Link className="productAdd" onClick={() => navigate('/productAdd')} disabled={!isLoggedIn} >상품등록</Nav.Link>
                                <NavDropdown title={!isLoggedIn ? "마이페이지" : usrNm} id="basic-nav-dropdown" className="myPage" disabled={!isLoggedIn} > {/* usrNm을 사용하여 dropdown title 설정 */}
                                    <NavDropdown.Item onClick={() => navigate('/mypage/usrUpdate')}>계정관리</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => navigate('/mypage/prdmgmt')}>상품관리</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => navigate('/mypage/transactions')}>거래내역</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => navigate('/mypage/chatroom')}>채팅방</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => navigate('/mypage/wishlist')}>찜목록</NavDropdown.Item>
                                    <NavDropdown.Item onClick={() => navigate('/mypage/opinion')}>후기</NavDropdown.Item>
                                </NavDropdown>
                                {
                                    isLoggedIn ? <Button className="loginButton" onClick={logOut}>로그아웃</Button>
                                        : <Button className="loginButton" onClick={handleShow}>로그인</Button>
                                }
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <LoginModal show={showModal} handleClose={handleClose} setIsLoggedIn={setIsLoggedIn} />
            </div>
        </SetUsrNmContext.Provider>
    );
};

export default NavbarComponent;
