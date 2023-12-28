import React, {Component, useEffect, useState} from "react";
import AuthService from "../../../services/auth.service";
import UserService from "../../../services/user.service"
import {useParams} from "react-router";
import {useNavigate} from "react-router-dom";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import Button from "@material-ui/core/Button";
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import styles from './styles.css'



const Privacy = () => {

    const { username } = useParams()
    const navigate = useNavigate();
    const [authData, setAuthData] = useState({})
    const label = { inputProps: { 'aria-label': 'Switch demo' } };
    const [locked, setLocked] = useState(false);
    const [profilePrivate, setProfilePrivate] = useState(false);
    const [favoritesPrivate, setFavoritesPrivate] = useState(false);

    const lock = async () => {
        setLocked(true);
        await UserService.updatePrivacySettings(username, profilePrivate, favoritesPrivate);
    }

    const unlock = () => {
        setLocked(false);
    }

    const changeProfilePrivate = () => {
        if (profilePrivate) {
            setProfilePrivate(false)
        } else {
            setProfilePrivate(true)
        }
        console.log('privateProfile: ' + profilePrivate)
    }

    const changeFavoritesPrivate = () => {
        if (favoritesPrivate) {
            setFavoritesPrivate(false)
        } else {
            setFavoritesPrivate(true)
        }
        console.log('favoritesPrivate: ' + favoritesPrivate)
    }


    useEffect(async () => {
        const auth = await AuthService.getCurrentUser()
        if (auth === undefined) {
            navigate('/')
        } else {
            setAuthData(auth)
        }

        const userData = await UserService.getUserData(username)
        console.log(userData.data[0])
        if (userData.data[0].privateProfile) {
            console.log('privateProfile: true')
            setProfilePrivate(true)
        }
        if (userData.data[0].privateFavorites) {
            console.log('privateFavorites: true')
            setFavoritesPrivate(true)
        }

    }, [username])

    const test = () => {
        console.log(profilePrivate)
    }


    return (
        <div className="container" style={{marginLeft: "30px"}}>

            <header className="jumbotron">
                <h3 style={{marginTop: "30px"}}>
                    <strong>Privacy</strong>
                </h3>
            </header>

            <div>
                <FormGroup>
                    <FormControlLabel control={<Switch onChange={changeProfilePrivate}
                        checked={profilePrivate} />} label="Make profile page private" />
                </FormGroup>
            </div>
            <div>
                <FormGroup>
                    <FormControlLabel control={<Switch onChange={changeFavoritesPrivate}
                        checked={favoritesPrivate} />} label="Make favorites list private" />
                </FormGroup>
            </div>

            { !locked && (
                <div>
                    <p style={{marginTop: "30px"}}>click icon to confirm changes</p>
                    <LockOpenIcon onClick={lock} className="lock-open" style={{marginTop: "5px"}}/>
                </div>
            )}

            { locked && (
                <div>
                    <p style={{marginTop: "30px", color: "green"}}>changes saved!</p>
                    <LockIcon onClick={unlock} style={{marginTop: "5px", color: "green"}}/>
                </div>
            )}

        </div>
    );
}
export default Privacy;