import React, {Component, useEffect, useState} from "react";
import AuthService from "../../../services/auth.service";
import UserService from "../../../services/user.service";
import {useParams} from "react-router";
import {Button, TextField, InputLabel, FormControl, OutlinedInput, InputAdornment, IconButton} from '@material-ui/core';
import { useNavigate } from "react-router-dom";

import Input from '@material-ui/core';
import FilledInput from '@material-ui/core';
import FormHelperText from '@material-ui/core';



const ChangePassword = () => {

    const [authData, setAuthData] = useState({})
    const [alert, setAlert] = useState(false);
    const [update, setUpdate] = useState(false);
    const { username } = useParams()
    const navigate = useNavigate();

    useEffect(async () => {
        const auth = await AuthService.getCurrentUser()
        if (auth == undefined) {
            navigate('/')
        } else {
            setAuthData(auth)
        }

    }, [username])

    const [values, setValues] = React.useState({
        current_password: '',
        new_password: '',
        showPassword: false,
    });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const updatePassword = async () => {
        console.log('current password: ' + values.current_password)
        console.log('new password: ' + values.new_password)

        const validate1 = await UserService.validateCredentials( {
            username: username,
            password: values.new_password });

        if (validate1.data.message === "Valid") {
            setAlert(true);
            setUpdate(false);
            return;
        }

        const validate2 = await UserService.validateCredentials( {
            username: username,
            password: values.current_password });

        if (validate2.data.message === "Valid") {
            const updatePassword = await UserService.updatePassword( {
                username: username,
                password: values.new_password });
            console.log(updatePassword)
            if (updatePassword) {
                console.log('Password successfully updated')
                setAlert(false);
                setUpdate(true);
            }
        } else {
            setAlert(true);
            setUpdate(false);
        }
    }


    return (
        <div className="container" style={{marginLeft: "30px"}}>
        <div>

            <header className="jumbotron">
                <h3 style={{marginTop: "30px"}}>
                    <strong>Update Profile Settings</strong>
                </h3>
            </header>
            <h4>Enter current and updated password:</h4>

            { (alert && (
                <p style={{ color: 'red' }} >
                    ERROR: Current password is incorrect or new password is invalid, please try again.
                </p>
            ))}

            { (update && (
                <p style={{ color: 'green' }} >Password successfully updated.</p>
            ))}

            <FormControl  style={{ marginTop: '1rem' }} variant="outlined">
                <InputLabel htmlFor="outlined-adornment-password">Current password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.current_password}
                    onChange={handleChange('current_password')}
                    label="Password"
                />
            </FormControl>
            <FormControl  variant="outlined" style={{ marginLeft: '1rem', marginTop: '1rem' }}>
                <InputLabel htmlFor="outlined-adornment-password">New password</InputLabel>
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.new_password}
                    onChange={handleChange('new_password')}
                    label="Password"
                />
            </FormControl>
        </div>
            <Button style={{ marginTop: '30px', fontWeight: "bold" }} onClick={() => {updatePassword()}} variant="contained">
                Update Password
            </Button>
        </div>

    );

}

export default ChangePassword;