import {Button, Col, Container, Modal, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import WatchSVG from '../Products/WatchSVG';
import '../../css/MyPage/BidHistory.css'
import axios from "axios";
import Bidding from "../../api/Bidding";
import { useNavigate } from "react-router-dom";
//입찰하기 버튼 추가함
import BidButton from '../../api/BidButton';

function BidHistory(){
    const [bidHistory, setBidHistory] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate()
    useEffect(() => {
        axios.get('/mypage/history/bid',{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`}
        }).then(r =>{
            console.log(r.data);
            const newbidHistory = r.data.response;
            setBidHistory(prevsetBidHistory => [...prevsetBidHistory, ...newbidHistory]);
        }).catch(e =>{
            navigate('/error')
        });
    }, []);

    const [currentTime, setCurrentTime] = useState(new Date());
    const { bid, ToastComponent } = Bidding();


    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

    function delMyBid(prdId){


        axios.delete('/delete/bid/product', [prdId],{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            },
            params:{
                prdIds : prdId
            },
            paramsSerializer:paramObj => {
                const params = new URLSearchParams()
                for(const key in paramObj){
                    params.append(key, paramObj[key])
                }
                return params.toString()
            }
        }).then(r=> {
            setBidHistory(prevBidHistory => prevBidHistory.filter(bid => bid.prd_id !== prdId));
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
            }, 2000);
        });
    }

    const getTimeDiff = (auctionEndTime) => {
        const formattedEndTime = auctionEndTime.replace(/(\d{2})\/(\d{2})\/(\d{2}) (\d{2}:\d{2}:\d{2})/, "20$1-$2-$3T$4Z");
        const endTime = new Date(formattedEndTime);
        const diffTime = endTime - currentTime;

        if (diffTime < 0) {
            return '경매 종료';
        } else {
            const diffSeconds = Math.floor(diffTime / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays % 30}일 ${diffHours % 24}시간 ${diffMinutes % 60}분 ${diffSeconds % 60}초`;
        }
    };

    return(
        <Container className="mypageMain">
            <Row className="mb-2">
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>이미지</strong></Col>
                <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>상품명</strong></Col>
                <Col xs={1} className="d-flex align-items-center justify-content-center"><strong>시작가</strong></Col>
                <Col xs={1} className="d-flex align-items-center justify-content-center"><strong>최고가</strong></Col>
                <Col xs={1} className="d-flex align-items-center justify-content-center"><strong>나의 입찰</strong></Col>
                <Col xs={3} className="d-flex align-items-center justify-content-center"><strong>경매 남은 시간</strong></Col>
                <Col xs={2}  className="d-flex align-items-center justify-content-center"><strong>선택</strong></Col>
            </Row>
            <div className="borderBottom"></div>
            {bidHistory.map((bidHistory, index) => (
                <div key={index}>
                    <Row>
                    <Col className="mt-2" xs={2}>
    <img className="img-fluid img-fixed-size" src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${bidHistory.img}`} alt="상품 이미지"/>
</Col>
                        <Col xs={2} className="d-flex align-items-center justify-content-center font-weight-bold font20">{bidHistory.title}</Col>
                        <Col xs={1} className="d-flex align-items-center justify-content-center font20">{bidHistory.sellPrice.toLocaleString()}</Col>
                        <Col xs={1} className="d-flex align-items-center justify-content-center font20">{bidHistory.highPrice.toLocaleString()}</Col>
                        <Col xs={1} className="d-flex align-items-center justify-content-center font20">{bidHistory.bidPrice.toLocaleString()}</Col>
                        <Col xs={3} className="d-flex align-items-center justify-content-center font20"
                             style={getTimeDiff(bidHistory.end_dtm) === '경매 종료' ? {color: 'red'} : {}}>
                            <WatchSVG bool={getTimeDiff(bidHistory.end_dtm) === '경매 종료'}/>{getTimeDiff(bidHistory.endDtm)}
                        </Col>
                        <Col xs={2} className="d-flex flex-column justify-content-center">
                            <Row className="mb-2">
                                <BidButton halfWidth={true} state={bidHistory} bool={getTimeDiff(bidHistory.endDtm) === '경매 종료'} />
                            </Row>
                            
                            <Row className="mb-2">
                                <Button variant="warning" className="bidhis-button w-50 mx-auto" onClick={() => delMyBid(bidHistory.prdId)}>취소</Button>
                            </Row>
                        </Col>
                    </Row>
                    <div className="borderBottom">{' '}</div>
                </div>
            ))}
                 <ToastComponent />
        </Container>
    );
}
export default BidHistory;