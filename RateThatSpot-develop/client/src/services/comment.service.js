import axios from 'axios';
const SERVER_URL = 'http://localhost:5000/';

class CommentService {
    getAllPostComments(post) {
        return axios.get(SERVER_URL + 'fetchComments/' + post);
    }

    addNewComment(author, username, body, post, replyingTo) {
        console.log('adding new comment: ' + replyingTo )
        return axios.post(SERVER_URL + 'comment', {
            author: author,
            username: username,
            body: body,
            post: post,
            replyingTo: replyingTo
        });
    }

    editComment(id, body) {
        return axios.patch(SERVER_URL + 'updateBody/' + id, {
            body: body
        });
    }

    upvoteComment(id, user_id) {
        return axios.post(SERVER_URL + 'upvote/' + id, {
            _id: user_id
        })
    }

    downvoteComment(id, user_id) {
        return axios.post(SERVER_URL + 'downvote/' + id, {
            _id: user_id
        })
    }

    getReplies(comment_id) {
        return axios.get(SERVER_URL + 'getReplies/' + comment_id)
    }
}
export default new CommentService();