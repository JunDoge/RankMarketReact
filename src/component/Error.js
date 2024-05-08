import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import '../css/Error.css'

function Error({setIsLoggedIn}){
    let navgate = useNavigate()

    const [time, setTime] = useState(30)
    useEffect(()=>{
        let nav = setTimeout(()=>{navgate('/')
                    setIsLoggedIn(false);
                localStorage.removeItem("token");
    },30000)
        return ()=>{clearTimeout(nav)}
    },[])

    useEffect(() => {
        setTimeout(()=>{setTime(time-1)},1000)
    }, [time]);

    return(
        <div className="errorMain">
            <div className="errorComponent">
                <img src="https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/icon/error.png" alt="이미지 설명" className="img-fluid-custom"/>
                <h1>요청하신 페이지에 접근 권한이 없습니다.</h1>
                <p>연결하려는 페이지에 접근 권한이 없어 접근이 거부되었습니다.</p>
                <p>서비스 이용에 불편을 드려 죄송합니다.</p>
                <p>{time}초뒤에 메인페이지로 이동합니다.</p>
                <button className="btn btn-prev" onClick={()=>{ navgate(-1)}}>이전페이지</button>
                <button className="btn btn-main" onClick={() => { navgate('/')
                                                                setIsLoggedIn(false);
                                                                localStorage.removeItem("token");         
            }}>메인페이지로</button>
            </div>
        </div>
    )
}
export default Error
