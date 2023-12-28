import * as React from 'react';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import {useEffect, useState} from "react";
import AuthService from "../../../services/auth.service";
import UserService from "../../../services/user.service";
import {useParams} from "react-router";
import { useNavigate } from "react-router-dom";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import LockIcon from "@mui/icons-material/Lock";
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { green, blue, yellow, red } from '@mui/material/colors';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StarIcon from '@mui/icons-material/Star';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';



const UserFlairs = () => {

    const [state, setState] = React.useState({
        A: false,
        B: false,
        C: false,
        D: false,
        E: false
    });

    const [flairOption, setFlairOption] = React.useState()
    const [authData, setAuthData] = useState({})
    const [changed, setChanged] = useState(false)
    const { username } = useParams()

    const { A, B, C, D, E} = state;
    const error = [A, B, C, D, E].filter((v) => v).length !== 1;
    const navigate = useNavigate();


    useEffect(async () => {
        const auth = await AuthService.getCurrentUser()
        if (auth === undefined) {
            navigate('/')
        } else {
            setAuthData(auth)
        }

        const userData = await UserService.getUserData(username)

        if (userData.data[0].flairOption === null) {
            setFlairOption(null)
            setState({
                A: false,
                B: false,
                C: false,
                D: false,
                E: true})
        } else {
            setFlairOption(userData.data[0].flairOption)
            setState({
                ...state,
                [flairOption]: false,
                [userData.data[0].flairOption]: true,
            });
        }

    }, [username])

    const lock = async () => {
        await UserService.updateUserFlair(username, flairOption)
        setChanged(true)
    }

    const unlock = () => {
        setChanged(false);
    }


    const handleChange = async (event) => {
        setState({
            ...state,
            [flairOption]: false,
            [event.target.name]: event.target.checked,
        });
        setFlairOption(event.target.name)
    };


    return (

        <div>
            <header className="jumbotron">
                <h3 style={{marginTop: "30px", marginLeft: "30px"}}>
                    <strong>User flair options</strong>
                </h3>
            </header>
            <Box style={{ display: 'flex', marginTop: "15px" }}>
                <FormControl style={{ m: 3, paddingLeft: "30px" }} component="fieldset" variant="standard">
                    <FormLabel component="legend">Choose user flair</FormLabel>

                    <FormGroup style={{marginTop: "15px"}}>
                        <Avatar style={{backgroundColor: "#0db832"}} variant="rounded">
                            <SchoolIcon />
                        </Avatar>
                        <FormControlLabel
                            control={
                                <Checkbox checked={A} onChange={handleChange} name="A" />
                            }
                            label="A"
                        />
                        <Avatar style={{backgroundColor: "deepskyblue"}} variant="rounded">
                            <RocketLaunchIcon />
                        </Avatar>
                        <FormControlLabel
                            control={
                                <Checkbox checked={B} onChange={handleChange} name="B" />
                            }
                            label="B"
                        />
                        <Avatar style={{backgroundColor: "orangered"}} variant="rounded">
                            <MenuBookIcon />
                        </Avatar>
                        <FormControlLabel
                            control={
                                <Checkbox checked={C} onChange={handleChange} name="C" />
                            }
                            label="C"
                        />
                        <Avatar style={{backgroundColor: "gold"}} variant="rounded">
                            <StarIcon />
                        </Avatar>
                        <FormControlLabel
                            control={
                                <Checkbox checked={D} onChange={handleChange} name="D" />
                            }
                            label="D"
                        />

                        <FormControlLabel
                            control={
                                <Checkbox checked={E} onChange={handleChange} name="E" />
                            }
                            label="No flair"
                        />
                    </FormGroup>
                </FormControl>
            </Box>

            { !changed && (
                <div>
                    <p style={{marginTop: "20px", marginLeft: "30px"}}>click icon to confirm changes</p>
                    <LockOpenIcon onClick={lock} className="lock-open" style={{marginTop: "5px", marginLeft: "28px"}}/>
                </div>
            )}

            { changed && (
                <div>
                    <p style={{marginTop: "20px", marginLeft: "30px", color: "green"}}>changes saved!</p>
                    <LockIcon onClick={unlock} style={{marginTop: "5px", marginLeft: "28px", color: "green"}}/>
                </div>
            )}

        </div>
    )

}

export default UserFlairs;