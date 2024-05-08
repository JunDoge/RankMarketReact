import {Link, Route, Routes, useMatch} from "react-router-dom";
import '../../css/MyPage/Transactions.css'
import PrdReview from "./PrdReview";
import Review from "./Review";
import Report from "./Report";

function Opinion(){
    const matchMyReview = useMatch("/mypage/opinion/myreview");
    const matchPrdReview = useMatch("/mypage/opinion/prdreview");
    const matchReport = useMatch("/mypage/opinion/report");
    


    return(
        <div>
            <div className="mypageNav">
                <h1>후기</h1>
            </div>
            <div className="mypageNav">
                <Link className={`btn btn-primary transButton ${matchMyReview ? "active" : ""}`} to="/mypage/opinion/myreview">내가쓴리뷰</Link>
                <Link className={`btn btn-primary transButton ${matchPrdReview ? "active" : ""}`} to="/mypage/opinion/prdreview">내상품리뷰</Link>
                <Link className={`btn btn-primary transButton ${matchReport ? "active" : ""}`} to="/mypage/opinion/report">신고</Link>
                
            </div>
            <div className="mypageMain">
                <Routes>
                    <Route path="myreview" element={<Review />} />
                    <Route path="prdreview" element={<PrdReview />} />
                    <Route path="report" element={<Report />} />
                </Routes>
            </div>
        </div>
    )
}
export default Opinion
