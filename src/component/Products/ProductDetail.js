import React, { useCallback, useEffect, useState } from 'react';
import { Button, Col, Container, Fade, Image, Row, Tab, Tabs } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { viewProduct } from "../../api/Popular";
import '../../css/Products/ProductDetail.css'; // CSS 파일 임포트
import Bidding from "../../api/Bidding";
import WatchSVG from './WatchSVG';
import BidButton from '../../api/BidButton';

function ProductDetail() {
    const location = useLocation();
    const [products, setProduct] = useState({
        prdId: location.state.prdId,
        title: '',
        sellPrice: 0,
        bidPrice: 0,
        highPrice: 0,
        ieastPrice: 0,
        des: '',
        endDtm: ' ',
        imgs: []
    });
    const [mainImg, setMainImg] = useState();
    const [open, setOpen] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();

    const { bid, ToastComponent } = Bidding();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const ImageChange = useCallback((img) => {
        setOpen(false);
        setTimeout(() => {
            setMainImg(`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${img}`);
            setOpen(true);
        }, 250);
    }, []);

    useEffect(() => {
        const prdId = location.state.prdId;
        axios.get(`product/detail/${prdId}`).then(r => {
            setProduct(prevState => ({...prevState, ...r.data.response}));
            setMainImg(`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${r.data.response.imgs[0]}`);
            viewProduct(r.data.response);
        }).catch(e => {
            navigate('/error');
        });
    }, [location.state.prdId, navigate]);
    
    const getTimeDiff = (endDtm) => {
        const [date, time] = endDtm.split(' ');
        const [year, month, day] = date.split('/');
        const [hour, minute, second] = time.split(':');

        const endTime = new Date(`20${year}`, month - 1, day, hour, minute, second);
        const diffTime = endTime.getTime() - currentTime.getTime();

        if (diffTime < 0) {
            return '경매 종료';
        } else {
            const diffSeconds = Math.floor(diffTime / 1000);
            const diffMinutes = Math.floor(diffSeconds / 60);
            const diffHours = Math.floor(diffMinutes / 60);
            const diffDays = Math.floor(diffHours / 24);
            return `${diffDays}일 ${diffHours % 24}시간 ${diffMinutes % 60}분 ${diffSeconds % 60}초`;
        }
    }
    const handleSelect = (eventKey) =>{
        return eventKey === 1 ? true : false
    }
    return (
        <Container className="product-detail">
            <ToastComponent />
            <Row>
                <Col md={6}>
                    <Fade in={open}>
                        <div>
                            <Image src={mainImg} className="product-main-image" fluid />
                        </div>
                    </Fade>
                    <Row className="subImag justify-content-center">
                        {products.imgs.slice(0, 8).map((img, index) => (
                            <Col key={index} xs={3} className="mt-2">
                                <Image src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${img}`} className="product-sub-image" fluid onClick={() => ImageChange(img)} />
                            </Col>
                        ))}
                    </Row>
                </Col>
                <Col md={6}>
                    <p className="dynamic-font-size">{products.title}</p>
                    <hr />
                    <p className="dynamic-font orange">시작가격</p>
                    <p className="dynamic-font-size orange">₩{products.sellPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    <hr />
                    <p className="dynamic-font green">현재 입찰된 가격</p>
                    <p className="dynamic-font-size">₩{products.bidPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    
                    {/* WatchSVG 추가 */}
                    <p className="dynamic-font"><WatchSVG />{getTimeDiff(products.endDtm)}</p>
                    <hr />
                    <p className="dynamic-font gray">최고 가격</p>
                    <p className="dynamic-font-size">₩{products.highPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                    <Row>
                        <Col className="d-flex justify-content-center">
                            <BidButton state={products} bool={getTimeDiff(products.endDtm) === '경매 종료'} />
                        </Col>
                    </Row>
                </Col>
            </Row>
<Row>
  <Col>
    <div className='product-des'></div>
    <div className='detail-nav'>
    <Tabs defaultActiveKey="des" className="nav-tabs">
      <Tab eventKey="des" title="상세정보" className="nav-item">
        <div className="tab-content">
          {products.des}
        </div>
      </Tab>
      <Tab eventKey="significant" title="특이사항" className="nav-item">
        <div className="tab-content">
          {products.significant ? products.significant :"없음"}
        </div>
      </Tab>
    </Tabs>
    </div>
    <div className='product-end'> </div>
  </Col>
</Row>

        </Container>
    )
}
export default ProductDetail;
