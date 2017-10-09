
export const handleUser = props => {
    if (props.user && (props.user._id || props.user.loading)) {
        return;
    }

    const userId = sessionStorage.getItem('current_user');
    if (userId && userId !== 'undefined') {
        props.fetchCurrentUser({user_id: userId});
    } else {
        props.history.push('/');
    }
}