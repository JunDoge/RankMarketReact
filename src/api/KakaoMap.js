import React, { useEffect, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ko } from 'date-fns/locale';

registerLocale('ko', ko);

// 시간 선택 
const CustomTimeCaption = () => <div className="react-datepicker-time__header">시간선택</div>;

// DatePickerComponent 컴포넌트: 날짜 및 시간 선택 및 변경 시 dl_time을 업데이트하는 컴포넌트임
const DatePickerComponent = ({ onTimeChange }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    // 과거 시간,날짜 선택 못하도록 하는 함수
     
    const filterPassedTime = (time) => {
        const currentDate = new Date();
        return time.getTime() > currentDate.getTime();
    };
    
    // 날짜 및 시간 변경 시 호출되는 핸들러 함수
    const handleDateChange = (date) => {
        setSelectedDate(date);
        
        // dl_time 값을 생성하여 콜백으로 전달
        const dtm =`${date.getFullYear().toString().substr(-2)}${date.getMonth() < 9 ? `0${date.getMonth()+1}` : date.getMonth()+1}${date.getDate() < 9 ? `0${date.getDate()}` : date.getDate()} ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}`
        onTimeChange(dtm);
    };

    return (
        <DatePicker
            className="form-control datepicker-custom"
            showIcon
            selected={selectedDate}
            onChange={handleDateChange}
            showTimeSelect
            filterTime={filterPassedTime} // 수정된 filterPassedTime 함수를 적용
            timeFormat='HH:mm'
            dateFormat='yyyy년 M월 d일 HH:mm'
            timeIntervals={1}
            placeholderText="  ----년/--월/--일 --:--"
            locale={ko}
            timeCaption={<CustomTimeCaption />}
            onKeyDown={(e) => e.preventDefault()}
        />
    );
};

// KakaoMap 컴포넌트: 카카오 맵을 표시하고 시간 선택 모달을 제어하는 부모 컴포넌트
function KakaoMap({ addr, handleSendMessage, addDelDtm, usr_id }) {
    console.log(addr)
    const KAKAO_REST_API_KEY = 'b2a3b873d0d58055ba5b7ef3e327aae0';
    const [dealDtm, setDealDtm] = useState({
        lat: '',
        lng: '',
        dealTime: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [placeName, setPlaceName] = useState('');

    useEffect(() => {
        const addresses = []
        addr.forEach(item => addresses.push(item.buyer,item.seller))
        const coordinatePromises = addresses.map(address => convertAddressToCoordinates(address));

        Promise.all(coordinatePromises)
            .then(coordinates => {
                const container = document.getElementById('map');

                const centerLat = (coordinates[0].lat + coordinates[1].lat) / 2;
                const centerLng = (coordinates[0].lng + coordinates[1].lng) / 2;

                const options = {
                    center: new window.kakao.maps.LatLng(centerLat, centerLng),
                    level: 5
                };
                const mapInstance = new window.kakao.maps.Map(container, options);

                searchPlaces(mapInstance, centerLat, centerLng, 1000);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }, []);

    // 주소를 좌표로 변환하는 함수
    const convertAddressToCoordinates = (address) => {
        const url = `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`;
        const options = {
            headers: {
                Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`
            }
        };

        return fetch(url, options)
            .then(response => response.json())
            .then(data => {
                if (data.documents.length > 0) {
                    const lng = parseFloat(data.documents[0].x);
                    const lat = parseFloat(data.documents[0].y);
                    return { lat, lng };
                } else {
                    return null;
                }
            });
    }

    // 카테고리 검색을 통해 주변 장소를 검색하는 함수
    const searchPlaces = (mapInstance, centerLat, centerLng, radius) => {
        const ps = new window.kakao.maps.services.Places();

        const callback = (data, status, pagination) => {
            if (status === window.kakao.maps.services.Status.OK) {
                console.log('검색 성공, 검색 결과 수:', data.length);
                for (let i = 0; i < data.length; i++) {
                    displayMarker(mapInstance, data[i]);
                }
            } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
                console.log('검색 결과 없음, 반경을 늘려서 다시 검색합니다.');
                console.log(radius)
                radius += 1000;
                ps.keywordSearch('투썸플레이스', callback, { location: new window.kakao.maps.LatLng(centerLat, centerLng), radius: radius });
            } else {
                console.log('장소 검색 실패');
            }
        };

        ps.categorySearch('CE7', callback, { location: new window.kakao.maps.LatLng(centerLat, centerLng), radius: radius });
    }

    // 마커를 표시하는 함수
    const displayMarker = (mapInstance, place) => {
        console.log('마커 표시:', place.place_name);

        const marker = new window.kakao.maps.Marker({
            map: mapInstance,
            position: new window.kakao.maps.LatLng(place.y, place.x)
        });

        // 마커 클릭 시 처리
        window.kakao.maps.event.addListener(marker, 'click', function () {
            setDealDtm({
                ...dealDtm,
                lat: place.y,
                lng: place.x
            });
            setPlaceName(place.place_name);

            setTimeout(() => setShowModal(true), 0); // 수정
        });
    }

    // dl_time에 선택된 시간을 설정하고 모달을 닫는 함수
    const handleTimeSubmit = (time) => {
        setDealDtm(prevDealDtm => {
            const newDealDtm = {
                ...prevDealDtm,
                dealTime: time
            };
            
    


            if(addr[0].buyerId == ''){
                addDelDtm(addr[0].prdId, usr_id, newDealDtm);
            }
            else{
                addDelDtm(addr[0].prdId, addr[0].buyerId, newDealDtm);
            }
            return newDealDtm;
        });
        setShowModal(false);
    };

    return (
        <div>
            <div id="map" style={{ width: "100%", height: "40vh" }}></div>
            {/*카카오 맵 크기 조절*/}
            <TimeInputModal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                onTimeSubmit={handleTimeSubmit}
                Title={placeName}
                handleSendMessage={handleSendMessage}
                dealDtm={dealDtm}
                addr={addr}
            />
        </div>
    );
}

// TimeInputModal 컴포넌트: 시간 선택 모달을 띄우는 컴포넌트
function TimeInputModal({ isOpen, onRequestClose, onTimeSubmit, Title, handleSendMessage, dealDtm, addr}){
    const [time, setTime] = useState('');
    // 선택된 시간을 상태에 설정하는 함수
    const handleTimeChange = (dtm) => {
        const year = dtm.substring(0, 2);
        const month = dtm.substring(2, 4);
        const day = dtm.substring(4, 6);
        const hourMinute = dtm.substring(7);
        handleSendMessage(`거래시간: ${year}-${month}-${day} ${hourMinute}`)
        setTime(dtm);
    };

    // 모달을 닫고 선택된 시간을 dl_time에 설정하는 함수
    const handleSubmit = () => {
        onTimeSubmit(time,addr)
        const mapLink = `https://map.kakao.com/link/map/${Title},${dealDtm.lat},${dealDtm.lng}`;
        handleSendMessage(mapLink);
        
        onRequestClose();
        
    };

    return (
        <Modal show={isOpen} onHide={onRequestClose} size={"lg"} centered >
            <Modal.Header>
                <Modal.Title className="fontSize">{Title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* DatePickerComponent를 렌더링 */}
                <DatePickerComponent
                    onTimeChange={handleTimeChange}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onRequestClose}>닫기</Button>
                <Button variant="primary" onClick={handleSubmit} className="submitButtonDesign">제출</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default KakaoMap;
