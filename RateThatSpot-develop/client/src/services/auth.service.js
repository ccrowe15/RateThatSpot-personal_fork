import axios from "axios";
const API_URL = "http://localhost:5000/users/";
//middleware for logins
class AuthService {
  //handle all logins
  async login(username, password) {
    return axios
      .post(API_URL + "login", {
        username,
        password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
        return response.data;
      });
  }
  //can add register function in here
  //logout flushes user item from your browser's local storage
  logout() {
    localStorage.removeItem("user");
  }
  //gets current user's auth data from local storage on the browser
  getCurrentUser() {
    return JSON.parse(localStorage.getItem("user"));
  }
  
}
export default new AuthService();
