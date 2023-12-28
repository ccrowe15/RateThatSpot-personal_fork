import React, {Component, useEffect, useState} from "react";
import AuthService from "../../../services/auth.service";
import UserService from "../../../services/user.service";
import {useNavigate} from "react-router-dom";
import {useParams} from "react-router";
import {List, ListItem} from "@material-ui/core";
import Paper from "@mui/material/Paper";
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import CommentIcon from '@mui/icons-material/Comment';
import styles from './styles.css'

import Comment from "../../comments/comment/comment";
import {CircularProgress} from "@mui/material";


const ActivityPage = () => {

    const [authData, setAuthData] = useState({})
    const [userData, setUserData] = useState({})
    const [interactions, setInteractions] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();
    const { username } = useParams()

    useEffect(async () => {
        const auth = await AuthService.getCurrentUser()
        if (auth == undefined) {
            navigate('/')
        } else {
            setAuthData(auth)
        }
        const userInfo = await UserService.getUserData(username)
        setUserData(userInfo.data[0])
        console.log(userInfo.data[0])

        const interactions = await UserService.getUserInteractions(userInfo.data[0]._id)
        console.log(interactions.data)
        setInteractions(interactions.data.reverse());

        setIsLoading(false)

    }, [username])

    return (
        <div>
            <h2 style={{marginLeft: "20px", marginTop: "30px", fontWeight: "bold"}}>{username}'s Activity Page</h2>
            { !isLoading && (<List style={{width: "500px"}}>
                { interactions.map( (interaction) => (
                    <ListItem key={interaction._id} item xs={12} sm={6}>
                        <Paper style={{ padding: "10px 20p" +
                                "x", marginTop: 10, width: 475 }}>
                            { interaction.type === "upvote" && (
                                <div style={{marginTop: "10px"}}>
                                    <ThumbUpIcon style={{float: "left", marginRight: "10px", color: "orangered"}}/>
                                    <p>You upvoted post: {interaction.post}</p>
                                    <p> {interaction.interactionDate} </p>
                                </div>
                            )}

                            { interaction.type === "downvote" && (
                                <div style={{marginTop: "10px"}}>
                                    <ThumbDownIcon style={{float: "left", marginRight: "10px", color: "dodgerblue"}}/>
                                    <p>You downvoted post: {interaction.post}</p>
                                    <p> {interaction.interactionDate} </p>
                                </div>
                            )}

                            { interaction.type === "comment" && (
                                <div style={{marginTop: "10px"}}>
                                    <CommentIcon style={{float: "left", marginRight: "10px", color: "lightslategray"}}/>
                                    <p>You commented on post: {interaction.post}</p>
                                    <p> {interaction.interactionDate} </p>
                                </div>
                            )}
                            <p onClick={() => navigate('/viewPost/' + interaction.post)} className="view-post">view post</p>
                        </Paper>
                    </ListItem> ))}
            </List>)}
            { isLoading === true && (
                <div style={{marginTop: "30px", marginLeft: "30px"}}>
                    <CircularProgress/>
                    <h4 style={{marginTop: "20px"}}>loading...</h4>
                </div>)}
        </div>
    )

}

export default ActivityPage;