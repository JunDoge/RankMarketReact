import React from "react";
import '../css/Footer.css';

function Foooter(){
    return (
        <div className="footer">
            <svg width="100%" height="200px" viewBox="0 0 1366 1366" preserveAspectRatio="none">
                <defs>
                    <radialGradient id="backgroundGradient" cx="100%" cy="0%" r="100%">
                        <stop offset="0%" style={{stopColor:"#fff"}}/>
                        <stop offset="100%" style={{stopColor:"#fff"}}/>
                    </radialGradient>
                </defs>
                <rect viewBox="0 0 1366 1390" fill="url(#backgroundGradient)" width="100%" height="0%" opacity="1.0"></rect>
                <path d="M0 0 H2732" id="motion"/>
                <path d="M2732 0 H0" id="motion-reverse"/>
                <g fill="#FF9900">
                    <g opacity="0.9">
                        <path d="M821.493,1245.502 C1016.37,1150.47 1215.09,1131 1366,1131 L1366,1365 L0,1365 L0,1295.568 C281.988431,1295.56995 536.909,1384.278 821.493,1245.502 Z"></path>
                        <path className="reflect" d="M821.493,1245.502 C1016.37,1150.47 1215.09,1131 1366,1131 L1366,1365 L0,1365 L0,1295.568 C281.988431,1295.56995 536.909,1384.278 821.493,1245.502 Z"></path>
                        <path className="translate" d="M821.493,1245.502 C1016.37,1150.47 1215.09,1131 1366,1131 L1366,1365 L0,1365 L0,1295.568 C281.988431,1295.56995 536.909,1384.278 821.493,1245.502 Z"></path>
                        <animateMotion
                            dur="80s"
                            repeatCount="indefinite"
                            rotate="auto"
                            keyPoints="0;0.5;0.75"
                            keyTimes="0;0.33;0.66"
                            calcMode="linear">
                            <mpath href="#motion"/>
                        </animateMotion>
                    </g>
                    <g opacity="0.5">
                        <path d="M1366,1142 L1366,1365 L0,1365 L0,1305.90997 C221.894,1305.91495 536.909,1396.171 821.493,1270.283 C1016.37,1184.077 1215.09,1142 1366,1142 Z"></path>
                        <path className="reflect" d="M1366,1142 L1366,1365 L0,1365 L0,1305.90997 C221.894,1305.91495 536.909,1396.171 821.493,1270.283 C1016.37,1184.077 1215.09,1142 1366,1142 Z"></path>
                        <path className="translate" d="M1366,1142 L1366,1365 L0,1365 L0,1305.90997 C221.894,1305.91495 536.909,1396.171 821.493,1270.283 C1016.37,1184.077 1215.09,1142 1366,1142 Z"></path>
                        <animateMotion dur="80s"
                                       repeatCount="indefinite"
                                       rotate="auto-reverse"
                                       keyPoints="0;0.7;0.66"
                                       keyTimes="0;0.33;0.66">
                            <mpath href="#motion-reverse"/>
                        </animateMotion>
                    </g>
                    <g opacity="0.4">
                        <path d="M634.493,1300.928 C842.464506,1248.14173 1215.09,1180 1366,1180 L1366,1365.115 L0,1365.115 L0,1335.403 C236.5,1335.40002 452.004736,1347.24625 634.493,1300.928 Z"></path>
                        <path className="reflect" d="M634.493,1300.928 C842.464506,1248.14173 1215.09,1180 1366,1180 L1366,1365.115 L0,1365.115 L0,1335.403 C236.5,1335.40002 452.004736,1347.24625 634.493,1300.928 Z"></path>
                        <path className="translate" d="M634.493,1300.928 C842.464506,1248.14173 1215.09,1180 1366,1180 L1366,1365.115 L0,1365.115 L0,1335.403 C236.5,1335.40002 452.004736,1347.24625 634.493,1300.928 Z"></path>
                        <animateMotion dur="90s"
                                       repeatCount="indefinite"
                                       rotate="auto"
                                       keyPoints="0;1;0"
                                       keyTimes="0;0.5;1"
                                       calcMode="linear">
                            <mpath href="#motion"/>
                        </animateMotion>
                    </g>
                </g>
            </svg>
        </div>
    );
};

export default Foooter;
