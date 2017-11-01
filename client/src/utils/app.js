import { promisify } from '../utils/actions';

export const handleUser = props => {
    if (props.userId || props.loading) {
        return;
    }
    const token = localStorage.getItem('jwt_token');
    if (token && token !== props.token) {
        return promisify(props.setTokenToApp(token)).then(() => props.fetchCurrentUser());
    }
}
