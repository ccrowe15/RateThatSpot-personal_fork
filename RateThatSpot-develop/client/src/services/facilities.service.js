import axios from 'axios';

const facilityURL = 'http://localhost:5000/'

const FAVORITE_FACILITIES_URL = "http://localhost:5000/getFavoriteFacilities/"

class FacilitiesService {
  getFavoritedFacilities(username) {
    return axios.get(FAVORITE_FACILITIES_URL + username).catch((error) => console.log(error));
  }

  // home component tries to get top 6 amenities/facilities
  getTopFacilities() {
    return axios.get(`${facilityURL}topAmenities`).catch((error) => console.log(error));
  }
}

export default new FacilitiesService();