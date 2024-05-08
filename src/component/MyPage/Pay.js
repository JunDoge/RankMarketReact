import React, {useEffect, useState} from 'react';
import PayApi from '../../api/PayApi';
import {useNavigate} from 'react-router-dom';
import '../../css/MyPage/Pay.css';
import {Col, Container, Row} from 'react-bootstrap';
import axios from "axios";

function Pay() {
    const navigate = useNavigate();
    PayApi('https://js.tosspayments.com/v1/payment-widget');

    const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';
    const customerKey = 'YbX2HuSlsC9uVJW6NMRMj';
    const [pay, setPay] = useState([])
    const [totalPrice, setTotalPrice] = useState(0);
    const [fee, setFee] = useState(0);
    const [finalPrice, setFinalPrice] = useState(0);
    const [checkedItems, setCheckedItems] = useState([]);
 
    useEffect(() => {
        axios.get('/mypage/history/pay',{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`},
            params:{
                status: '1'
            }
        }).then(r =>{
            console.log(r.data)
            const newPay = r.data.response;
            setPay(prevsetPay => [...prevsetPay, ...newPay]);
        }).catch(e =>{
            navigate('/error')
        })

    }, []);
    const payment = () => {
        if (window.PaymentWidget) {
            /* 결제 위젯 영역 렌더링 */
            const paymentWidget = window.PaymentWidget(clientKey, customerKey);
            paymentWidget.renderPaymentMethods('#payment-method', finalPrice);

            /* 약관 영역 렌더링 */
            paymentWidget.renderAgreement('#agreement');

            /* 결제창 열기 */
            document.querySelector("#payment-button").style.visibility = "visible";
            document.querySelector("#payment-button").addEventListener("click", () => {
                const today = new Date();
                const yyyy = today.getFullYear();
                let mm = today.getMonth() + 1;
                let dd = today.getDate();
                if (mm < 10) mm = '0' + mm;
                if (dd < 10) dd = '0' + dd;
                const date = '' + yyyy + mm + dd;

                const ids = checkedItems.map(item => item.prdId).join('');

                paymentWidget.requestPayment({
                    orderId: date + ids, // 수정된 부분
                    orderName: checkedItems.length > 1 ? `${checkedItems[0].title} 및 ${checkedItems.length - 1}개` : checkedItems[0].title,
                    successUrl: `http://rankmarket.store/success?ids=${checkedItems.length > 1 ? `${checkedItems[0].title} 및 ${checkedItems.length - 1}개` : checkedItems[0].title}
                    &prdinfo=${encodeURIComponent(JSON.stringify(checkedItems))}&`,
                    failUrl: 'http://rankmarket.store',
                    amount: finalPrice
                }).catch(function (error) {
                    if (error.code === 'USER_CANCEL') {
                        navigate('/');
                    } if (error.code === 'INVALID_CARD_COMPANY') {
                        navigate('/error');
                    }
                });
            });
        }
    }

    useEffect(() => {
        setFee(totalPrice * 0.1);
    }, [totalPrice]);
    useEffect(() => {
        setFinalPrice(totalPrice + fee);
    }, [totalPrice, fee]);

    return (
        <div>
            <div className="mypageNav">
                <h1>결제</h1>
            </div>
            <div className="mypageMain">
                <div className="pay-main">
                    <div className="pay-left">
                        {pay.map((pay,index) => (
                            <Container fluid className="payItem" key={index}>
                                <Row>
                                    <Col xs={12} md={2}>
                                        <input
                                            type="checkbox"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setTotalPrice(totalPrice + Number(pay.winPrice));
                                                    // 체크한 상품 추가
                                                    setCheckedItems([...checkedItems, {title: pay.title, prdId: pay.prdId, payPrice: pay.winPrice}]);
                                                } else {
                                                    setTotalPrice(totalPrice - Number(pay.winPrice));
                                                    // 체크 해제한 상품 제거
                                                    setCheckedItems(checkedItems.filter(item => item.prdId !== pay.prdId));
                                                }
                                            }}
                                        />
                                    </Col>
                                    <Col xs={12} md={3}><img className="item-image" src={`https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/${pay.img}`} alt={pay.title} /></Col>
                                    <Col xs={12} md={3}><h2 className="item-title">{pay.title}</h2></Col>
                                    <Col xs={12} md={3}><p className="item-price">{pay.winPrice.toLocaleString()}</p></Col>
                                </Row>
                            </Container>
                        ))}
                    </div>
                    <div className="pay-right">
                        <div className="title"></div>
                        <div id="payment-method"></div>
                        <div id="agreement"></div>
                        <div className="total">
                            <div className="totalItem">
                                <p className="payTitle">합계금액:</p>
                                <p className="payPrice">₩{totalPrice.toLocaleString()}</p>
                            </div>
                            <div className="totalItem">
                                <p className="payTitle">결제 수수료:</p>
                                <p className="payPrice">₩{fee.toLocaleString()}</p>
                            </div>
                            <div className="totalItem">
                                <p className="payTitle">총 결제금액:</p>
                                <p className="payPrice">₩{finalPrice.toLocaleString()}</p>
                            </div>
                        </div>
                        <div className="buttons">
                            <button className="btn btn-continue" onClick={() => navigate('/products')}>쇼핑 계속하기</button>
                            <button className="btn btn-openpay" onClick={payment}>결제창띄우기</button>
                        </div>
                        <div className="paycenter-button">
                            <button className="btn btn-primary btn-pay" id="payment-button" style={{visibility: "hidden"}}>결제하기</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pay;
