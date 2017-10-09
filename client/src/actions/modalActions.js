import { createModalActions } from '../utils/actions';
export const ALERT_MODAL = 'ALERT_MODAL';

export default {
    alertModalActions: createModalActions(ALERT_MODAL, 'alert')
}