import {Link, useMatch} from 'react-router-dom';
import '../../css/MyPage/Sidebar.css';

function Sidebar({usrNm}) {
    const match = useMatch("/:path");

    const getClassName = (path) => match && match.path === path ? "sidebarLink sidebar-active" : "sidebarLink";

    return (
        <div className="sidebar">
            <div className="sidebarNav">
                <p className="sidearNavText">{usrNm}님</p>
                <p className="sidearNavText">환영합니다</p>
            </div>
            <div className="sidebarMain">
                <Link to="/mypage/usrUpdate" className={getClassName("/mypage/usrUpdate")}>개인정보수정</Link><p/>
                <Link to="/mypage/prdmgmt" className={getClassName("/mypage/prdmgmt")}>상품관리</Link><p/>
                <Link to="/mypage/transactions" className={getClassName("/mypage/transactions")}>거래내역</Link><p/>
                <Link to="/mypage/pay" className={getClassName("/mypage/pay")}>결제</Link><p/>
                <Link to="/mypage/chatroom" className={getClassName("/mypage/chatroom")}>채팅방</Link><p/>
                <Link to="/mypage/wishlist" className={getClassName("/mypage/wishlist")}>찜 목록</Link><p/>
                <Link to="/mypage/opinion" className={getClassName("/mypage/opinion")}>후기</Link><p/>
            </div>
        </div>
    );
}

export default Sidebar;
