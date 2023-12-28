import axios from 'axios';
import authHeader from './auth-header';
const BUILDINGS_URL = 'http://localhost:5000/building';
const FAVORITE_BUILDINGS_URL = "http://localhost:5000/getFavoriteBuildings/"
const BUILDING_ADDR_URL = 'http://localhost:5000/building/abbr/';

//testing user permissions (not logged in vs logged in)
class BuildingService {
    getAllBuildings() {
        return axios.get(BUILDINGS_URL);
    }

    getFavoriteBuildings(username) {
        return axios.get(FAVORITE_BUILDINGS_URL + username)
    }

    getBuildingByCode(abbr) {
        return axios.get(BUILDING_ADDR_URL + abbr);
    }
}
export default new BuildingService();