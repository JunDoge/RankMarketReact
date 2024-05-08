import {Col, Container, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../../css/MyPage/PayHistory.css'; // CSS 파일 임포트

function PayHistory(){
    const [pay, setPay] = useState([])
    const navigate = useNavigate()
    useEffect(() => {
        axios.get('/mypage/history/pay',{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`},
            params:{
                status: '0'
            }
        }).then(r =>{
            console.log(r.data);
            const newPay = r.data.response;
            setPay(prevPay =>[...prevPay, ...newPay]);
        }).catch(e =>{
            navigate('/error')
        })

    }, []);

    return(
        <Container className="mypageMain">
            <Row className="mb-2">
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>이미지</strong></Col>
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>상품명</strong></Col>
                <Col xs={1} className="d-flex align-items-center justify-content-center"><strong>결제금액</strong></Col>
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>경매 상태</strong></Col>
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>결제 상태</strong></Col>
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>결제일</strong></Col>
            </Row>
            <div className="borderBottom"></div>
            {pay.map((pay, index) => (
                <div key={index}>
                    <Row>
                    <Col className="mt-2" xs={2}>
    <img className="img-fluid img-fixed-size" src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${pay.img}`} alt="상품 이미지"/>
</Col>
                        <Col xs={2} className="d-flex align-items-center justify-content-center font-weight-bold font20">{pay.title}</Col>
                        <Col xs={1} className="d-flex align-items-center justify-content-center font20">{pay.winPrice.toLocaleString()}</Col>
                        <Col xs={2} className="d-flex align-items-center justify-content-center font16">경매완료</Col>
                        <Col xs={2} className="d-flex align-items-center justify-content-center font16">{pay.payDtm != null ? '결제완료' : '결제대기'}</Col>
                        <Col xs={2} className="d-flex align-items-center justify-content-center font20">{pay.payDtm}</Col>
            
                    </Row>
                    <div className="borderBottom">{' '}</div>
                </div>
            ))}
        </Container>
    )
}
export default PayHistory
