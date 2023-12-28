import React, {useEffect, useState} from "react";
import ReactDOM from "react-dom";
import {Divider, Avatar, Grid, Paper, Typography, ListItem, List} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import Button from '@material-ui/core/Button';
import CommentService from "../../../services/comment.service";
import startReply from "../comments"
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import UserService from "../../../services/user.service";
import styles from './styles.css'
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import AuthService from "../../../services/auth.service";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import SchoolIcon from '@mui/icons-material/School';
import StarIcon from "@mui/icons-material/Star";
import MenuBookIcon from '@mui/icons-material/MenuBook';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';



const imgLink = "../../images/sample_flair.png"

const Comment = ( { comment } ) => {

    const [profilePic, setProfilePic] = useState(null);
    const [replies, setReplies] = useState([]);
    const [viewReplies, setViewReplies] = useState(false);
    const [edit, setEdit] = useState(false);
    const [limitNotice, setLimitNotice] = useState(false)
    const [editBody, setEditBody] = useState();
    const [authData, setAuthData] = useState({})
    const [userData, setUserData] = useState({})
    const [upvoted, setUpvoted] = useState(false);
    const [downvoted, setDownvoted] = useState(false);
    const [score, setScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();



    useEffect(async () => {
        const user = await UserService.getUserData(comment.username);
        console.log(user.data[0]._id)
        setUserData(user.data[0])
        console.log(userData._id)
        setScore(comment.upVotes - comment.downVotes)
        setProfilePic(`http://localhost:5000/profilepictures/${user.data[0].ProfilePicture}`);
        const replyData = await CommentService.getReplies(comment._id);
        setReplies(replyData.data)
        const auth = await AuthService.getCurrentUser();
        if (auth !== null) {
            setAuthData(auth)
            if (comment.upVotedBy.includes(auth.id)) {
                setUpvoted(true)
            }

            if (comment.downVotedBy.includes(auth.id)) {
                setDownvoted(true)
            }
        } else {
            setAuthData(null)
        }
        console.log(comment)
        console.log(userData)

        setIsLoading(false)
    }, [])

    const getReplies = async () => {
        if (viewReplies) {
            setViewReplies(false);
        } else {
            setViewReplies(true);
        }
    }

    const editComment = async () => {
        await CommentService.editComment(
            comment._id,
            editBody
        )
        comment.body = editBody
        setEdit(false)
        window.location.reload(false);
    }

    const upVote = async() => {

        if (!upvoted) {
            try {
                await CommentService.upvoteComment(comment._id, authData.id)
            } catch (error) {
                console.log(error)
                return
            }
            if (downvoted) {
                setScore(score + 2)
            } else {
                setScore(score + 1)
            }
            setUpvoted(true)
            setDownvoted(false)

        } else {
            try {
                await CommentService.upvoteComment(comment._id, authData.id)
            } catch (error) {
                console.log(error)
                return
            }

            setUpvoted(false)
            setScore(score - 1)
        }

    }

    const downVote = async() => {

        if (!downvoted) {
            try {
                await CommentService.downvoteComment(comment._id, authData.id)
            } catch (error) {
                console.log(error)
                return
            }

            if (upvoted) {
                setScore(score - 2)
            } else {
                setScore(score - 1)
            }

            setDownvoted(true)
            setUpvoted(false)
        } else {
            try {
                await CommentService.downvoteComment(comment._id, authData.id)
            } catch (error) {
                console.log(error)
                return
            }
            setDownvoted(false)
            setScore(score + 1)
        }
    }

    const clearComment = () => {
        setLimitNotice(false)
        setEdit(false)
    }

    const handleChange = (event) => {
        if (event.target.value.length > 300) {
            setLimitNotice(true)
            return
        } else {
            setLimitNotice(false)
        }
        setEditBody(event.target.value)
    }

    const clickEdit = async () => {
        if (edit) {
            setEdit(false);
        } else {
            setEdit(true);
            setEditBody(comment.body)
        }
    }


    return (
        <div className="comment">
                <Grid container wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Avatar alt="Remy Sharp" src={profilePic} />
                    </Grid>
                    <Grid justifyContent="left" item xs zeroMinWidth>
                        <p>{comment.ProfilePicture}</p>

                        { (userData.flairOption === "E") && (
                            <h4 className="username"
                                onClick={() => {navigate('/profile/' + comment.username)}}
                                style={{ margin: 0, textAlign: "left"}}>{comment.username}</h4> )}

                        { (userData.flairOption !== "E") && (
                            <h4 className="username"
                                onClick={() => {navigate('/profile/' + comment.username)}}
                                style={{ margin: 0, textAlign: "left", float: "left"}}>{comment.username}</h4> )}

                        { (userData.flairOption === "A") &&
                            (<SchoolIcon style={{marginLeft: "10px", color: "#0db832"}}/>)}

                        { (userData.flairOption === "B") &&
                            (<RocketLaunchIcon style={{marginLeft: "10px", color: "deepskyblue"}}/>)}

                        { (userData.flairOption === "C") &&
                            (<MenuBookIcon style={{marginLeft: "10px", color: "orangered"}}/>)}

                        { (userData.flairOption === "D") &&
                            (<StarIcon style={{marginLeft: "10px", color: "gold"}}/>)}

                        { !edit &&  (
                        <div style={{maxWidth: "300px", marginTop: "10px"}}>
                            <p style={{ textAlign: "left", wordWrap: "break-word"}}>
                                {comment.body}
                            </p>
                        </div> )}

                        { edit && (
                            <div style={{maxWidth: "300px", marginTop: "10px"}}>
                                <TextField style={{ width: "300px", marginTop: "10px", marginBottom: "15px" }}
                                           id="outlined-multiline-static"
                                           label="Edit comment"
                                           multiline
                                           autoFocus
                                           rows={4}
                                           value={editBody}
                                           onChange={handleChange}
                                />
                            </div>
                        )}

                        { edit && (<div style={{paddingBottom: "30px"}}>
                            { limitNotice && (<p style={{color: "red"}}>
                                Comment cannot not exceed 300 characters</p>)}
                            { !limitNotice && (<Button style={{backgroundColor: "lightsteelblue"}}
                                                       variant="contained" onClick={editComment}>Edit</Button>)}
                            <Button style={{backgroundColor: "lightgray", marginLeft: "15px"}}
                                    variant="contained" onClick={clearComment}>Cancel</Button>
                        </div>)}

                        { (authData !== null && !isLoading) && (
                            <div>
                                {upvoted &&
                                (<ThumbUpIcon onClick={() => upVote()} className="thumbs-up1"/>)}
                                {!upvoted &&
                                (<ThumbUpIcon onClick={() => upVote()} className="thumbs-up2"/>)}

                                <p style={{fontWeight: "bold", float: "left", marginLeft: "10px"}}>{score}</p>

                                {downvoted &&
                                (<ThumbDownIcon onClick={() => downVote()} className="thumbs-down1"
                                              style={{marginLeft: "10px"}} />)}
                                {!downvoted &&
                                (<ThumbDownIcon onClick={() => downVote()} className="thumbs-down2"
                                              style={{marginLeft: "10px"}} />)}

                            </div>
                        )}

                        { (authData === null && !isLoading) && (
                            <p style={{fontWeight: "bold", float: "left"}}>{score}</p>
                        )}

                        { (!comment.edited && !isLoading) && (
                            <p style={{ textAlign: "left", color: "gray", float: "left", marginLeft: "10px"}}>
                                Posted: {comment.postDate.substring(0, 10)}
                            </p>
                        )}

                        { (comment.edited && !isLoading) && (
                            <p style={{ textAlign: "left", color: "gray", float: "left", marginLeft: "10px"}}>
                                Posted: {comment.postDate.substring(0, 10)} (edited)
                            </p>
                        )}



                        { (authData !== null && authData.username === comment.username) &&
                            (<EditIcon onClick={clickEdit} className="edit-link">edit post</EditIcon>)}


                        { (comment.numReplies != 0) && (<p className="replies-link" onClick={getReplies}
                           style={{ textAlign: "left", marginTop: "55px"}}>view replies ({comment.numReplies})</p>)}

                    </Grid>
                </Grid>

                {viewReplies && (
                    <List>
                        { replies.map( (reply) => (
                            <ListItem key={reply._id} item xs={12} sm={6}>
                                <Paper style={{ padding: "10px 20p" +
                                        "x", marginTop: 10, width: 450 }}>
                                    <Grid container wrap="nowrap" spacing={2}>
                                        <Grid item>
                                            <Avatar alt="Remy Sharp"
                                                    src={`http://localhost:5000/profilepictures/${reply.profilePic}`}/>
                                        </Grid>
                                        <Grid justifyContent="left" item xs zeroMinWidth>
                                            <p>{reply.ProfilePicture}</p>

                                            { (reply.flairOption === "E") && (<h4 className="username"
                                                     onClick={() => {navigate('/profile/' + comment.username)}}
                                                     style={{ margin: 0, textAlign: "left" }}>{reply.username}</h4>)}

                                            { (reply.flairOption !== "E") && (<h4 className="username"
                                                     onClick={() => {navigate('/profile/' + comment.username)}}
                                                     style={{ margin: 0, textAlign: "left", float: "left"}}>
                                                     {reply.username}</h4>)}

                                            { (reply.flairOption === "A") &&
                                            (<SchoolIcon style={{marginLeft: "10px", color: "#0db832"}}/>)}

                                            { (reply.flairOption === "B") &&
                                            (<RocketLaunchIcon style={{marginLeft: "10px", color: "deepskyblue"}}/>)}

                                            { (reply.flairOption === "C") &&
                                            (<MenuBookIcon style={{marginLeft: "10px", color: "orangered"}}/>)}

                                            { (reply.flairOption === "D") &&
                                            (<StarIcon style={{marginLeft: "10px", color: "gold"}}/>)}

                                            <div style={{maxWidth: "300px", marginTop: "10px"}}>
                                                <p style={{ textAlign: "left", wordWrap: "break-word"}}>
                                                    {reply.body}
                                                </p>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </ListItem> ))}
                    </List>
                )}
        </div>
    )
}


export default Comment;