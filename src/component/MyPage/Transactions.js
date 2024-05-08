import {Link, Route, Routes, useMatch} from "react-router-dom";
import BidHistory from "./BidHistory";
import WinHistory from "./WinHistory";
import PayHistory from "./PayHistory";
import '../../css/MyPage/Transactions.css'

function Transactions(){
    const matchBid = useMatch("/mypage/transactions/bidhistory");
    const matchWin = useMatch("/mypage/transactions/winhistory");
    const matchPay = useMatch("/mypage/transactions/payhistory");

    return(
        <div>
            <div className="mypageNav">
                <h1>거래내역</h1>
            </div>
            <div className="mypageNav d-flex align-items-center justify-content-center text-center">
                <Link className={`btn btn-primary transButton ${matchBid ? "active" : ""}`} to="/mypage/transactions/bidhistory">입찰내역</Link>
                <Link className={`btn btn-primary transButton ${matchWin ? "active" : ""}`} to="/mypage/transactions/winhistory">낙찰내역</Link>
                <Link className={`btn btn-primary transButton ${matchPay ? "active" : ""}`} to="/mypage/transactions/payhistory">결제내역</Link>
            </div>
            <div className="mypageMain">
                <Routes>
                    <Route path="bidhistory" element={<BidHistory />} />
                    <Route path="winhistory" element={<WinHistory />} />
                    <Route path="payhistory" element={<PayHistory />} />
                </Routes>
            </div>
        </div>
    );
}

export default Transactions;
