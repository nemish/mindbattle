
export const handleUser = props => {
    const userId = sessionStorage.getItem('current_user');
    if (userId && userId !== 'undefined') {
        props.fetchCurrentUser({user_id: userId});
    } else {
        props.history.push('/');
    }
}