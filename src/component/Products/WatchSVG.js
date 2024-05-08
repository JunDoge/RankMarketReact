import React from 'react';

const WatchSVG = (props) => (
    <svg version="1.1" id="L2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
    viewBox="-4 -4 110 110" enableBackground="new 0 0 100 100" xmlSpace="preserve"
    style={{ width: '25px', height: '25px', margin: '7px', display: 'inline-block' }}
  >
    <circle fill="none" stroke="#fd7e14" strokeWidth="8" strokeMiterlimit="10" cx="50" cy="50" r="48"/>

    {/* 분침 */}
    <line fill="none" strokeLinecap="round" stroke="#fd7e14" strokeWidth="8" strokeMiterlimit="10" x1="50" y1="50" x2="50" y2="20">
      <animateTransform 
        attributeName="transform" 
        dur={props.bool ? 0 : "5s"}
        type="rotate"
        from="360 50 50"
        to="0 50 50"
        repeatCount="indefinite" />
    </line>

    {/* 시침 */}
    <line fill="none" strokeLinecap="round" stroke="#fd7e14" strokeWidth="8" strokeMiterlimit="10" x1="50" y1="50" x2="50" y2="25">
      <animateTransform 
        attributeName="transform" 
        dur={props.bool ? 0 : "4333s"}
        type="rotate"
        from="360 50 50"
        to="0 50 50"
        repeatCount="indefinite" />
    </line>
  </svg>
);

export default WatchSVG;
