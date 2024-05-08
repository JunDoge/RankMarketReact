function KaKaoLogin(setIsLoggedIn) {
    const link = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=b5ff7fed98824ae1e74226bdbcfde106&redirect_uri=http://rankmarket.store/kakao&prompt=login';
    // const link = 'https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=b5ff7fed98824ae1e74226bdbcfde106&redirect_uri=http://rankmarket.store/kakao';

    const KakaoLoginHandler = () => {
        window.location.href = link;
    };

    return KakaoLoginHandler;
}
export default KaKaoLogin;
