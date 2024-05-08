import React, {useEffect, useState} from 'react';
import '../../css/Main/MainRecently.css';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import {useNavigate} from "react-router-dom";
import axios from "axios";

function MainRecently() {
    const navigate = useNavigate()
    const [recently , setRecently] = useState([])
    useEffect(() => {
        axios.get('/most/main').then(r =>
            {
                console.log(r.data)
                setRecently([...r.data.response]);
            }
        )

    }, []);

    return (
        <Row className="main-recently">
            <Col xs={12} className="header d-flex justify-content-between align-items-center">
                <h1 className="title">최근 등록된 상품</h1>
                <Button variant="outline-secondary" className="view-more" onClick={()=>{navigate('/products')}} >상품 더보기</Button>
            </Col>
            <Row className="item w-100">
                {
                    recently.map((recently,index)=>{
                        return(
                            <Col xs={12} md={4} key={index} className="item-col" onClick={()=>{navigate(`/product/detail/${recently.prdId}`,{state:{prd_id:recently.prdId}})}}>
                                {/*className="item-col" 추가함*/}
                                <Row>
                                <Col xs={9}>
                                    {recently.img.map((img,index) =>(
                                        index === 0 ?
                                        <Image key={index} src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${img}`} alt="메인 이미지" fluid />
                                    : null
                                    
                                    ))}
                                    
                                    </Col>
                                    <Col xs={3}>
                                    {recently.img.map((img,index)=>(
                                        index === 0 || index>3? null :
                                        <Image key={index} src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${img}`} alt={`서브이미지${index}`} fluid className="mb-3" />
                                    ))}
                                    </Col>
                                    
                                </Row>
                                <Row className="mt-3">
                                    <Col xs={12}>
                                        <h1>{recently.title}</h1>
                                    </Col>
                                </Row>
                            </Col>
                        )
                })
                }
            </Row>
        </Row>
    )
}

export default MainRecently;
