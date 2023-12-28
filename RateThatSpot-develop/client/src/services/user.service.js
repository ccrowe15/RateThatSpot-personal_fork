import axios from 'axios';
import authHeader from './auth-header';
import authToken from './auth-token';
import { AxiosError } from 'axios';
import authService from './auth.service';
const API_URL = 'http://localhost:5000/users/test/';
const USER_URL = 'http://localhost:5000/users/';
const USER_POSTS_URL = 'http://localhost:5000/postsByUsername/';
const VALIDATE_CREDENTIALS_URL = 'http://localhost:5000/users/verifyCredentials';
const SEARCH_USER_URL = "http://localhost:5000/users/searchUsers/";
const REGISTER_USER_URL = "http://localhost:5000/register";
const FOLLOWED_USERS = "http://localhost:5000/users/getFollowedUsers/"
const BLOCKED_USERS = "http://localhost:5000/users/getBlockedUsers/"
const GET_USER_INTERACTIONS = "http://localhost:5000/getInteractions/";
const POST_USER_INTERACTIONS = "http://localhost:5000/interaction";
const UPDATE_TIME_LIMIT = "http://localhost:5000/users/updateTimeLimit/";
const REQUEST_URL = "http://localhost:5000/amenityRequest/"

//testing user permissions (not logged in vs logged in)
class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }
  // deprecated function, maybe delete?
  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }
  //can add moderator role here
  getUserPosts(username) {
    return axios.get(USER_POSTS_URL + username);
  }
  getUserData(username) {
    return axios.get(USER_URL + username);
  }
  getProfilePicture(photo) {
    return axios.get(USER_URL + `download/${photo}`);
  }
  validateCredentials({ username, password }) {
    return axios.post(VALIDATE_CREDENTIALS_URL, {
      username: username,
      password: password
    });
  }
  updatePassword({ username, password }) {
    return axios.patch(USER_URL + username, {
      username: username,
      password: password
    })
  }
  searchUsers(searchTerm) {
    return axios.get(SEARCH_USER_URL + searchTerm);
  }
  registerUser(userData) {
    return axios.post(REGISTER_USER_URL, userData);
  }
  updateUserBio({ username, bio}) {
    console.log('bio: ' + bio)
    return axios.patch(USER_URL + username, {
      username: username,
      bio: bio
    })
  }

  updateFavoritedPosts({ username, favoritedPosts, favorite }) {
    return axios.patch(USER_URL + username, {
      username: username,
      favoritedPosts: favoritedPosts,
      favorite: favorite
    })
  }

  updateFavoritedBuildings({ username, favoritedBuildings, favorite}) {
    return axios.patch(USER_URL + username, {
      username: username,
      favoritedBuildings: favoritedBuildings,
      favorite: favorite
    })
  }

  updateFavoritedFacilities({username, favoritedFacilities, favorite}) {
    return axios.patch(USER_URL + username, {
      username: username,
      favoritedFacilities: favoritedFacilities,
      favorite: favorite
    })
  }

  updateFollowedUsers({ username, followedUsers, follow }) {
    return axios.patch(USER_URL + username, {
      username: username,
      followedUsers: followedUsers,
      follow: follow
    }).catch((error) => {
      console.log(error)
    })
  }
  updateBlockedUsers({username, blockedUsers, block}) {
    return axios.patch(USER_URL + username, {
      username: username,
      blockedUsers: blockedUsers,
      block: block
    })
  }

  getFollowedUsers(username) {
    return axios.get(FOLLOWED_USERS + username)
    .catch((error) => {
      console.log(error);
    })
  }

  getBlockedUsers(username) {
    return axios.get(BLOCKED_USERS + username);
  }

  getUserInteractions(user_id) {
    return axios.get(GET_USER_INTERACTIONS + user_id);
  }

  postUserInteraction(user_id, post_id, type) {
    return axios.post(POST_USER_INTERACTIONS, {
      user: user_id,
      post: post_id,
      type: type
    });
  }

  updatePrivacySettings(username, privateProfile, privateFavorites) {
    console.log('username: ' + username)
    console.log('privateProfile: ' + privateProfile)
    console.log('privateFavorites: ' + privateFavorites)
    return axios.patch(USER_URL + username, {
      privateProfile: privateProfile,
      privateFavorites: privateFavorites
    })
  }

  updateUserFlair(username, flairOption) {
    console.log(username)
    console.log(flairOption)
    return axios.patch(USER_URL + username, {
      flairOption: flairOption, headers: authHeader()
    })
  }

  updateProfilePicture({ username, file}) {
    const formData = new FormData(); 
    formData.append('file', file);
    formData.append('name', username);
    console.log(formData);
    const token = authToken();
    return axios.post(USER_URL + 'upload', formData, {
      headers: {
        'x-access-token': token,
        'Content-Type': 'multipart/form-data',
      }, 
    });
  }


  updateUIPreferenceLocal(username,preference,) {
    const user = authService.getCurrentUser()
    user.uiSetting = preference
    localStorage.setItem("user", JSON.stringify(user));
    return axios.patch(USER_URL + username, {
      uiSetting: preference, headers: authHeader()
    })
  }

  deleteAccount(username) {
    return axios.delete(USER_URL + username, { headers: authHeader() })
  }

  updateLastPostTime(username, lastPost) {
    console.log(lastPost)
    return axios.patch(UPDATE_TIME_LIMIT + username, {
      lastPost: lastPost
    })
    
  }

  updateLastCommentTime(username, lastComment) {
    return axios.patch(UPDATE_TIME_LIMIT + username, {
      lastComment: lastComment
    })
  }

  submitAmenityRequest(username) {
    return axios.patch(REQUEST_URL + username)
  }

}
export default new UserService();