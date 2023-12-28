import React, {Component, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import PostService from "../../services/post.service";
import AuthService from "../../services/auth.service";
import {useParams} from "react-router";
import { Link } from "react-router-dom";
import userService from "../../services/user.service";
import {Card, CardActions, CardContent, CardMedia, Button, Typography, CardHeader, Avatar, Grid, Divider} from "@material-ui/core";
import { Rating } from "@mui/material";
import UserService from "../../services/user.service";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from "@mui/icons-material/ThumbDown";

const Post = () => {
    const [post, setPostData] = useState({});
    const [postAuth, setPostAuth] = useState({});
    const [userData, setUserData] = useState({});
    const [favoritedPosts, setFavoritedPosts] = useState([{}]);
    const [favorited, setFavorited] = useState(false)
    const { id } = useParams()
    const navigate = useNavigate();
    const [hasVoted, setHasVoted] = useState({})
    const [profilePic, setProfilePic] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(async () => {
        //get post from id
        const postData = await PostService.getSinglePost(id);
        setPostData(postData.data);
        
        //set profile picture
        //setProfilePic(`http://localhost:5000/profilepictures/${postAuth.ProfilePicture}`);
        console.log(postData.data.username)

        if (postData.data.username !== "[deleted]") {
            await PostService.getPostAuthor(postData.data.author).then((user) => {
                setPostAuth(user.data)
            })
        }

        //get current user
        const auth = await AuthService.getCurrentUser()
        console.log(auth)
        if (auth !== undefined) {
            setUserData(auth)
        } else {
            setUserData(null)
        }
        
        setHasVoted((hasVoted) => ({
            value: 0,   //0 if no vote, 1 if upvote, -1 if downvote
            count: 0,
            hasUpvoted: false,
            hasDownvoted: false
        }));

        if (auth !== null) {
            await userService.getUserData(auth.username)
            .then(user => {
                if (!user) {
                    setFavoritedPosts([]);
                }
                else {
                    setFavoritedPosts(user.data[0].favoritedPosts)
                    console.log(id)
                    setFavorited(user.data[0].favoritedPosts.includes(id))
                }
            })
        }
        setIsLoading(false)
    },[id])

    const addFavoritePost = async() => {
        try {
            await userService.updateFavoritedPosts({
                username: userData.username,
                favoritedPosts: post._id,
                favorite: true
            })
            setFavorited(true)
        } catch (error) {
            console.log(error)
        }
    }

    const removeFavoritePost = async() => {
        console.log(userData.username)
        try {
            await userService.updateFavoritedPosts({
                username: userData.username,
                favoritedPosts: post._id,
                favorite: false
            })
            setFavorited(false)
        } catch (error) {
            console.log(error)
        }
    }

    async function upvotePost(){
        if (hasVoted.hasDownvoted) {
            const downThenUp = await PostService.downThenUp(id);
            console.log(downThenUp)
        }
        setHasVoted((hasVoted) => ({
            value: 1,
            count: hasVoted.count + 1,
            hasUpvoted: true,
            hasDownvoted: false
        }));
        const upvotedPost = await PostService.upvotePost(id);
        await UserService.postUserInteraction(userData.id, post._id, "upvote");
        console.log(upvotedPost)
    }

    async function downvotePost(){
        if (hasVoted.hasUpvoted) {
            const upThenDown = await PostService.upThenDown(id);
            console.log(upThenDown)
        }
        setHasVoted((hasVoted) => ({
            value: -1,
            count: hasVoted.count + 1,
            hasUpvoted: false,
            hasDownvoted: true
        }));
        const downvotedPost = await PostService.downvotePost(id);
        await UserService.postUserInteraction(userData.id, post._id, "downvote");
        console.log(downvotedPost)
    }

    return (
        
        <Grid 
            container
            spacing={1}
            direction="column"
            alignItems="center"
            justify="center"
            sx={{width: 'auto'}}
        >
            <Grid item sx={{m:1}}>
                <Button  size = "small" color="primary" onClick={() => {navigate("/facility/" + post.amenity)}}>
                    Return to Amenity
                </Button>
            </Grid>

            <Grid item sx={{width: 'auto'}}>
            
            {(!isLoading) &&
                <Card sx={{ width: 'auto' }}>
                { (post.username !== "[deleted]" && postAuth.ProfilePicture !== null) &&
                <CardHeader
                    avatar={
                        <Avatar alt="Remy Sharp" src={postAuth.ProfilePicture}/>
                    }
                
                    title= {
                        <h5 className="username"
                                onClick={() => {navigate('/profile/' + post.username)}}
                                style={{ margin: 0, textAlign: "left"}}>{post.username}
                        </h5>
                    }
                />
                }

                { (post.username !== "[deleted]" && postAuth.ProfilePicture === null) &&
                <CardHeader
                    avatar={
                        <Avatar alt="Remy Sharp" />
                    }
                
                    title= {
                        <h5 className="username"
                                onClick={() => {navigate('/profile/' + post.username)}}
                                style={{ margin: 0, textAlign: "left"}}>{post.username}
                        </h5>
                    }
                />
                }
                
                { (post.username === "[deleted]") &&
                <CardHeader
                    avatar={
                        <Avatar alt="Remy Sharp" />
                    }
                
                    title= {
                        <h5 className="username"
                                
                                style={{ margin: 0, textAlign: "left"}}>{post.username}
                        </h5>
                    }
                />
                }
                <CardContent>
                    <Typography gutterBottom variant="h4" component="div">
                        {post.title}
                    </Typography>

                    <Typography variant="body1" color="textPrimary">
                        {post.body}
                    </Typography>
                
                    <p></p>
                
                    <Rating name="postRating" value={Number(post.rating)}  readOnly size='medium'/>
                
                    <p></p>
                
                    <Typography variant="body2" color="textSecondary">
                        Post Score: <span>{Number(post.totalVotes) + hasVoted.value}</span>
                    </Typography>
                
                    <p></p>

                    {(!isLoading) &&
                    <Typography variant="caption" display="block" color="textSecondary">
                        Date Posted: {post.postDate.substring(0,10)}
                    </Typography>}

                    {(post.edited && !isLoading) &&
                    <Typography variant="caption" color="textSecondary">
                        Date of Last Edit: {post.editDate.substring(0,10)}
                    </Typography>}

                </CardContent>
            
                {(userData !== null) &&
                <div>
                    <Divider variant="middle"/>
            
                    <CardActions>
                    {(userData !== null && !isLoading) &&
                        <Button size = "small" onClick={upvotePost} disabled={hasVoted.hasUpvoted}>
                            Upvote
                        </Button>
                    }
                    {(userData !== null && !isLoading) &&
                        <Button size = "small" onClick={downvotePost} disabled={hasVoted.hasDownvoted}>
                            Downvote
                        </Button>
                    }
                    </CardActions>
            
                    <Divider variant="middle"/>
            
                    <CardActions>       
                    {(userData !== null && post.username === userData.username) &&
                        <Button size = "small" onClick={() => {navigate("/editPost/" + post._id)}}>
                            Edit Post
                        </Button>
                    }
            
                    {(userData !== null && !favorited) && (
                        <Button size = "small" onClick={addFavoritePost}>
                            Favorite
                        </Button>
                    )}
                    {(userData !== null && favorited) && (
                        <Button size = "small" onClick={removeFavoritePost}>
                            Unfavorite
                        </Button>
                    )}
                    </CardActions>
                </div>
                }
            
                <Divider variant="middle"/>
                <CardActions>
                    <Button size = "small" onClick={() => {navigate("/comments/" + post._id)}}>
                        View Comments
                    </Button>
                </CardActions>
                </Card>
            }

            </Grid>
        </Grid>
         

    );

}

export default Post;