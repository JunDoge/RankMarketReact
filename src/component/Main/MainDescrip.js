import React from 'react';
import {Col, Row} from 'react-bootstrap';
import "../../css/Main/MainDescrip.css"

function MainDescrip() { {/* 메인 설명 컴포넌트 */}
    return (
        <Row className="mainDescrip">
            <Col md={4}>
                <h2>안전하고, 믿음직한</h2>
                <h2>중고 경매 거래</h2>
            </Col>
            <Col md={4}>
                <img src='https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/icon/mainDescriptAi.png' alt='mainDescriptAi'/>
                <h3>AI</h3>
                <p>정확하고 빠른 AI분석으로</p>
                <p>내 물건의 시세를 조회할 수 있습니다!</p>
            </Col>
            <Col md={4}>
                <img src='https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/icon/mainDescriptChart.png' alt='mainDescriptChart'/>
                <h3>실시간 인기경매 차트</h3>
                <p>가장 품질이 좋은 중고 경매 상품을</p>
                <p>실시간으로 조회가능합니다!</p>
            </Col>
        </Row>
    );
}

export default MainDescrip;
