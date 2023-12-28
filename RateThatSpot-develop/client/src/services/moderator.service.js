import axios from 'axios';
import authHeader from './auth-header';
import authToken from './auth-token';
const API_URL = "http://localhost:5000/";

class ModeratorService {
    // passes log-in token and returns whether the logged in user is a moderator
    // more security
    verifyModerator() {
        return axios.get(`${API_URL}verifyModStatus`, { headers: authHeader() });
    }

    getSpecificFacilityRequest(id) {
        return axios.get(`${API_URL}facilityRequests/${id}`, { headers: authHeader() });
    }

    approveFacilityRequest(id) {
        const formData = new FormData();
        formData.append('id', id);
        const token = authToken();
        return axios.post(`${API_URL}approveRequest/${id}`, formData, {
            headers: {
              'x-access-token': token,
              'Content-Type': 'multipart/form-data',
            }, 
          });
    }

    deleteFacilityRequest(id) {
        return axios.delete(`${API_URL}facilityRequests/${id}`, { headers: authHeader() });
    }

    getAllFacilityRequests() {
        return axios.get(`${API_URL}facilityRequests`, { headers: authHeader() });
    }

    // ban a given user
    banUser(username) {
        const formData = new FormData();
        formData.append('name', username);
        const token = authToken();
        return axios.post(`${API_URL}banUser/${username}`, formData, {
            headers: {
              'x-access-token': token,
              'Content-Type': 'multipart/form-data',
            }, 
          });
    }
    // unban a given user
    unBanUser(username) {
        console.log(username);
        const formData = new FormData();
        formData.append('name', username);
        const token = authToken();
        return axios.post(`${API_URL}unBanUser/${username}`, formData, {
            headers: {
              'x-access-token': token,
              'Content-Type': 'multipart/form-data',
            }, 
          });
    }
    // list of all banned users
    listBannedUsers() {
        return axios.get(`${API_URL}listBanned`, { headers: authHeader() });
    }
}

export default new ModeratorService();