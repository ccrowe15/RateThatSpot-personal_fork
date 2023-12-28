import axios from 'axios';

const NOTIFICATION_URL = 'http://localhost:5000/notifications/';

class NotificationService {
    deleteNotification(id) {
        return axios.delete(NOTIFICATION_URL + id);
    }
}
export default new NotificationService();