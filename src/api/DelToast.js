import { useState } from 'react';
import Toast from 'react-bootstrap/Toast';

function DelToast() {
    const [showToast, setShowToast] = useState(false);
    const [time, setTime] = useState(Date.now());

    const triggerToast = () => {
        setShowToast(true);
        setTime(Date.now());
    }

    const hideToast = () => setShowToast(false);

    const ToastDisplay = () => (
        <Toast 
            onClose={hideToast} 
            show={showToast} 
            bg="light" 
            style={{position: 'fixed', bottom: '5%', right: '5%', color: 'black'}}
        >
            <Toast.Header>
                <img src="https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/icon/toastIcon.svg" className="rounded me-2" alt="" />
                <strong className="me-auto">삭제 알림</strong>
                <small>{Math.floor((Date.now() - time) / 60000)} 분 전</small>
            </Toast.Header>
            <Toast.Body>상품이 성공적으로 삭제되었습니다!</Toast.Body>
        </Toast>
    );

    return { triggerToast, ToastDisplay };
}

export default DelToast;
