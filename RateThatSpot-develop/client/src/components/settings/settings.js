import React, {Component, useEffect, useState} from "react";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import {useParams} from "react-router";
import Button from '@material-ui/core/Button';
import { useNavigate } from "react-router-dom";


const Settings = () => {

    const [authData, setAuthData] = useState({})
    const { username } = useParams()
    const navigate = useNavigate();

    useEffect(async () => {
        const auth = await AuthService.getCurrentUser()
        if (auth === undefined || auth.username != username) {
            navigate('/')
        } else {
            setAuthData(auth)
        }

    }, [username])

    return (

        <div className="container" style={{marginLeft: "20px"}}>

            <header className="jumbotron">
                <h3 style={{marginTop: "30px"}}>
                    <strong>{username}'s</strong> Settings Page
                </h3>
            </header>

            <div style={{marginTop: "30px"}}>
                <Button style={{fontWeight: "bold", backgroundColor: "black", color: "white", width: "250px"}}
                        variant="contained" onClick={() => {navigate('/updatePassword/' + username)}}>
                    Update password
                </Button>
            </div>
            <div style={{marginTop: "30px"}}>
                <Button style={{fontWeight: "bold", backgroundColor: "black", color: "white", width: "250px"}}
                        variant="contained" onClick={() => {navigate('/privacySettings/' + username)}}>
                    Privacy settings
                </Button>
            </div>
            <div style={{marginTop: "30px"}}>
                <Button style={{fontWeight: "bold", backgroundColor: "black", color: "white", width: "250px"}}
                        variant="contained" onClick={() => {navigate('/flairSettings/' + username)}}>
                    Flair Settings
                </Button>
            </div>
            <div style={{marginTop: "30px"}}>
                <Button variant="contained" onClick={() => {navigate('/changeProfilePic/' + username)}}
                        style={{fontWeight: "bold", backgroundColor: "black", color: "white", width: "250px"}}>
                    Profile Picture
                </Button>
            </div>

            <div style={{marginTop: "30px"}}>
                <Button style={{fontWeight: "bold", backgroundColor: "black", color: "white", width: "250px"}}
                        variant="contained" onClick={() => {navigate('/activityPage/' + username)}}>
                    Activity Page
                </Button>
            </div>

            <div style={{marginTop: "30px"}}>
                <Button style={{fontWeight: "bold", backgroundColor: "black", color: "white", width: "250px"}}
                        variant="contained" onClick={() => {navigate('/uiSettings/' + username)}}>
                    UI Style
                </Button>
            </div>

            <div style={{marginTop: "20px"}}>
                <Button style={{fontWeight: "bold", backgroundColor: "black", color: "white", width: "250px"}}
                        variant="contained" onClick={() => {navigate('/helpPage')}}>Help Page</Button>
            </div>

            <div style={{marginTop: "20px"}}>
                <Button style={{fontWeight: "bold", backgroundColor: "#c40000", color: "black", width: "250px"}}
                        variant="contained" onClick={() => {navigate('/deleteAccount/' + username)}}>
                    Delete Account
                </Button>
            </div>
        </div>

    );

}

export default Settings;