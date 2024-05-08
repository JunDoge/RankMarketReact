import React, { useEffect, useState } from 'react';
import { Button, Col, Container, Row, OverlayTrigger, Popover, Toast, ToastContainer } from 'react-bootstrap';
import '../../css/MyPage/WishList.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Report() {
    const [reports, setReports] = useState([]);
    const [showToast, setShowToast] = useState(false); // Toast 표시 여부
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/mypage/history/report', {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            }
        }).then(r => {
            console.log(r.data);
            const newReports = r.data.response;
            setReports(prevReports => [...prevReports, ...newReports]);
        }).catch(e => {
            navigate('/error');
        });
    }, []);

    const reportType = {
        1: '사전고지한 상품정보와 상이',
        2: '주문취소 시 환불 거부',
        3: '가품의심',
        4: '안전거래 사칭 등 결제 관련 사기',
        5: '개인정보 관련 피해',
        6: '거래 당사자 간 연락 지연',
        7: '사용불가 제품',
        8: '무단 이미지 도용',
        9: '기타의견'
    };

    const delReport = (rpt_id) => {
        axios.delete(`/delete/report/${rpt_id}`, null, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`},
 
        }).then(r => {
            setReports(prevReports => prevReports.filter(report => report.rptId !== rpt_id));
            setShowToast(true); // Toast 표시
            setTimeout(() => {
                setShowToast(false); // 2초 후 Toast 숨김
            }, 2000);
        });
    };

    return (
        <div>
            <Container className="mypageMain">
                <Row className="mb-2">
                    <Col xs={3} className="d-flex align-items-center justify-content-center"><strong>신고유형</strong></Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>이미지</strong></Col>
                    <Col xs={5} className="d-flex align-items-center justify-content-center"><strong>신고내용</strong></Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>선택</strong></Col>
                </Row>
                <div className="borderBottom"></div>
                {reports.map((report, index) => (
                    <div key={index}>
                        <Row>
                            <Col xs={3} className="d-flex align-items-center justify-content-center font-weight-bold font20">{reportType[report.rptType]}</Col>
                            <Col className="mt-2" xs={2}><img className="img-fluid" src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${report.img}`} alt="상품 이미지"/></Col>
                            <Col xs={5} className="d-flex align-items-center justify-content-center font20">
                                <OverlayTrigger trigger="click" placement="right" 
                                    overlay={ 
                                        <Popover id={"popover-" + index}>
                                            <Popover.Header as="h3">{reportType[report.rptType]}</Popover.Header>
                                            <Popover.Body>
                                                {report.rptDes}
                                            </Popover.Body>
                                        </Popover>
                                    }>
                                    <Button variant="link">신고내용 보기</Button>
                                </OverlayTrigger>
                            </Col>
                            <Col xs={2} className="d-flex align-items-center justify-content-center">
                                <Row>
                                    <Button variant="warning" className="bidhis-button" onClick={()=>{delReport(report.rptId)}}>취소</Button>
                                </Row>
                            </Col>
                        </Row>
                        <div className="borderBottom">{' '}</div>
                    </div>
                ))}
            </Container>
            <ToastContainer className="p-3" position="bottom-end">
                <Toast onClose={() => setShowToast(false)} show={showToast} delay={2000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">삭제 성공</strong>
                    </Toast.Header>
                    <Toast.Body>신고 취소되었습니다.</Toast.Body>
                </Toast>
            </ToastContainer>
        </div>
    );
}

export default Report;
