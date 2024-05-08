import {Button, Col, Container, Form, Modal, Row} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import '../../css/MyPage/WinHistory.css'
import axios from "axios";
import {useNavigate} from "react-router-dom";

function WinHistory(){
    const [winHistory, setWinHistory] = useState([]);
    const navigate = useNavigate();
    const [opinion, setOpnion] = useState({
        revDes: '',
        rateSrc: '',
        rptId:'',
        rptDes:''
    });
    const report = [{1:'사전고지한 상품정보와 상이'},{2:'주문취소 시 환불 거부'},{3:'가품의심'},{4:'안전거래 사칭 등 결제 관련 사기'},
        {5:'개인정보 관련 피해'},{6:'거래 당사자 간 연락 지연'},{7:'사용불가 제품'},{8:'무단 이미지 도용'},{9:'기타의견'}]

    const [selectedPrdId, setSelectedPrdId] = useState(null);

    useEffect(() => {
        axios.get('/mypage/history/win',{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`}
        }).then(r =>{
            console.log(r.data)
            const newWinHistory = r.data.response;
            setWinHistory(prevsetWinHistory => [...prevsetWinHistory, ...newWinHistory]);
        }).catch(e =>{
            return null
        })

    }, []);


    const addreview =(prdId) =>{
        const formdata = new FormData();
        formdata.append('prdId',selectedPrdId)
        formdata.append('revDes',opinion.revDes)
        formdata.append('rateScr',opinion.rateSrc)
        axios.post('/add/review',formdata,{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            }
        }).then(r=> {
            navigate('/mypage/opinion/review')
            }
        )
    }
    const addreport =() =>{
        const formdata = new FormData();
        formdata.append('prdId',selectedPrdId)
        formdata.append('rptId',opinion.rptId)
        formdata.append('rptDes',opinion.rptDes)
        
        axios.post('/add/report',formdata,{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            }
        }).then(r=> {
                navigate('/mypage/opinion/report')
            }
        )
    }
    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        console.log(name + value)
        setOpnion({
            ...opinion,
            [name]: value
        });
    };

    const [showReportModal, setShowReportModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const handleReportModalOpen = (prd_id) => {
        setSelectedPrdId(prd_id);
        setShowReportModal(true);
    }
    const handleReportModalClose = () => setShowReportModal(false);


    const handleReviewModalOpen = (prd_id) => {
        setSelectedPrdId(prd_id);
        setShowReviewModal(true);
    }
    const handleReviewModalClose = () => setShowReviewModal(false);

    return(
        <Container className="mypageMain">
            <Row className="mb-2">
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>이미지</strong></Col>
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>상품명</strong></Col>
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>시작가</strong></Col>
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>최고가</strong></Col>
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>판매가</strong></Col>
                <Col xs={2}  className="d-flex align-items-center justify-content-center"><strong>선택</strong></Col>
            </Row>
            <div className="borderBottom"></div>
            {winHistory.map((winHistory, index) => (
    <div key={index}>
        <Row>
        <Col className="mt-2" xs={2}>
    <img className="img-fluid img-fixed-size" src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${winHistory.img}`} alt="상품 이미지"/>
</Col>

            <Col xs={2} className="d-flex align-items-center justify-content-center font-weight-bold font20">{winHistory.title}</Col>
            <Col xs={2} className="d-flex align-items-center justify-content-center font20">{winHistory.sellPrice.toLocaleString()} 원</Col>
            <Col xs={2} className="d-flex align-items-center justify-content-center font20">{winHistory.highPrice.toLocaleString()} 원</Col>
            <Col xs={2} className="d-flex align-items-center justify-content-center font20">{winHistory.winPrice.toLocaleString()} 원</Col>
            <Col xs={2} >
                <Row className="mb-1 mt-4 d-flex align-items-center justify-content-center" >
                    {/* 결제하기 버튼 활성화/비활성화 처리 */}
                    <Button className="winhis-pay-button w-50" onClick={()=>{navigate('/mypage/pay')}} disabled={winHistory.status !== 1}>결제하기</Button> {/* 수정됨 */}
                </Row>
                <Row className="mb-1 d-flex align-items-center justify-content-center">
                    {/* 후기작성 버튼 활성화/비활성화 처리 */}
                    <Button className="winhis-review-button w-50" onClick={() => handleReviewModalOpen(winHistory.prdId)} disabled={winHistory.status !== 4}>후기작성</Button>
                </Row>
                <Row className="d-flex align-items-center justify-content-center">

                <Button variant="danger" className="winhis-report-button w-50" onClick={() => handleReportModalOpen(winHistory.prdId)} disabled={winHistory.status !== 4}>신고</Button>

                </Row>
            </Col>
        </Row>
        <div className="borderBottom">{' '}</div>
    </div>
))}

            <Modal show={showReviewModal} onHide={handleReviewModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>후기 작성하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="reviewForm">
                            <div className="star-rating">
                                <input type="radio" className="star" value="1" name='rate_src' onChange={onChangeHandle}/>
                                <input type="radio" className="star" value="2" name='rate_src' onChange={onChangeHandle}/>
                                <input type="radio" className="star" value="3" name='rate_src' onChange={onChangeHandle}/>
                                <input type="radio" className="star" value="4" name='rate_src' onChange={onChangeHandle}/>
                                <input type="radio" className="star" value="5" name='rate_src' onChange={onChangeHandle}/>
                            </div>
                            <Form.Control as="textarea" name="revDes" className="mt-3" onChange={onChangeHandle} rows={3} autoFocus />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleReviewModalClose}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={addreview}>
                        작성하기
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showReportModal} onHide={handleReportModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>신고하기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="reportForm">
                            <Form.Control as="select"  custom="true" defaultValue='' name="rptId" onChange={onChangeHandle}>
                                <option value=''>신고유형을 선택해주세요</option>
                                {
                                    report.map((report, index)=>{
                                        return(
                                            <option key={index} value={Object.keys(report)} >{Object.values(report)}</option>
                                        )
                                    })
                                }

                            </Form.Control>
                            <Form.Control as="textarea" name='rptDes' onChange={onChangeHandle} rows={3} autoFocus />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleReportModalClose}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={addreport}>
                        신고하기
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    )
}
export default WinHistory