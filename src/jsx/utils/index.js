

export const logout = () => {
    localStorage.removeItem('auth_token');
}

export const isLogin = () => {
    if (localStorage.getItem('auth_token')) {
        return true;
    }

    return false;
}