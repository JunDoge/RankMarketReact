import React, {useEffect, useState} from 'react';
import {Button, Col, Container, Modal, Row, OverlayTrigger, Popover} from 'react-bootstrap';
import '../../css/MyPage/WishList.css'
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Review() {
    const [reviews, setReviews] = useState([])
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        axios.get('/mypage/history/review',{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`}
        }).then(r =>{
            console.log(r.data)
            const newReviews = r.data.response;
            setReviews(prevReviews => [...prevReviews, ...newReviews])
        }).catch(e =>{
            navigate('/error')
        })

    }, []);

    function StarRating({rating}) {
        const stars = [];
        for(let i = 1; i <= 5; i++) {
            if(i <= rating) {
                stars.push(<span key={i}>★</span>);
            } else {
                stars.push(<span key={i}>☆</span>);
            }
        }
        return (
            <div>
                {stars}
            </div>
        )
    }

    const delReview = (prd_id) => {
        axios.delete('/delete/reviews',null,{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`},
            params: {
                prdId : prd_id
            }
        }).then(r=> {
            setReviews(prevReviews => prevReviews.filter(review => review.prdId !== prd_id));
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
            }, 2000);
        })
    }

    return(
        <div>
        <Container className="mypageMain">
            <Row className="mb-2">
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>평점</strong></Col>
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>이미지</strong></Col>
                <Col xs={6} className="d-flex align-items-center justify-content-center"><strong>리뷰내용</strong></Col>
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>선택</strong></Col>
            </Row>
            <div className="borderBottom"></div>
            {reviews.map((review, index) => (
                <div key={index}>
                    <Row>
                        <Col xs={2} className="d-flex align-items-center justify-content-center font-weight-bold font20">
                            <StarRating rating={review.rateScr} />
                        </Col>
                        <Col className="mt-2" xs={2}><img className="img-fluid" src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${review.img}`} alt="상품 이미지"/></Col>
                        <Col xs={6} className="d-flex align-items-center justify-content-center font20">
                            <OverlayTrigger trigger="click" placement="right" 
                                overlay={ 
                                    <Popover id={"popover-" + index}>
                                        <Popover.Header as="h3">리뷰 내용</Popover.Header>
                                        <Popover.Body>
                                            {review.revDes}
                                        </Popover.Body>
                                    </Popover>
                                }>
                                <Button variant="link">리뷰 내용 보기</Button>
                            </OverlayTrigger>
                        </Col>
                        <Col xs={2} className="d-flex align-items-center justify-content-center">
                            <Row>
                                <Button variant="warning" className="bidhis-button" onClick={()=>{delReview(review.prdId)}}>취소</Button>
                            </Row>
                        </Col>
                    </Row>
                    <div className="borderBottom">{' '}</div>
                </div>
            ))}
        </Container>
    <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>상품이 성공적으로 삭제되었습니다.</Modal.Title>
        </Modal.Header>
    </Modal>
        </div>
    );
}

export default Review;
