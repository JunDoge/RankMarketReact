
function NaverLogin() {
    const link = 'https://nid.naver.com/oauth2.0/authorize?client_id=htFjYdHOCsYcidq47h89&response_type=code&redirect_uri=http://rankmarket.store/naver';

    const NaverLoginHandler = () => {
        window.location.href = link;
    };

    return NaverLoginHandler;
}
export default NaverLogin;

