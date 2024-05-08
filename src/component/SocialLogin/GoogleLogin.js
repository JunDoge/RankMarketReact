
function GoogleLogin() {
    const link = 'https://accounts.google.com/o/oauth2/v2/auth?client_id=675762463056-bqfb57s1u738c0mdkc8hru5hidm28iqg.apps.googleusercontent.com&redirect_uri=http://rankmarket.store/google&response_type=code&scope=email%20profile';

    const GoogleLoginHandler = () => {
        window.location.href = link;
    };

    return GoogleLoginHandler;
}
export default GoogleLogin;

