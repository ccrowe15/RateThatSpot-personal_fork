// return only the token and not a header object
export default function authToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.accessToken) {
      return user.accessToken;
    } else {
      return "";
    }
  }