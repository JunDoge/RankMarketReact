import React, {useEffect,useState} from 'react';
import '../../css/Products/ProductAdd.css';
import {Button, Col, Container, Form, Row} from 'react-bootstrap';
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import {useNavigate} from "react-router-dom";

function ProductAdd() {
    const [showAIImage, setShowAIAIImage] = useState([]);
    const [AIImage,setAIImage] = useState([])
    const [showImage,setShowImage ] = useState([]);
    const [image, setImage] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showSecondModal, setShowSecondModal] = useState(false);
    const [model, setModel] = useState('');
    const [firstModel, setFirstModel] = useState([]);
    const [secondModel, setSecondModel] = useState([]);
    const [rank, setRank] = useState('')
    const [rankhiden , setRankhiden] = useState(false)
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        title : '',
        sellPrice : '',
        highPrice: '',
        catId: '',
        significant:'',
        des : '',
        iseatPrice : '',
    })
       useEffect(() => {
            if(window.localStorage.getItem("token") === null){
                navigate('/')
            }
        }, []);


    const rankingCheck =(e) =>{
        e.preventDefault();

        const formData = new FormData()
        for (let i = 0; i < AIImage.length; i++) {
            formData.append("images",AIImage[i])
        }
        formData.append("catId", product.catId)

        axios.post('/rankingCheck',formData,{
            headers:{
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`,
                'Content-Type': 'multipart/form-data',
            }
        }).then(r=>{
            console.log(r.data.response.price)
            console.log(r.data.response.rank)
            setRank(r.data.response.rank)
            setProduct({
                ...product,
                highPrice: r.data.response.price
            });
        }).catch(error =>{
            console.log(error)
        })
    }

    const handleFirstOptionChange = (e) => {
        setModel(e.target.value);
        switch (e.target.value) {
            case '삼성':
                setFirstModel(['갤럭시노트 시리즈', '갤럭시S 시리즈', '갤럭시Z 시리즈','갤럭시A 시리즈','갤럭시J 시리즈']);
                break;
            case '아이폰':
                setFirstModel(['iPhone15 시리즈', 'iPhone14 시리즈', 'iPhone13 시리즈','iPhone12 시리즈','iPhone11 시리즈']);
                break;
            default:
                setFirstModel([]);
        }
    };

    const handleSecondOptionChange = (e) => {
        setModel(e.target.value);
        switch (e.target.value) {
            case '갤럭시노트 시리즈':
                setSecondModel([{GN20U:'갤럭시노트 20 Ultra'},{GN20:'갤럭시노트 20'},{GN10P:'갤럭시노트 10 Plus'},{GN10:'갤럭시노트 10'},{GN9:'갤럭시노트 9'},{GN8:'갤럭시노트 8'},{GN5:'갤럭시노트 5'}]);
                break;
            case '갤럭시S 시리즈':
                setSecondModel([{GS23U: "갤럭시 S23 Ultra"}, {"GS23P": "갤럭시 S23 Plus"}, {"GS23": "갤럭시 S23"}, {"GS23FE": "갤럭시 S23 FE"}, {"GS22U": "갤럭시 S22 Ultra"}, {"GS22P": "갤럭시 S22 Plus"},
                    {"GS22": "갤럭시 S22"}, {"GS21U": "갤럭시 S21 Ultra"}, {"GS21P": "갤럭시 S21 Plus"}, {"GS21": "갤럭시 S21"}, {"GS20U": "갤럭시 S20 Ultra"}, {"GS20P": "갤럭시 S20 Plus"}, {"GS20": "갤럭시 S20"},
                    {"GS20FE": "갤럭시 S20 FE 5G"}, {"GS10P": "갤럭시 S10 Plus"}, {"GS10": "갤럭시 S10"}, {"GS10E": "갤럭시 S10 E"}, {"GS9P": "갤럭시 S9 Plus"}, {"GS9": "갤럭시 S9"}, {"GS8P": "갤럭시 S8 Plus"}, {"GS8": "갤럭시 S8"}]
                );
                break;
            case '갤럭시Z 시리즈':
                setSecondModel([{"GZFD5": "갤럭시 Z 폴드 5 5G"}, {"GZF5": "갤럭시 Z 플립 5 5G"}, {"GZFD4": "갤럭시 Z 폳드 4 5G"}, {"GZFD3": "갤럭시 Z 폳드 3 5G"}, {"GZF4": "갤럭시 Z 플립 4 5G"},
                    {"GZF3": "갤럭시 Z 플립 3 5G"}, {"GZFD2": "갤럭시 Z 폳드 2 5G"}, {"GZF": "갤럭시 Z플립 5G"}, {"GZFL": "갤럭시 Z플립 LTE"}, {"GF": "갤럭시 폴드"}]
                );
                break;
            case '갤럭시A 시리즈':
                setSecondModel([{"GA53": "갤럭시 A53"}, {"GA34": "갤럭시 A34 5G"}, {"GA33": "갤럭시 A33 5G"}, {"GA24": "갤럭시 A24"}, {"GA23": "갤럭시 A23"}, {"GA13": "갤럭시 A13"}, {"GQ4": "갤럭시 퀀텀4"}, {"GQ3": "갤럭시 퀀텀3"},
                    {"GQ2": "갤럭시 퀀텀2"}, {"GA52": "갤럭시 A52S"}, {"GA42": "갤럭시 A42"}, {"GJ3": "갤럭시 JUMP 3"}, {"GJ2": "갤럭시 Jump2"}, {"GJ": "갤럭시 Jump"}, {"GB2": "갤럭시 버디2"}, {"GB": "갤럭시 버디"}, {"GA12": "갤럭시 A12"},
                    {"GA90": "갤럭시 A90 5G"}, {"GA80": "갤럭시 A80"}, {"GA71": "갤럭시 A71"}, {"GA51": "갤럭시 A51"}, {"GA31": "갤럭시 A31"}, {"GA21": "갤럭시 A21S"}, {"GA50": "갤럭시 A50"}, {"GA40": "갤럭시 A40"}, {"GA30": "갤럭시 A30"},
                    {"GA9P": "갤럭시 A9 PRO"}, {"GA9": "갤럭시 A9"}, {"GA5": "갤럭시 A5 2017"}]
                );
                break;
            case '갤럭시J 시리즈':
                setSecondModel([{"GJ4P": "갤럭시 J4 Plus"}, {"GJ6": "갤럭시 J6"}, {"GJ7": "갤럭시 J7 2017"}, {"GJ3": "갤럭시 J3 2017"}]);
                break;
            case 'iPhone15 시리즈':
                setSecondModel([{"I15PM": "iPhone 15 Pro Max"}, {"I15P": "iPhone 15 Pro"}, {"I15PL": "iPhone 15 Plus"}, {"I15": "iPhone 15"}]);
                break;
            case 'iPhone14 시리즈':
                setSecondModel([{"I14PM": "iPhone 14 Pro Max"}, {"I14P": "iPhone 14 Pro"}, {"I14PL": "iPhone 14 Plus"}, {"I14": "iPhone 14"}]);
                break;
            case 'iPhone13 시리즈':
                setSecondModel([{"I13PM": "iPhone 13 Pro Max"}, {"I13P": "iPhone 13 Pro"}, {"I13": "iPhone 13"}, {"I13M": "iPhone 13 Mini"}]);
                break;
            case 'iPhone12 시리즈':
                setSecondModel([{"I12PM": "iPhone 12 Pro Max"}, {"I12P": "iPhone 12 Pro"}, {"I12": "iPhone 12"}, {"I12M": "iPhone 12 Mini"}]);
                break;
            case 'iPhone11 시리즈':
                setSecondModel([{"I11PM": "iPhone 11 Pro Max"}, {"I11P": "iPhone 11 Pro"}, {"I11": "iPhone 11"}]);
                break;
            default:
                setSecondModel([]);
        }
    };

    const handleAIImageChange = (e) => {
        let copy = [...showAIImage]
        let files = [...AIImage]
        copy.push(URL.createObjectURL(e.target.files[0]))
        files.push(e.target.files[0])
        setShowAIAIImage(copy);
        setAIImage(files);
    }
    const handleImageChange = (e) => {
        let copy = [...showImage]
        let files = [...image]
        let multiple = e.target.files
        console.log(multiple)
        for(let i = 0; i <multiple.length; i++) {
            console.log(multiple)
            copy.push(URL.createObjectURL(multiple[i]))
            files.push(multiple[i])
        }
        setShowImage(copy);
        setImage(files);
    }
    const handleImageCancle =(e) =>{


        setImage([])
        setShowImage([])
    }

    const onChangeHandle = (e) => {
        const { name, value } = e.target;
        console.log(name + value)
        setProduct({
            ...product,
            [name]: value
        });
    };
    const submitForm = (e) => {
        e.preventDefault();

        const formData = new FormData()
        for (const k in image){
            formData.append("images",image[k])
        }
        for (const k in product){

            if (k === 'catId'){
                console.log('키 : '+ k +'값 : '+ product[k])
                formData.append(k, product[k]+rank)}
            else{
                console.log('키 : '+ k +'값 : '+ product[k])
                formData.append(k, product[k])}
        }

        axios.post('/add/product', formData, {
            headers: {
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`,
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(r => {
                console.log(r.data);
                navigate('/mypage/prdmgmt')
            })
            .catch(error => {
                console.log(error);
            });
    }
    return (
        <div>
            <div className="productadd-header">
                <h2>상품등록</h2>
                <p>*필수 입력</p>
            </div>
            <div className="bottom-line border-bottom"></div>
            <Container fluid="md" className="mt-4">
                <Row className="justify-content-center">
                    <Col xs={12} md={8}>
                        <Form className="productadd-form" onSubmit={submitForm}>
                            <Row>
                                <Col xs={12} md={4}>
                                    <Form.Group className="mb-3 productAddInput">
                                        <Form.Label>제조사*</Form.Label>
                                        <Form.Control as="select"  custom="true" defaultValue=''  onChange={handleFirstOptionChange}>
                                            <option value=''>제조사 선택</option>
                                            <option>삼성</option>
                                            <option>아이폰</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Form.Group className="mb-3 productAddInput">
                                        <Form.Label>모델명*</Form.Label>
                                        <Form.Control as="select" name="" onChange={handleSecondOptionChange}  custom="true" >
                                            <option value=''>모델 선택</option>
                                            {firstModel.map((option, index) => (
                                                <option key={index}>{option}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs={12} md={4}>
                                    <Form.Group className="mb-3 productAddInput">
                                        <Form.Label>기종*</Form.Label>
                                        <Form.Control as="select" name="catId" onChange={onChangeHandle} custom="true" >
                                            <option value=''>기종 선택</option>
                                            {secondModel.map((option, index) => (
                                                <option key={index} value={Object.keys(option)}>{Object.values(option)}</option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12} md={4}>
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>AI 외관 검사*</Form.Label><p/>

                                        {/*버튼 색 변경함*/}
                                        <Button className="productadd-button" onClick={() => setShowModal(true)}>파일 업로드</Button>

                                        <Modal show={showModal} className="AddProductImage" centered>
                                            <Modal.Header>
                                                <Modal.Title>상품의 앞,뒷면 사진을 첨부해주세요.</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form.Control type="file" name="MainAIChack" onChange={handleAIImageChange} />
                                                <Form.Control type="file" name="BackAIChack" onChange={handleAIImageChange} />
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={() => setShowModal(false)}>닫기</Button>
                                                <Button className="productadd-button" variant="primary" onClick={rankingCheck} >업로드 완료</Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </Form.Group>
                                    {
                                        showAIImage.map(function(img,index){
                                            return(
                                                <img key={index} className="AIImages" src={img} alt="preview" />
                                            )
                                        })
                                    }
                                    <Button variant="secondary"  style={{marginTop: '10px'}} onClick={()=>{setTimeout(()=>{setRankhiden(true)},7000)}}>검사 시작</Button>
                                    { rankhiden ? <p>당신의 휴대폰은{rank}입니다.</p> : null }
                                </Col>
                                <Col xs={12} md={6}>
                                    <Form.Group controlId="formFile" className="mb-3">
                                        <Form.Label>상품 사진</Form.Label><p/>
                                        <Button className="productadd-button" variant="primary" onClick={() => setShowSecondModal(true)}>파일 업로드</Button>

                                        <Modal show={showSecondModal} onHide={() => setShowSecondModal(false)} centered>
                                            <Modal.Header closeButton>
                                                <Modal.Title>상품 사진 파일 업로드</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form.Control type="file" multiple="multipart" onChange={handleImageChange} />
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleImageCancle}>취소</Button>
                                                <Button variant="primary" onClick={() => setShowSecondModal(false)}>업로드 완료</Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </Form.Group>
                                    {
                                        showImage.map(function(img,index){
                                            return(
                                                <img key={index} className="AIImages" src={img} alt="preview" />
                                            )
                                        })
                                    }
                                </Col>
                            </Row>
                            <Form.Group className="mb-3 custom-input productAddInput">
                                <Form.Label>제목*</Form.Label>
                                <Form.Control type="text" name="title" onChange={onChangeHandle} placeholder="제목을 입력해 주세요" />
                            </Form.Group>
                            <Form.Group className="mb-3 custom-input productAddInput">
                                <Form.Label>시작가*</Form.Label>
                                <Form.Control type="number" name="sellPrice" onChange={onChangeHandle} placeholder="₩시작가를 입력해주세요" min={0} max={product.highPrice} />
                            </Form.Group>
                            <Form.Group className="mb-3 custom-input productAddInput">
                                <Form.Label>예상가</Form.Label>
                                <Form.Control type="text" name="highPrice" value={product.highPrice} onChange={onChangeHandle} placeholder="₩예상가" readOnly />
                            </Form.Group>
                            <Row>
                                <Form.Group className="mb-3 ieast productAddInput" style={{width:"50%"}}>
                                    <Form.Label>경매 최소 가격*</Form.Label>
                                    <Form.Control as="select" name="iseatPrice" onChange={onChangeHandle} custom="true">
                                        <option>입찰가격선택</option>
                                        <option>1000</option>
                                        <option>5000</option>
                                        <option>10000</option>
                                    </Form.Control>
                                </Form.Group>
                            </Row>
                            <Form.Group className="mb-3 custom-input significant">
                                <Form.Label>특이사항*</Form.Label>
                                <Form.Control type="text" name="significant" onChange={onChangeHandle} placeholder="특이사항을 기제해주세요" />
                            </Form.Group>
                            <Form.Group className="mb-3 productAddInput">
                                <Form.Label>상품 상세 정보*</Form.Label>
                                <Form.Control name="des" onChange={onChangeHandle} as="textarea" rows={3} maxLength="5000" />
                            </Form.Group>
                            <Row className="justify-content-end">
                                <Col xs={6} md={2}>
                                    <Button variant="light" style={{color: '#F27F22', width: '100%', fontSize: '0.75rem' ,borderColor: '#F27F22' }} type="button">
                                        취소하기
                                    </Button>
                                </Col>
                                <Col xs={6} md={2}>
                                    <Button className="productadd-button" variant="primary" style={{width: '100%', fontSize: '0.75rem'}} type="submit">
                                        등록하기
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default ProductAdd;