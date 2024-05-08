import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import '../css/SocialLogin/LoginLoding.css'

function KakaoCode({ setIsLoggedIn }){
    const navigate = useNavigate();
    const url = new URLSearchParams(window.location.search);
    const code = url.get("code")
    useEffect(() => {
      axios.get(`/oauth/kakao/${code}`).then((r) => {

          const mail = r.data.response.mail
          const usr_nm = r.data.response.usrNm
          const token = r.headers['authorization'];
          if (mail != null) {
              navigate('/singup', {state: {mail : mail, usr_nm: usr_nm, token: token}});
          } else {
              localStorage.setItem('usrNm', r.data.response.usrNm)
              localStorage.setItem('token', token);
              navigate('/');
              setIsLoggedIn(true);
          }
      }).catch((error) => {
          console.log(error);
          navigate('/');
      });
    }, [code, navigate, setIsLoggedIn]);

    return(
        <div className="LoginMain">
            <div className="LoginComponent">
                <div className="face-load">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                <h1>로그인중...</h1>
            </div>
        </div>
    )
};
export default KakaoCode;
