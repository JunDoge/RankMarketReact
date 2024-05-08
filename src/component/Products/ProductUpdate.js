import React, { useState, useEffect } from 'react';
import '../../css/Products/ProductAdd.css';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function ProductUpdate() {
    const navigate = useNavigate();
    const location = useLocation();
    const [product, setProduct] = useState({
        prdId: location.state.prdId,
        title: '',
        sellPrice: '',
        des: '',
        ieastPrice: '',
        significant: '',
    });

    // 페이지 로드 시 상품 정보를 가져오는 함수
    useEffect(() => {
        axios.get(`/product/detail/${location.state.prdId}`).then(response => {
            const data = response.data.response; // 상품 정보가 이 경로에 위치한다고 가정
            setProduct(prevState => ({
                ...prevState,
                title: data.title,
                sellPrice: data.sellPrice,
                des: data.des,
                ieastPrice: data.ieastPrice,
                significant: data.significant,
            }));
        }).catch(error => {
            console.log(error);
            navigate('/error');
        });
    }, [location.state.prdId, navigate]);

    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        setProduct({
            ...product,
            [name]: value
        });
    };

    const submitForm = (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (const key in product) {
            formData.append(key, product[key]);
        }

        console.log(`토큰임? ${window.localStorage.getItem("token")}`)


        axios.put('/product/update', formData, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`,
                'Content-Type': 'multipart/form-data',
            }
        })
        .then(response => {
            navigate('/mypage/prdmgmt');
            console.log(response.data);
        })
        .catch(error => {
            console.log(error);
        });
    };

    return (
        <div>
            <div className="productadd-header">
                <h2>상품 수정</h2>
                <p>*필수 입력</p>
            </div>
            <div className="bottom-line border-bottom"></div>
            <Container fluid="md" className="mt-4">
                <Row className="justify-content-center">
                    <Col xs={12} md={10}>
                        <Form className="productadd-form" onSubmit={submitForm}>
                            <Form.Group className="mb-3 custom-input productAddInput">
                                <Form.Label>제목*</Form.Label>
                                <Form.Control type="text" name="title" value={product.title} onChange={onChangeHandle} />
                            </Form.Group>
                            <Form.Group className="mb-3 custom-input productAddInput">
                                <Form.Label>시작가*</Form.Label>
                                <Form.Control type="text" name="sellPrice" value={product.sellPrice} readOnly />
                            </Form.Group>
                            <Row>
                                <Form.Group className="mb-3 ieast productAddInput" style={{width:"50%"}}>
                                    <Form.Label>경매 최소 가격*</Form.Label>
                                    <Form.Control as="select" name="ieastPrice" value={product.ieastPrice} onChange={onChangeHandle}>
                                        <option value="1000">1000</option>
                                        <option value="5000">5000</option>
                                        <option value="10000">10000</option>
                                    </Form.Control>
                                </Form.Group>
                            </Row>
                            <Form.Group className="mb-3 productAddInput">
                                <Form.Label>상품 상세 정보*</Form.Label>
                                <Form.Control as="textarea" name="des" value={product.des} onChange={onChangeHandle} rows={3} />
                            </Form.Group>
                            <Form.Group className="mb-3 productAddInput">
                                <Form.Label>특이사항</Form.Label>
                                <Form.Control as="textarea" name="significant" value={product.significant} onChange={onChangeHandle} rows={2} />
                            </Form.Group>
                            <Row className="justify-content-end">
                                <Col xs={6} md={2}>
                                    <Button variant="light" style={{color: '#F27F22', width: '100%', fontSize: '0.75rem', borderColor: '#F27F22'}} type="button" onClick={() => navigate(-1)}>
                                        취소하기
                                    </Button>
                                </Col>
                                <Col xs={6} md={2}>
                                    <Button variant="primary" style={{width: '100%', fontSize: '0.75rem'}} type="submit">
                                        수정하기
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default ProductUpdate;
