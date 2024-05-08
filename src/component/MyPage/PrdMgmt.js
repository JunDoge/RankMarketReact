import { Button, Col, Container, Modal, Row, Dropdown, Image, Popover, Overlay } from "react-bootstrap";
import '../../css/MyPage/PrdMgmt.css'
import { useEffect, useState, useRef } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 상품삭제 시 toast 나타내는 거 import
import DelToast from "../../api/DelToast";

function PrdMgmt() {
    const [prdmgmt, setPrdmgmt] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    // 변경시작
    const [show, setShow] = useState(new Array(prdmgmt.length).fill(false));
    const [imageIndex, setImageIndex] = useState(new Array(prdmgmt.length).fill(0));
    const target = useRef(new Array(prdmgmt.length).fill(null));
    const timerId = useRef([]); // 여기까지 추가-변경함 이미지 호버했다 안했다 반복하면 너무 빨리 지나가는 문제 해결위해 추가함
    // Toast 추가
    const { triggerToast, ToastDisplay } = DelToast();


    useEffect(() => {
        axios.get('/mypage/history/product',
            {
                headers: {
                    'Authorization': `Bearer ${window.localStorage.getItem("token")}`
                }
            }).then(r => {
                console.log(r.data)
                const newPrdmgmts = r.data.response;
                setPrdmgmt(prevsetPrdmgmts => [...prevsetPrdmgmts, ...newPrdmgmts]);
                setShow(prevShow => [...prevShow, ...new Array(newPrdmgmts.length).fill(false)]);
                setImageIndex(prevImageIndex => [...prevImageIndex, ...new Array(newPrdmgmts.length).fill(0)]);
            }).catch(e => {
                console.log(e)
                return null
            })
    }, []);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, []);

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

    const bidEnd = (prd_id) => {
        axios.post('/mypage/bidend', null, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            },
            params: {
                prdId: prd_id
            }
        }).then(r => {
            const updatedPrdmgmt = prdmgmt.map(prd => {
                if (prd.prdId === prd_id) {
                    return { ...prd, endDtm: new Date().toISOString() };
                } else {
                    return prd;
                }
            })
            setPrdmgmt(updatedPrdmgmt)
        })
    }

    function delMyprd(prd_id) {
        axios.delete(`delete/product/${prd_id}`, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            },

        }).then(r => {
            setPrdmgmt(prevPrdmgmts => prevPrdmgmts.filter(prd => prd.prdId !== prd_id));
            triggerToast();
        })
    }

    useEffect(() => {
        show.forEach((isShown, index) => {
            if (isShown && !timerId.current[index]) { // 이 부분을 변경함
                timerId.current[index] = setInterval(() => {
                    setImageIndex(prev => {
                        const newArr = [...prev];
                        newArr[index] = (newArr[index] + 1) % prdmgmt[index].imgs.length;
                        return newArr;
                    });
                }, 1500);
            } else {
                clearInterval(timerId.current[index]);
                timerId.current[index] = null; // 이 부분을 변경함
            }
        })
    }, [show, prdmgmt]);

    return (
        <div>
            <div className="mypageNav">
                <h1>상품 관리</h1>
            </div>
            <Container className="mypageMain">
                <Row className="mb-2">
                    <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>이미지</strong></Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>상품명</strong></Col>
                    <Col xs={1} className="d-flex align-items-center justify-content-center"><strong>시작가</strong></Col>
                    <Col xs={1} className="d-flex align-items-center justify-content-center"><strong>최고가</strong></Col>
                    <Col xs={1} className="d-flex align-items-center justify-content-center"><strong>현재입찰가</strong></Col>
                    <Col xs={3} className="d-flex align-items-center justify-content-center"><strong>경매 남은 시간</strong></Col>
                    <Col xs={2} className="d-flex align-items-center justify-content-center"><strong>선택</strong></Col>
                </Row>
                <div className="borderBottom"></div>
                {prdmgmt.map((prdmgmt, index) => (
                    <div key={index}>
                        <Row>
                            {/* 여기부터 */}
                            <Col className="mt-2" xs={2}>
                                <div className="img-container">
                                    <Image
                                        ref={el => target.current[index] = el}
                                        className="img-fluid"
                                        src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${prdmgmt.imgs[0]}`}
                                        alt="상품 이미지"
                                        onMouseEnter={() => {
                                            const newShow = new Array(show.length).fill(false); // 모든 Popover를 닫게 함
                                            newShow[index] = true; // 현재 상품의 Popover만 열게 하였음
                                            setShow(newShow);
                                        }}
                                        onMouseLeave={() => {
                                            const newShow = [...show];
                                            newShow[index] = false;
                                            setShow(newShow);
                                        }}
                                        onClick={() => { navigate(`/product/detail/${prdmgmt.prdId}`, { state: { prd_id: prdmgmt.prdId } }) }}
                                    />
                                </div>
                                <Overlay target={target.current[index]} show={show[index]} placement="right">
                                    {/* 여기까지 */}
                                    <Popover id="popover-basic">
                                        <Popover.Header as="h3">상품 이미지</Popover.Header>
                                        <Popover.Body>
                                            <Image src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${prdmgmt.imgs[imageIndex[index]]}`} width="200" />
                                        </Popover.Body>
                                    </Popover>
                                </Overlay>
                            </Col>
                            <Col xs={2} className="d-flex align-items-center justify-content-center font-weight-bold font20">{prdmgmt.title}</Col>
                            <Col xs={1} className="d-flex align-items-center justify-content-center font20">{prdmgmt.sellPrice.toLocaleString()}</Col>
                            <Col xs={1} className="d-flex align-items-center justify-content-center font20">{prdmgmt.highPrice.toLocaleString()}</Col>
                            <Col xs={1} className="d-flex align-items-center justify-content-center font20">{prdmgmt.bidPrice.toLocaleString()}</Col>
                            <Col xs={3} className="d-flex align-items-center justify-content-center font20"
                                style={getTimeDiff(prdmgmt.endDtm) === '경매 종료' ? { color: 'red' } : {}}>
                                {getTimeDiff(prdmgmt.endDtm)}</Col>
                            <Col xs={2} className="d-flex align-items-center justify-content-center">
                                <Row className="mb-2 mt-4">
                                    {getTimeDiff(prdmgmt.endDtm) === '경매 종료' ?
                                        <Button variant="secondary">판매종료</Button> :
                                        <Dropdown>
                                            <Dropdown.Toggle variant="danger" className="prdMgmt-button" id="dropdown-basic" disabled={getTimeDiff(prdmgmt.end_dtm) === '경매 종료'}>
                                                판매중
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                {prdmgmt.bidCnt === 0 ? null : <Dropdown.Item className="hover-yellow" onClick={() => { bidEnd(prdmgmt.prdId) }}>입찰종료</Dropdown.Item>}
                                                <Dropdown.Item className="hover-blue" onClick={() => { navigate('/mypage/productUpdate', { state: { prd_id: prdmgmt.prdId } }) }}>수정</Dropdown.Item>
                                                <Dropdown.Item className="hover-red" onClick={() => delMyprd(prdmgmt.prdId)}>삭제</Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    }
                                </Row>
                            </Col>
                        </Row>
                        <div className="borderBottom">{' '}</div>
                    </div>
                ))}
            </Container>
            {/* <Modal className='delSucModal' show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>상품이 성공적으로 삭제되었습니다.</Modal.Title>
                </Modal.Header>
            </Modal> */}
            <ToastDisplay />
        </div>
    )
}

export default PrdMgmt;
