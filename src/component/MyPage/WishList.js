import React, { useEffect, useRef, useState } from 'react';
import { Button, Col, Container, Form, Modal, Row, Image } from 'react-bootstrap';
import '../../css/MyPage/WishList.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import BidButton from '../../api/BidButton';
import WatchSVG from '../Products/WatchSVG.js';

function WishList() {
    const [wishlist, setwishlist] = useState([]);
    const [checkWish, setCheckWish] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [checkedItems, setCheckedItems] = useState(Array(wishlist.length).fill(false));
    const [currentTime, setCurrentTime] = useState(new Date());

    const scrollRef = useRef(null);
    useEffect(() => {
        axios.get('/wishes',{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`}
        }).then(r =>{
            console.log(r.data)
            const newwishlist = r.data.response;
            setwishlist(prevsetwishlist => [...prevsetwishlist, ...newwishlist]);
        }).catch(e =>{
            return null
        })

    }, []);
    useEffect(() => {
        // wishlist 배열의 길이가 변경될 때마다 checkedItems 상태를 업데이트합니다.
        // 이는 전체 선택 체크박스가 기본적으로 해제된 상태로 유지되도록 합니다.
        setCheckedItems(Array(wishlist.length).fill(false));
      }, [wishlist.length]);
      
    function delMyWish(prd_id){

        axios.get('/update/wish', {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            },
            params:{
                prdId : prd_id
            },
            paramsSerializer:paramObj => {
                const params = new URLSearchParams()
                for(const key in paramObj){
                    params.append(key, paramObj[key])
                }
                return params.toString()
            }
        }).then(r=> {
            setwishlist(prevBidHistory => prevBidHistory.filter(wish => wish.prdId !== prd_id));
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
            }, 2000);
        })
    }
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);


    function delMyWishs(){
        var prd_ids = []
        checkWish.map((item) => {
            prd_ids.push(item.prd_id);
        });
        console.log("prdIds " + prd_ids)
        axios.get('/update/wish', {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            },
            params:{
                prdId : prd_ids
            },
            paramsSerializer:paramObj => {
                const params = new URLSearchParams()
                for(const key in paramObj){
                    params.append(key, paramObj[key])
                }
                return params.toString()
            }
        }).then(r=> {
            checkWish.map((item) => {
                setwishlist(prevBidHistory => prevBidHistory.filter(wish => wish.prdId !== item.prd_id));
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
            }, 2000);
            });

            setCheckWish([]);
            setCheckedItems(Array(wishlist.length).fill(false));
        })
    }
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);


    

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);


    const handleCheckChange = (e, index) => {
        const newCheckedItems = [...checkedItems];
        newCheckedItems[index] = e.target.checked;
        setCheckedItems(newCheckedItems);
    
        const prdId = wishlist[index].prdId;
    
        const indexInCheckWish = checkWish.findIndex(item => item.prdId === prdId);
    
        if (indexInCheckWish !== -1) {
            const newCheckWish = [...checkWish];
            newCheckWish.splice(indexInCheckWish, 1);
            setCheckWish(newCheckWish);
        } else {
            setCheckWish([...checkWish, { prdId }]);
        }


    };
    

    const handleAllCheckChange = (e) => {
        const isChecked = e.target.checked;
        setCheckedItems(Array(wishlist.length).fill(isChecked));
    
        if (isChecked) {
            // 전체 항목이 선택되었을 때 checkWish 배열 업데이트
            setCheckWish(wishlist.map(item => ({ prdId: item.prdId })));
        } else {
            // 전체 선택이 해제되면 checkWish 배열을 비움
            setCheckWish([]);
        }
    };

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

    const scrollToTop = () => {
        scrollRef.current.scrollTop = 0;
    };

    return (
        <div>
            <div className="mypageNav">
                <h1>찜목록</h1>
            </div>
            <div className="wishlist-page">
            <Container className="mypageMain">
                <Row className="mb-2">
                    <Col xs={1} className="d-flex align-items-center justify-content-center">
                        <Form.Check
                            type="checkbox"
                            className="custom-checkbox"
                            checked={checkedItems.every(item => item)}
                            onChange={handleAllCheckChange}
                        />
                    </Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>이미지</strong></Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>상품명</strong></Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>현재가</strong></Col>
                    <Col xs={3} className="d-flex align-items-center justify-content-center"><strong>경매남은시간</strong></Col>
                    <Col xs={2}  className="d-flex align-items-center justify-content-center"><strong>선택</strong></Col>
                </Row>
                <div className="borderBottom"></div>
                <div style={{ maxHeight: '700px', overflowY: 'scroll', overflowX: 'hidden', position: 'relative', minHeight: '100vh' }} ref={scrollRef}>
                    {wishlist.map((wishlist, index) => (
                        <div key={index}>
                            <Row>
                                <Col xs={1} className="d-flex align-items-center justify-content-center font-weight-bold font20">
                                    <Form.Check
                                        type="checkbox"
                                        className="custom-checkbox"
                                        checked={checkedItems[index]}
                                        onChange={(e) => handleCheckChange(e, index)}
                                    />
                                </Col>
                                <Col className="mt-2" xs={2}><img className="img-fluid" src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${wishlist.img}`} alt="상품 이미지"/></Col>
                                <Col xs={2} className="d-flex align-items-center justify-content-center font-weight-bold font20">{wishlist.title}</Col>
                                <Col xs={2} className="d-flex align-items-center justify-content-center font20">{wishlist.bidPrice.toLocaleString()}</Col>
                                <Col xs={3}  className="d-flex align-items-center justify-content-center font20" 
                                     style={getTimeDiff(wishlist.endDtm) === '경매 종료' ? {color: 'red'} : {}}>
                                    {getTimeDiff(wishlist.endDtm)}
                                </Col>
                                <Col xs={2} className="d-flex flex-column justify-content-center">
                                    <Row className="mb-3">
                                        <BidButton halfWidth={true} state={wishlist} bool={getTimeDiff(wishlist.endDtm) === '경매 종료'}/>
                                    </Row>
                                    <Row>
                                        <Button variant="danger" className="bidhis-button w-50 mx-auto"  onClick={() => delMyWish(wishlist.prdId)}>삭제</Button>
                                    </Row>
                                </Col>
                            </Row>
                            <div className="borderBottom">{' '}</div>
                        </div>
                    ))}
                </div>
                <Button
                    style={{
                        position: 'absolute',
                        right: '20px',
                        backgroundColor: 'transparent',
                        border: 'none',
                    }}
                    onClick={scrollToTop}
                >
                    <img src="https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/icon/arrows.png" alt="상단으로 이동"/>
                </Button>
                <Row className="mt-3">
                    <Col className="d-flex justify-content-center">
                        <Button onClick={() => delMyWishs()}  className="wish-button">삭제하기</Button>
                    </Col>
                </Row>
            </Container>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>상품이 성공적으로 삭제되었습니다.</Modal.Title>
                </Modal.Header>
            </Modal>
        </div>
        </div>
    );
}

export default WishList;