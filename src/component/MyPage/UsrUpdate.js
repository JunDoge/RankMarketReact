import '../../css/MyPage/SignUpdate.css'
import {Button, Col, Form, Row} from 'react-bootstrap';
import React, {useEffect, useState} from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function UsrUpdate({setUsrNm, setIsLoggedIn}){
    const [modalShow, setModalShow] = useState(false);
    const navigate = useNavigate();
    const [isPhoneValidated, setIsPhoneValidated] = useState(false);
    const [show, setShow] = useState(false);
    const [code, setCode] = useState('')
    const [phone, setPhone] = useState({
        prefix: '',
        mid: '',
        last: ''
    })
    const [userInfo, setUserInfo] = useState({
        usrNm : '',
        phNum:'',
        pstAddr:'',
        rdAddr:'',
        detAddr:'',
        bdate:''
    })
    const handleClose = () => setShow(false);
    const handleShow = () => setTimeout(() => setShow(false), 2000);
    const onChangePhone = (e) => {
        const { name, value } = e.target;
        if (value.length <= 4) {
            setPhone({
                ...phone,
                [name]: value
            });
        }
    };

    function deluser(){
        axios.delete('/delete/usr', {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            }
        }).then(r=> {
            localStorage.removeItem("usrNm");
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            navigate('/')
        })
    }
    function onValidatePhone() {
        console.log(userInfo.phNum);
        axios.post('/validation/phone', null, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            },
            params: {
                phNum : userInfo.phNum
            },
        })
            .then(r => {
                setIsPhoneValidated(true)
                console.log(r.data);
            })
            .catch(error => {
                console.error(error);
            });
    }
    function onValidateCode() {
        console.log(code);
        axios.post('/validation/code', null, {
            params: {
                phNum : userInfo.phNum,
                phCode: code
            },
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            }
        })
            .then(r => {
                console.log(r.data);
                if (r.data) {
                    usrUpdate([{phNum : userInfo.phNum,}])
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        setUserInfo({
            ...userInfo,
            phNum: `${phone.prefix}${phone.mid}${phone.last}`
        });
    }, [phone]);
    const usrUpdate = (params) => {

        console.log(Object.keys(params))
        console.log(Object.values(params))
        const formdata = new FormData();
        for(let i=0; i< params.length; i++)
        {
            for (const item in params[i]) {
                console.log(params[i][item]);
                formdata.append("updateColumn", item)
                formdata.append("updateValue", params[i][item])
            }
        }
        axios.post('/update/usr',formdata,{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`,
            }
        }).then(r =>{
            setShow(true)
            handleShow();
            console.log(r.data);
        })
        
    }

    useEffect(()=>{
    axios.post('/mypage/info/usr',null,{
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("token")}`,
        }
    }).then(r=>{
        console.log(r.data)
    }).catch(error => {
        console.error('오류 발생함 ', error);
    });
    },[])
    
    const onChangeHandle = (e) => {
        console.log(e.target.value)
        const { name, value } = e.target;
        setUserInfo({
            ...userInfo,
            [name]: value
        });
    };

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

    return(
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>변경되었습니다.</Modal.Title>
                </Modal.Header>
            </Modal>
        <div>
            <div className="mypageNav">
                <h1>내 정보</h1>
            </div>
            <div className="mypageMain">
                <Form>
                    <Modal
                        show={modalShow}
                        onHide={() => setModalShow(false)}
                        centered
                    >
                        <Modal.Header className="update-modal-header" closeButton>
                            <Modal.Title>닉네임 변경</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="modal-body-title mb-3">닉네임을 입력해주세요</p>
                            <p className="modal-body-des mb-3">닉네임</p>
                            <Form.Control
                                type="text"
                                name = "usrNm"
                                onChange={onChangeHandle}
                                autoFocus
                            />
                        </Modal.Body>
                        <Modal.Footer className="update-modal-footer" >
                            <Button className="modal-button exit" onClick={() => {
                                setUserInfo((prevState) => {return {...prevState,usrNm:''}})
                                setModalShow(false);}}>취소</Button>
                            <Button className="modal-button save" onClick={() => setModalShow(false)}>저장</Button>
                        </Modal.Footer>
                    </Modal>
                    <Form.Group as={Row} className="mb-3 line" controlId="nickname">
                        <Form.Label column sm={2}>닉네임</Form.Label>
                        <Col sm={6}>
                            <Form.Control type="text" readOnly value={userInfo.usrNm} onClick={() => setModalShow(true)} />
                        </Col>
                        <Col sm={2}>
                            <Button className="signUpdateButton" variant="primary"
                                    onClick={()=>{
                                        usrUpdate([{usrNm:userInfo.usrNm}])
                                        localStorage.setItem('usrNm',userInfo.usrNm)
                                        setUsrNm(userInfo.usrNm)}}
                            >
                                변경
                            </Button>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 line" controlId="phone">
                        <Row>
                        <Form.Label column sm={2}>전화번호</Form.Label>
                        <Col sm={2}>
                            <Form.Select onChange={onChangePhone} name='prefix' aria-label="전화번호 앞자리">
                                <option>선택</option>
                                <option value="010">010</option>
                                <option value="011">011</option>
                                <option value="016">016</option>
                                <option value="017">017</option>
                                <option value="018">018</option>
                                <option value="019">019</option>
                            </Form.Select>
                        </Col>
                        <Col sm={2}>
                            <Form.Control type="tel" name='mid' value={phone.mid} onChange={onChangePhone} maxLength={4} />
                        </Col>
                        <Col sm={2}>
                            <Form.Control type="tel" name='last' value={phone.last} onChange={onChangePhone} maxLength={4} />
                        </Col>
                        <Col sm={2}>
                            <Button className="signUpdateButton" variant="primary"
                                    onClick={onValidatePhone}
                            >인증</Button>
                        </Col>
                        </Row>
                        {isPhoneValidated &&
                            <Row className="mt-3">
                                <Form.Label column sm={2}>인증코드</Form.Label>
                                <Col sm={4}>
                                    <Form.Control type="text" onChange={(e)=>{setCode(e.target.value)}} maxLength={4} />
                                </Col>
                                <Col sm={2}>
                                    <Button className="signUpdateButton" variant="primary"
                                            onClick={onValidateCode}
                                    >변경</Button>
                                </Col>
                            </Row>
                        }
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3 line" controlId="address">
                        <Form.Label column sm={2}>주소</Form.Label>
                        <Col sm={10}>
                            <Row>
                                <Col sm={4}>
                                    <Form.Control className="mt-2" name="des" type="text" defaultValue={userInfo.pstAddr} placeholder="우편번호" />
                                </Col>
                                <Col sm={4}>
                                    <Button  className="mt-2 signUpdateAddress" variant="primary"
                                        onClick={handleClick}
                                    >주소검색</Button>
                                </Col>
                            </Row>
                            <Row>
                            <Col sm={7}>
                                <Form.Control className="mt-2" defaultValue={userInfo.rdAddr} type="text" placeholder="도로명주소"/>
                            </Col>
                            </Row>
                            <Row>
                                <Col sm={7}>
                                <Form.Control className="mt-2" name="detAddr" type="text" defaultValue={userInfo.detAddr} onChange={onChangeHandle} placeholder="상세주소"/>
                                </Col>
                                <Col sm={2}>
                                <Button className="signUpdateButton mt-2" variant="primary"
                                        onClick={()=>{usrUpdate([{pstAddr:userInfo.pstAddr},{rdAddr:userInfo.rdAddr},{detAddr:userInfo.detAddr}])}}
                                >변경
                                </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3 line">
                        <Col sm={{ span: 10, offset: 2 }} className="d-flex">
                            <Button className="signUpdatebotton cancle" variant="secondary" onClick={()=>{navigate(-1)}}>취소</Button>
                            <Button className="signUpdatebotton delete" variant="danger" onClick={()=>{deluser()}}>계정탈퇴</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </div>
        </>
    )
}
export default UsrUpdate
