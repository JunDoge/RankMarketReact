import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import '../../src/css/BidButton.css';
import 'bootstrap/dist/css/bootstrap.min.css';
// 새로 추가
import Bidding from "./Bidding";

function BidButton({state, bool ,halfWidth}) { 
  const [showFirework, setShowFirework] = useState(false);
  const [isBidding, setIsBidding] = useState(false); // 추가

  const { bid, ToastComponent } = Bidding();

  const AddBid = (e,data) => {
    e.stopPropagation();
    if (!isBidding) { // 추가
      setIsBidding(true); // 추가
      bid({prdId: data.prdId, ieastPrice: parseInt(data.ieastPrice),highPrice: parseInt(data.highPrice)}, window.localStorage.getItem('token'))
      setShowFirework(true);
      setTimeout(() => {
        setShowFirework(false);
        setIsBidding(false); // 추가
      }, 1250); // 폭죽 터지고 초기화
    }
  }


  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      최소 입찰가 : {state.ieastPrice}원
    </Tooltip>
  );

  return (
    
      
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={renderTooltip}
    >
      
       <div style={{ display: 'flex', alignItems: 'center' }}>  
       <ToastComponent/>
      <Button
        onClick={(e)=>AddBid(e,state)}
        className="center-button reward-btn"
        variant="outline-light"
        style={{ display: 'flex', alignItems: 'center', width: halfWidth ? '50%' : 'auto', backgroundColor: bool ? '#7A7A7A': '#F27F22' }} // 버튼 내부 요소들을 가로로 나열하고, 중앙 정렬
        disabled={bool}
      >
        <span className="IconContainer">
              <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 60 20"
      className="box-top box"
    >
      <path
        strokeLinecap="round"
        strokeWidth="8"
        stroke="#ffab67"
        d="M2 18L58 18"
      ></path>
      <circle
        strokeWidth="5"
        stroke="#ffab67"
        fill="#101218"
        r="7"
        cy="9.5"
        cx="20.5"
      ></circle>
      <circle
        strokeWidth="5"
        stroke="#ffab67"
        fill="#101218"
        r="7"
        cy="9.5"
        cx="38.5"
      ></circle>
    </svg>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 58 44"
      className="box-body box"
    >
      <mask fill="white" id="path-1-inside-1_81_19">
        <rect rx="3" height="44" width="58"></rect>
      </mask>
      <rect
        mask="url(#path-1-inside-1_81_19)"
        strokeWidth="8"
        stroke="#ffab67"
        fill="#101218"
        rx="3"
        height="44"
        width="58"
      ></rect>
      <line
        strokeWidth="6"
        stroke="#ffab67"
        y2="29"
        x2="58"
        y1="29"
        x1="-3.61529e-09"
      ></line>
      <path
        strokeLinecap="round"
        strokeWidth="5"
        stroke="#ffab67"
        d="M45.0005 20L36 3"
      ></path>
      <path
        strokeLinecap="round"
        strokeWidth="5"
        stroke="#ffab67"
        d="M21 3L13.0002 19.9992"
      ></path>
    </svg>
    <span className="coin"></span>
        </span>
        <span className="ms-1 text">입찰하기</span>
        <div id="firework-effect" className={showFirework ? 'show' : ''}>
          <div className="firework"></div>
        </div>
      </Button>
      </div>       
    </OverlayTrigger>

  );
}

export default BidButton;
