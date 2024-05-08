import React, {useState} from 'react';
import axios from 'axios';
import '../../css/SocialLogin/SingUp.css';
import {useLocation, useNavigate} from "react-router-dom";
import Modal from "react-bootstrap/Modal";

// 새로 추가함
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';



function SignupPage({ setIsLoggedIn }) {
    const location = useLocation()
    const token = location.state.token
    const navigate = useNavigate();
    const [code, setCode] = useState('')
    const [isPhoneValidated, setIsPhoneValidated] = useState(false);
    const [isCodeValidated, setIsCodeValidated] = useState(false);
    const [agree, serAgree] = useState(true)
    const [show, setShow] = useState(false);
    const [userInfo, setUserInfo] = useState({
        mail : location.state.mail,
        usrNm : location.state.usrNm,
        bdate: '',
        phNum: '',
        pstAddr: '',
        rdAddr: '',
        detAddr: ''
    });

    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value
        });
    };

    const handleClose = () => setShow(false);
    const handleShow = () => setTimeout(() => setShow(false), 2000);
    function onValidatePhone() {
        console.log(userInfo.phNum);
        axios.post('/validation/phone', null, {
            params: {
                phNum : userInfo.phNum
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(r => {
                console.log(r.data);
                if(r.data) {
                    setIsPhoneValidated(true);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    const handleClick = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                let fullRoadAddr = data.roadAddress;
                let extraRoadAddr = '';

                if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                    extraRoadAddr += data.bname;
                }

                if(data.buildingName !== '' && data.apartment === 'Y'){
                    extraRoadAddr += (extraRoadAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                }

                if(extraRoadAddr !== ''){
                    extraRoadAddr = ' (' + extraRoadAddr + ')';
                }

                if(fullRoadAddr !== ''){
                    fullRoadAddr += extraRoadAddr;
                }

                setUserInfo((prevState) => {
                    return { ...prevState, pstAddr: data.zonecode}})
                setUserInfo((prevState) => {
                    return { ...prevState, rdAddr: fullRoadAddr}})
            }
        }).open();
    };
    function onValidateCode() {
        console.log(code);
        axios.post('/validation/code', null, {
            params: {
                phNum : userInfo.phNum,
                phCode: code
            },
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(r => {
                console.log(r.data);
                if (r.data) {
                    setShow(true)
                    handleShow();
                    setIsCodeValidated(true);
                }
            })
            .catch(error => {
                console.error(error);
            });
    }
    function onSubmitHandle(e){
        e.preventDefault();
        const params = new URLSearchParams();
        for(const k in userInfo) {
            console.log(userInfo[k])
            params.append(k, userInfo[k]);
        }
        axios.post('/signup', params, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
            .then(r => {
                console.log( " dddfsdfasfasfasfd"+ r.headers['authorization'])
                localStorage.setItem("token",r.headers['authorization'])
                localStorage.setItem('usrNm', r.data.response.usrNm)
                navigate('/');
                setIsLoggedIn(true);
            })
            .catch(error => {
                console.error(error);
            });
    }


    return (
        <>
            <Modal className="registModal" show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>인증되었습니다.</Modal.Title>
                </Modal.Header>
            </Modal>
            <div className='singup'>
                <div className="sing-container">
                    <div className="login-section">
                        <div className="header-container">
                            <h1>회원정보 <br/> 입력</h1>
                        </div>
               				<form onSubmit={onSubmitHandle}>
                            <Form.Control
                                size="sm"
                                type="email"
                                id="email"
                                name="mail"
                                aria-label="Disabled input example"
                                value={userInfo.mail}
                                disabled
                                readOnly
                            />

                            <Form.Control
                                size="sm"
                                type="text"
                                id="name"
                                name="usrNm"
                                onChange={onChangeHandle}
                                defaultValue={userInfo.usrNm}
                                disabled
                                readOnly
                            />

                            {/*달력*/}
                            <input type="date" id="birth"  name="bdate" onChange={onChangeHandle} required pattern="[0-9]{6}" defaultValue={userInfo.bdate} />

                            <InputGroup size="sm" >
                                <Form.Control
                                    type="tel"
                                    id="phone"
                                    name="phNum"
                                    onChange={onChangeHandle}
                                    defaultValue={userInfo.phNum}
                                    placeholder="전화번호를 입력하세요"


                                    readOnly={isCodeValidated}
                                />
                                <Button
                                    variant="outline-secondary"
                                    id="button-addon2"
                                    onClick={onValidatePhone}>
                                    인증번호 발송
                                </Button>
                            </InputGroup>

                            <div className="singup-area" >

                            </div>
                            {isPhoneValidated && (
                                <InputGroup  size="sm">
                                    <Form.Control
                                        type="tel"
                                        id="phone"
                                        name="phCode"
                                        onChange={(e) =>{setCode(e.target.value)}}
                                        defaultValue={code}
                                        placeholder="전송된 인증번호를 입력하세요."
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        id="button-addon2"
                                        onClick={onValidateCode}
                                    >인증하기</Button>
                                </InputGroup>
                            )}
                            <InputGroup className="mb-3" size="sm">
                                <Form.Control
                                    placeholder="우편번호를 입력"
                                    aria-label="우편번호"
                                    type="text"
                                    id="postcode"
                                    name="pstAddr"
                                    value={userInfo.pstAddr}
                                    readOnly
                                />
                                <Form.Control
                                    placeholder="도로명주소를 입력"
                                    aria-label="도로명주소"
                                    type="text"
                                    id="roadAddress"
                                    name="rdAddr"
                                    value={userInfo.rdAddr}
                                    readOnly
                                />
                                <Button
                                    variant="outline-secondary"
                                    id="button-addon2"
                                    type="button"
                                    onClick={handleClick}
                                >
                                    주소입력하기
                                </Button>

                            </InputGroup>

                            {/*<input type="text" id="det_addr" name="det_addr" onChange={onChangeHandle} defaultValue={userInfo.det_addr} placeholder="상세주소를 입력하세요" />*/}
                            
                            {/*새로 추가함*/}
                            <FloatingLabel
                                type="text"
                                id="detAddr"
                                name="detAddr"
                                onChange={onChangeHandle}
                                defaultValue={userInfo.detAddr}
                                label="상세주소를 입력하세요"
                                className="mb-3"
                            >
                                <Form.Control as="textarea" placeholder="상세주소를 입력하세요"/>
                            </FloatingLabel>

                            <div className="singup-area">
                                <div key={`inline-checkbox`}>
                                    <Form.Check
                                        inline
                                        id="agree"
                                        name="agree"
                                        type="checkbox"
                                        onClick={()=>{serAgree((prev)=> !prev)}}

                                    />
                                    {/*약관동의 클릭 안하면 버튼클릭 못하게 함*/}
                                    <label htmlFor="agree">이용약관에 동의합니다</label>
                                </div>
                                <Button variant={agree ? 'secondary': 'primary'} disabled={agree} type="submit">회원가입하기</Button>
                            {/*이용약관 동의 안할 시 버튼 색과 비활성화*/}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignupPage;