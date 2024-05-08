import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import '../css/Error.css'
import '../css/PaySuccess.css'
import axios from "axios";

function Success(){
    const navigate = useNavigate()
    let date = new Date()
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const url = new URLSearchParams(window.location.search);
    const amount = url.get('amount')
    const ids = url.get('ids')
    const prd= JSON.parse(url.get('prdinfo'))
    const prdId = `${year}${month}${day}${JSON.parse(url.get('prdinfo'))[0].prd_id}`;

    useEffect(() => {

        const formdata = new FormData()
        prd.forEach((item) => {
            console.log(item.prd_id)
            formdata.append('prd_id',item.prd_id)
            console.log(item.pay_prc)
            formdata.append('pay_prc',item.pay_prc)
            })
            formdata.append('title',ids)
        console.log(formdata)
        console.log(date)
        axios.post('/payment',formdata,{
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`}
        }).then(

        ).catch(e=>
            console.log(e))
        }, []);

    

    return(
        <div className="paySussees">
            <div className="receipt">
            <div className="receipt__holder">
            <div className="receipt__headline">
                <h4 className="headline__title receipt__title">결제 완료!</h4>
            </div>
            <div className="receipt__paper">
                <div className="receipt__info">
                <div className="receipt__block">
                    <label>결제코드</label>
                    <p>{prdId}</p>
                </div>
                <div className="receipt__block">
                    <label>상품명</label>
                    <p>{ids}</p>
                </div>
                <div className="receipt__block">
                    <label>결제금액:</label><strong className="receipt__price">{amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원</strong>
                </div>
                </div>
                <div className="receipt__actions is-flex-centered is-print-hidden">
                    <div className="paysusses_button">
                    <button className="btn btn-prev" onClick={()=>{ navigate(-1)}}>이전페이지</button>
                    <button className="btn btn-main" onClick={() => { navigate('/mypage/transactions/payhistory')}}>결제페이지</button>
                    </div>
                </div>
            </div>
            <div className="receipt__footer is-print-hidden">
            </div>
            </div>
        </div>
      </div>
    )
}
export default Success
