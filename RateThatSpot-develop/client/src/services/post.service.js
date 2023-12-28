import axios from 'axios';
import authHeader from './auth-header';
const POST_URL = 'http://localhost:5000/posts/';
const USER_URL = 'http://localhost:5000/user/'
const FAVORITE_POSTS_URL = "http://localhost:5000/getFavoritePosts/"
const TIMELINE_POSTS_URL = "http://localhost:5000/getTimelinePosts/"
const AMEN_URL = 'http://localhost:5000/facilities/';
const UPVOTE_URL = 'http://localhost:5000/postUpvote/';
const DOWNVOTE_URL = 'http://localhost:5000/postDownvote/';
const UPTHENDOWN_URL = 'http://localhost:5000/upThenDown/';
const DOWNTHENUP_URL = 'http://localhost:5000/downThenUp/';
const FACILITYAGG_URL = 'http://localhost:5000/post/setFacilityAgg/';
const BUILDINGAGG_URL = 'http://localhost:5000/post/setBuildingAgg/';

//testing user permissions (not logged in vs logged in)
class PostService {
    getSinglePost(id) {
        return axios.get(POST_URL + id);
    }

    getPostAuthor(id) {
        return axios.get(USER_URL + id);
    }

    getAmenity(id) {
        return axios.get(AMEN_URL + id);
    }

    upvotePost(id) {
        return axios.patch(UPVOTE_URL + id)
    }

    downvotePost(id) {
        return axios.patch(DOWNVOTE_URL + id)
    }

    upThenDown(id) {
        return axios.patch(UPTHENDOWN_URL + id)
    }

    downThenUp(id) {
        return axios.patch(DOWNTHENUP_URL + id)
    }

    updateFacilityAgg(id) {
        return axios.patch(FACILITYAGG_URL + id)
    }

    updateBuildingAgg(id) {
        return axios.patch(BUILDINGAGG_URL + id)
    }

    updatePost({ title, body, rating, id }) {
        return axios.patch(POST_URL + id, {
          title: title,
          body: body,
          rating: rating
        })
      }

    deleteSinglePost(id) {
        return axios.delete(POST_URL + id);
    }

    getTimelinePosts(username) {
        return axios.get(TIMELINE_POSTS_URL + username)
    }

    getFavoritePosts(username) {
        return axios.get(FAVORITE_POSTS_URL + username)
    }
}
export default new PostService();