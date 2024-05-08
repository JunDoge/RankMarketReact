import axios from "axios";
import Toast from 'react-bootstrap/Toast';
import {Link, useMatch} from 'react-router-dom'
import { useState, useEffect } from 'react';

function Bidding(){
    const [showToast, setShowToast] = useState(false);
    const [time, setTime] = useState(Date.now());
    const matchBid = useMatch("/mypage/transactions/bidhistory");
    const bid = (data, token) => {
        console.log(data)
        console.log(token) 
        axios.post('/bid/product',null,{
            headers: {
                'Authorization': `Bearer ${token}`,    
            },
            params: data
        }).then(r=>{
            console.log(r.data)
            setShowToast(true);  // 요청이 성공하면 Toast를 보임
            setTime(Date.now()); // 알림이 발생한 시각을 기록
        }).catch(e=>console.error(e))
    }

    // Toast 컴포넌트 정의
    const ToastComponent = () => (
        <Toast 
            onClose={() => setShowToast(false)} 
            show={showToast} 
            bg="light" 
            style={{position: 'fixed', bottom: '5%', right: '5%', color: 'black',zIndex: '9999'}}
        >
            <Toast.Header>
                <img src="https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/icon/toastIcon.svg" className="rounded me-2" alt="" />
                <strong className="me-auto">입찰 알림</strong>
                <small>{Math.floor((Date.now() - time) / 60000)} 분 전</small>
            </Toast.Header>
            <Toast.Body>입찰이 성공적으로 완료되었습니다!</Toast.Body>
            {matchBid ? null: <Toast.Body><Link to='/mypage/transactions/bidhistory' style={{ color: '#007bff' }}>입찰내역 페이지로 이동</Link></Toast.Body> }
        </Toast>
    );

    return { bid, ToastComponent };  // bid 함수와 Toast 컴포넌트를 함께 반환
}

export default Bidding;
