import React, {useEffect, useRef} from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/swiper-bundle.css';
import '../../css/Main/MainSlide.css';
import {useNavigate} from "react-router-dom";

function MainPage() {
    const navigate = useNavigate();
    const sliderEl = useRef(null);
    useEffect(() => {
        const swiper = new Swiper(sliderEl.current, {
            spaceBetween: 0,
            effect: 'fade',
            loop: true,
            mousewheel: {
                invert: false,
            },
            pagination: {
                el: '.blog-slider__pagination',
                clickable: true,
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
                pauseOnVisibilityChange: false
            },
        });

        console.log(swiper);  // Swiper 인스턴스 출력

        if (swiper && swiper.autoplay) {
            console.log(swiper.autoplay.running);  // autoplay 상태 출력
        }

        return () => {
            if (swiper) {
                swiper.destroy(true, true);
            }
        };
    }, [sliderEl]);

    return (
        <div className="blog-slider" ref={sliderEl}>
            <div className="blog-slider__wrp swiper-wrapper">
                <div className="blog-slider__item swiper-slide">
                    <div className="blog-slider__img">
                        <img src="https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/image/mainSlice1.png" alt="First slide"/>
                    </div>
                    <div className="blog-slider__content">
                        <div className="blog-slider__title">실시간 스마트폰 경매!</div>
                        <div className="blog-slider__text">AI가 실시간으로 휴대폰을 진단, <br /> 최고가 판매를 보장합니다</div>
                        <button onClick={()=> {navigate('/products')}} className="blog-slider__button">더보기</button>
                    </div>
                </div>
                <div className="blog-slider__item swiper-slide">
                    <div className="blog-slider__img">
                        <img src="https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/image/mainSlice2.png" alt="Second slide"/>
                    </div>
                    <div className="blog-slider__content">
                        <div className="blog-slider__title">신뢰성 높은 중고 거래</div>
                        <div className="blog-slider__text">고급 AI 판정 기술을 사용해, </div>
                        <div className="blog-slider__text">적절한 인증 등급을 측정해드립니다.</div>
                    </div>
                </div>
                <div className="blog-slider__item swiper-slide">
                    <div className="blog-slider__img">
                        <img src="https://rankmarketfile.s3.ap-northeast-2.amazonaws.com/image/mianSlice3.png" alt="Third slide"/>
                    </div>
                    <div className="blog-slider__content">
                        <div className="blog-slider__title">안심 직거래 서비스</div>
                        <div className="blog-slider__text">등급을 표시하여 안심하고 믿을 수 있는</div>
                        <div className="blog-slider__text">직거래 서비스를 제공합니다.</div>
                    </div>
                </div>
            </div>
            <div className="blog-slider__pagination"></div>
        </div>
    );
}

export default MainPage;
