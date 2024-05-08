import React, {useEffect, useState} from "react";
import {Col, Container, Image, Row, Button, CardTitle, Card} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import "../../css/Products/Products.css";
import axios from "axios";

// 경매남은시간 타이머 SVG 애니메이션 WatchSVG.js 임포트
import WatchSVG from './WatchSVG';

function Products() {
    const [products, setProducts] = useState([]);
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const [heart, setHeart] = useState(["🤍","❤️"])
    const [prdNm, setPrdNm] = useState(new URLSearchParams(window.location.search).get('prd'));

    const navigate = useNavigate();
    const [currentTime, setCurrentTime] = useState(new Date());
    // 경매종료 필터상태를 추가함
    const [filterAuctionEnd, setFilterAuctionEnd] = useState(false);

    // 경매 상태 필터링 함수 추가
    const filterProductsByAuctionState = (product) => {
        return !filterAuctionEnd || getTimeDiff(product.endDtm) !== '경매 종료';
    }

    // 필터 변경하는 핸들러 추가함
    const handleFilterChange = () => {
        setFilterAuctionEnd(prevState => !prevState);
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
        setPrdNm(new URLSearchParams(window.location.search).get('prd'));
    }, [window.location.search]);

    const loadProducts = () => {
        
        const headers = window.localStorage.getItem("token") != null ? {'Authorization': `Bearer ${window.localStorage.getItem("token")}`} : {};
        const params =  {prdNm : prdNm, pageNum : `${products.length}`}
        console.log(params)
        axios.get('/products', { headers:headers, params:params })
            .then(r => {
                console.log(r.data)
                const newProducts = r.data.response;
                if (newProducts.length === 0)
                    setHasMoreItems(false);
                else
                    setProducts(prevProducts => [...prevProducts, ...newProducts]);
            })
            .catch(error => {
                console.error('데이터를 불러오는 중 에러가 발생했습니다: ', error);
                navigate('/error')
            });
    }

    useEffect(() => {
        setProducts([]);
        loadProducts();
    }, [prdNm]);

    const changeHeart = (e, product) =>{
        e.stopPropagation();

        if (window.localStorage.getItem("token") == null){
            return null;
        }
        else{
            axios.get('/update/wish',{
                headers: {
                    'Authorization': `Bearer ${window.localStorage.getItem("token")}`
                },params:{
                    "prdId":[product.prdId]
                },paramsSerializer:paramObj => {
                    const params = new URLSearchParams()
                    for(const key in paramObj){
                        params.append(key, paramObj[key])
                    }
                    return params.toString()
                }
            }).then(r => {
                console.log(r.data)
                setProducts(prevProducts =>
                    prevProducts.map(p =>
                        p.prdId === product.prdId ? {...p, wish: !p.wish} : p
                    )
                );
            })
        }
    }

    function fetchMoreData() {
        loadProducts();
    }

    // 시간 차이를 계산하는 함수
    const getTimeDiff = (endDtm) => {
        // "17/02/24 00:00:00" 형식을 파싱하는 코드
        const [date, time] = endDtm.split(' ');
        const [year, month, day] = date.split('/');
        const [hour, minute, second] = time.split(':');

        // Date 의 월은 0부터 시작하기 때문에 -1을 해줍니다.
        // 또한, Date는 년, 월, 일 순서로 날짜를 받습니다.
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

    return (
        <div className="productsMain">
            <Container>
                {/* 경매필터버튼을 체크박스로 변경하고 오른쪽으로 정렬함 */}
                <div className="d-flex justify-content-end">
                    <div className="checkbox-wrapper-10">
                        <input 
                            type="checkbox" 
                            id="cb5" 
                            className="tgl tgl-flip" 
                            checked={!filterAuctionEnd} 
                            onChange={handleFilterChange}
                        />
                        <label 
                            htmlFor="cb5" 
                            data-tg-on="경매종료 상품 숨기기" 
                            data-tg-off="모든상품 보기" 
                            className="tgl-btn"
                        ></label>
                    </div>
                </div>

                <br></br>
                <InfiniteScroll
                    dataLength={products.length}
                    next={fetchMoreData}
                    hasMore={hasMoreItems}
                    loader={<h4>상품을 불러오는 중...</h4>}
                    endMessage={
                        <p style={{ textAlign: "center" }}>
                            <b>모든 상품을 다 불러왔습니다.</b>
                        </p>
                    }
                    style={{ overflow: 'visible' }}
                >
                    <Row xs={1} md={4} className="g-4">
                        {/* {products.map((product, index) => (  를 아래와 같이 변경함*/ }
                        {products.filter(filterProductsByAuctionState).map((product, index) => (
    <Col
        key={index}
        xs={12} // 매우 작은 화면에서는 한 줄에 한 카드만 표시
        sm={6}  // 작은 화면에서는 한 줄에 두 카드 표시
        md={4}  // 중간 화면에서는 한 줄에 세 카드 표시
        lg={3}  // 큰 화면에서는 한 줄에 네 카드 표시
        xl={3}  // 매우 큰 화면에서도 한 줄에 네 카드 표시
        className="product-col mb-3"
        onClick={() => navigate(`/product/detail/${product.prdId}`,{state:{prdId:product.prdId}})}
    >{/* getTimeDiff(product.endDtm) !== '경매 종료' && */}
                                <Card className="GlassMop">
                                    <Card.Body>
                                <Card.Img variant="top" src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${product.img}`} rounded fluid />
                                <div>
                                    <div className="product-containe">
                                        <CardTitle className="product-title">{product.title}</CardTitle>
                                        <div className="heart" id={product.prdId} onClick={(e)=>{changeHeart(e,product)}} style={{cursor: "pointer"}}>
                                            {product.wish ? heart[1] : heart[0]}</div>
                                            <Card.Text><div>₩{product.sellPrice.toLocaleString() }</div></Card.Text>
                                    </div>
                                    
                                    
                                    
                                </div>
                                </Card.Body>
                                <Card.Footer>
          <small className="text-muted">
            <div className="left_product">
                <WatchSVG/>
            </div>
            <div className="right_product" style={getTimeDiff(product.endDtm) === '경매 종료' ? {color: 'red'} : {}}>{getTimeDiff(product.endDtm)} </div></small>
        </Card.Footer>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </InfiniteScroll>
            </Container>
        </div>
    );
}

export default Products;
