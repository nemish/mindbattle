
export const handleUser = props => {
    if (props.userId || props.loading) {
        return;
    }
    const token = sessionStorage.getItem('jwt_token');
    if (token) {
        return props.fetchCurrentUser();
    }
}