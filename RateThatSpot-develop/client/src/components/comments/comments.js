import React, {useEffect} from 'react';
import {CircularProgress, List, ListItem} from "@material-ui/core";
import CommentService from '../../services/comment.service'
import Comment from './comment/comment'
import {useState, useRef} from "react";
import {useParams} from "react-router";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import userService from '../../services/user.service';
import { Alert } from "@mui/material";


const Comments = () => {

    const [newComment, setNewComment] = useState({})
    const [comments, setComments] = useState([])
    const { id } = useParams()
    const [limitNotice, setLimitNotice] = useState(false)
    const bottomRef = React.useRef();
    const [replyId, setReplyId] = useState()
    const [currentDate, setCurrentDate] = useState({});
    const [lastCommentTime, setLastPostTime] = useState({});
    const [isLoading, setIsLoading] = useState(true)
    var FIVE_MIN = 5*60*1000;

    const [authData, setAuthData] = useState({})

    const replyStart = (user, reply_id) => {
        bottomRef.current.scrollIntoView();
        setNewComment((newComment) => ({
            author: authData.id,
            username: authData.username,
            body: "@" + user + " ",
            post: id } ));
        setReplyId(reply_id)
        console.log('reply_id: ' + reply_id)
        console.log(newComment)

    }


    const handleChange = (event) => {
        if (event.target.value.length > 300) {
            setLimitNotice(true)
            return
        } else {
            setLimitNotice(false)
        }
        setNewComment((newComment) => ({
            author: authData.id,
            username: authData.username,
            body: event.target.value,
            post: id } ));
    }

    const submitComment = async () => {
        const newCommentRequest = await CommentService.addNewComment(
            newComment.author,
            newComment.username,
            newComment.body,
            newComment.post,
            replyId
        )
        await UserService.postUserInteraction(authData.id, newComment.post, "comment");

        //set Comment Time Limit
        const lastComment = true
        await UserService.updateLastCommentTime(newComment.username, lastComment);

        window.location.reload(false);
    }

    const clearComment = () => {
        setNewComment((newComment) => ({
            author: authData.id,
            username: authData.username,
            body: "",
            post: id,
        } ));
        setReplyId(null)
        setLimitNotice(false)
    }

    useEffect(async () => {
        const allComments = await CommentService.getAllPostComments(id)
        var filteredComments = allComments.data.filter(comment => comment.replyingTo == null)
        console.log(filteredComments)
        const auth = await AuthService.getCurrentUser();
        if (auth !== null) {
            console.log('here')
            setAuthData(auth)
            setNewComment({
                author: authData.id,
                username: authData.username,
                body: "",
                post: id
            })
            const user = await userService.getUserData(auth.username);
            console.log(user)
            if (user) {
                
                filteredComments = filteredComments.filter(comment => !(user.data[0].blockedBy.includes(comment.author)))

                setLastPostTime(user.data[0].lastCommentTime);
                setCurrentDate(new Date());
                console.log(auth.username)
                console.log(new Date(user.data[0].lastCommentTime))
                console.log(new Date())

            }
        } else {
            setAuthData(null)
        }
        setComments(filteredComments)
        setIsLoading(false)
    }, [])

    return (
            <div>
                { !isLoading && (
                    <div>
                    <List>
                        { comments.map( (comment) => (
                            <ListItem key={comment._id} item xs={12} sm={6}>
                                <Paper style={{ padding: "10px 20p" +
                                        "x", marginTop: 10, width: 450 }}>

                                    <Comment style={{float: "left"}} comment={comment}/>

                                    { authData && (<p onClick={() => replyStart(comment.username, comment._id)}
                                                      className="reply-link">reply</p>)}
                                </Paper>
                            </ListItem> ))}
                    </List>

                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >

                    { authData && (<div ref={bottomRef}>
                        {limitNotice && (<p style={{marginLeft: "15px", color: "red"}}>
                            Comment cannot not exceed 300 characters</p>)}
                        <TextField style={{ width: "452px", marginLeft: "15px" }}
                                   id="outlined-multiline-static"
                                   label="Add new comment"
                                   multiline
                                   autoFocus
                                   rows={4}
                                   value={newComment.body}
                                   onChange={handleChange}
                        />
                    </div>)}

                    { authData && (<div style={{paddingBottom: "30px"}}>
                        { !limitNotice && (<Button style={{backgroundColor: "lightsteelblue", marginLeft: "15px"}}
                                variant="contained" disabled={((currentDate - new Date(lastCommentTime)) < FIVE_MIN)}
                                onClick={submitComment}>Submit</Button>)}
                        <Button style={{backgroundColor: "grey", marginLeft: "15px"}}
                                variant="contained" onClick={clearComment}>Cancel</Button>
                    </div>)}
                    {((currentDate - new Date(lastCommentTime)) < FIVE_MIN) &&
                        <div style={{paddingBottom: "30px"}}>
                        <Alert variant="filled" severity="warning">
                            Must wait 5 minutes after posting a comment to post another
                        </Alert>
                        </div>
                    }
                    </Box>
                    </div>) }

                { isLoading === true && (
                    <div style={{marginTop: "30px", marginLeft: "30px"}}>
                        <CircularProgress/>
                        <h4 style={{marginTop: "20px"}}>loading...</h4>
                    </div>)}
            </div>
    )
}


export default Comments;