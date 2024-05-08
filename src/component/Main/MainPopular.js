import React, {useEffect, useState} from 'react';
import {Col, Row} from 'react-bootstrap';
import '../../css/Main/MainPopular.css';
import {useNavigate} from "react-router-dom";
import BidButton from '../../api/BidButton';


const imageURL = 'https://cdn.011st.com/11dims/resize/600x600/quality/75/11src/product/2184971348/B.jpg?63000000';

function DismissibleExample() {
    const [showA, setShowA] = useState(true);
    const toggleShowA = () => setShowA(!showA);
}

function MainPopular(props) {
    const navigate = useNavigate();
    
    
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        let viewedProducts = localStorage.getItem('viewedProducts');
        viewedProducts = viewedProducts ? JSON.parse(viewedProducts) : [];
        setRecentProducts(viewedProducts);
    }, []);
    return (
        <div className="component">
            <Row>

                {props.popular.map((popular, index)=> {
                    return (
                        
                        index === 0 ?
                            <Col xs={12} md={4} key={index} onClick={()=>{navigate(`/product/detail/${popular.prdId}`,{state:{prdId:popular.prdId}})}}
                            
                            // 아래 요소 때문에 toast 가 이상한 위치에 나옴
                            //  style={{ transition: 'transform 0.1s ease-in-out' }}
                            // onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            // onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div                 
                                            //  위 요소를 div 안에 넣음
                                style={{ transition: 'transform 0.1s ease-in-out' }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                                <h4>실시간 인기 경매</h4>
                                <img src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${popular.img}`}
                                     alt="이미지 설명" className="img-fluid"/>
                                
                                <p>{popular.title}</p>
                                </div>
                                <BidButton state={popular}/>  
                                
                            </Col>: null
                    )
                })}
                
                <Col xs={12} md={4} className="mt-5">
                    {props.popular.map((popular, index)=>{
                        return(
                            index === 0 ? null :
                            <Row className="mb-5" key={index}>
                            <Col xs={3} onClick={()=>{navigate(`/product/detail/${popular.prdId}`,{state:{prdId:popular.prdId}})}}>
                                <div
                                    style={{ transition: 'transform 0.1s ease-in-out' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <img src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${popular.img}`} alt="이미지 설명" className="img-fluid-custom"/>
                                </div>
                            </Col>
                            <Col xs={6} className="d-flex flex-column justify-content-between">
                                <div
                                    style={{ transition: 'transform 0.1s ease-in-out' }}
                                    onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                    onClick={()=>{navigate(`/product/detail/${popular.prdId}`,{state:{prdId:popular.prdId}})}}
                                >
                                    <p>{popular.title}</p>
                                </div>
                                <BidButton state={popular}/> 
                            </Col>
                        </Row>

                        )
                    })}
                </Col>
                <Col xs={12} md={4}>
                    <div className="p-3 border rounded">
                        <h5 className="text-center mb-4 fs-4 fw-bold">최근 본 상품</h5>
                        {recentProducts.map((product, index) => (
                            <div key={index} onClick={()=>{navigate(`/product/detail/${product.prdId}`,{state: {prdId: product.prdId}})}}
                                // 아래 요소 때문에 toast 가 이상한 위치에 나옴
                                style={{ transition: 'transform 0.1s ease-in-out' }}
                                 onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                 onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                                 >
                                <div className="d-flex align-items-center mb-4 p-1 border rounded">
                                    <div className="flex-shrink-0">
                                        <h2 className="m-0">{index + 1}</h2>
                                    </div>
                                    <div className="flex-shrink-0 ml-3">
                                        <img src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${product.imgs[0]}`} alt="이미지 설명" className="img-fluid rounded" style={{width: '70px', height: '70px'}}/>
                                    </div>
                                    <div className="ml-3">
                                        <h5 className="m-0">{product.title}</h5>
                                        <p className="m-0">{product.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    )
}
export default MainPopular;