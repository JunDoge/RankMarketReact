import React, {useEffect, useState} from 'react';
import MainSlide from "./MainSlide";
import '../../css/Main/Main.css';
import MainDescrip from "./MainDescrip";
import MainPopular from "./MainPopular";
import MainRecently from "./MainRecently";
import axios from "axios";


function Main(){
    const [popular, setPopular] = useState([])
    useEffect(() => {
        axios.get('/popular/main')
            .then(r =>{
                console.log(r.data.response)
                setPopular([...r.data.response]);
            })
    }, []);
    return (
        <div className="body"> {/* CSS 클래스 적용 */}
            <div className="component1">
                <MainSlide  />
            </div>
            <div className="component2">
                <MainDescrip />
            </div>
            <div className="component3">
                <MainPopular popular={popular}/>
            </div>
            <div className="component4">
                <MainRecently />
            </div>
        </div>
    );
};


export default Main;
