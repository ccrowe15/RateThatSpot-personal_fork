import React, {Component, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import history from '../history';

const API_URL = "http://localhost:5000/users/";

//class RecoverPassword extends Component {
function RecoverPassword() {
    // analagous to constructor for older react versions
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [update, setUpdate] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [passNoMatch, setPassNoMatch] = useState(false);
    const [passEmpty, setPassEmpty] = useState(false);
    const [error, setError] = useState(false);
    
    // extract token from :token param in the page link
    const { token } = useParams();

    // on page load, get route to see if token is valid
    // analagous to componentDidMount() 
    useEffect(async() => {  
        await axios.get(`${API_URL}recover/${token}`)
        .then(response => {
            if (response.data.message === 'valid token') {
                // server sent valid response and username
                setUsername(response.data.username);
                setUpdate(false);
                setIsLoading(false);
                setError(false);
            } else {
                // invalid token
                setUpdate(false);
                setIsLoading(false);
                setError(true);
            }
        }).catch(error => {
            console.log(error.data);
        });
    }, []); // this empty array[] makes useEffect run only once on pageload

    let onSubmit = async(e) => {
        // prevent page refresh
        e.preventDefault();
        
        if (password === '' || confirmPassword === '') {
            // empty password
            setPassEmpty(true);
            setPassNoMatch(false);
        } else if (password !== confirmPassword) {
            // passwords do not match
            setPassNoMatch(true);
            setPassEmpty(false);
        } else {
            try {
                // post password to back-end
                await axios.post(
                    `${API_URL}recover/${token}`, {
                      username, 
                      password
                }).then(response => {
                    if (response.data.message === 'password updated') {
                        // password successfully updated
                        setUpdate(true);
                        setError(false);
                        setPassEmpty(false);
                        setPassNoMatch(false);
                    }
                    else {
                        // failed to update password
                        setUpdate(false);
                        setError(true);
                        setPassEmpty(false);
                        setPassNoMatch(false);
                    }
                });
            } catch(error) {
                console.log(error);
            }
        }
    }
        
    if (error) {
        return (
        <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
        <div className="col s8 offset-s2">
            <h4>Problem resetting password, please send another link.</h4>
        </div>
        </div>
        </div>
        );
    } else if (isLoading) {
        return (
            <div className="container">
            <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8 offset-s2">
                <h4>Validating password reset token.</h4>
            </div>
            </div>
            </div>
        )
    }
    else {
        return (
            <div className="container">
            <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8 offset-s2">
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <h4>
                        <b>Enter your new password below.</b>
                    </h4>
                </div>
                <form noValidate onSubmit={onSubmit}>
                    <div className="input-field col s12">
                        <input
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        id="password"
                        type="password"
                        />
                        <label htmlFor="password">Password</label>
                    </div>
                    <div className="input-field col s12">
                        <input
                        onChange={e => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                        id="confirmPassword"
                        type="password"
                        />
                        <label htmlFor="confirmPassword">Confirm Password</label>
                    </div>
                    <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                        <button
                         style={{
                            width: "150px",
                            borderRadius: "3px",
                            letterSpacing: "1.5px",
                            marginTop: "1rem"
                        }}
                        type="submit"
                        className="btn btn-large waves-effect waves-light hoverable blue accent-3"
                        >
                        Reset Password
                        </button>
                    </div>
                </form>
                {update && (
                    <div>
                        <h3>Password has been successfully reset, try to login again</h3>
                    </div>
                )}
                {passNoMatch && (
                    <div>
                        <p>Passwords Do Not Match.</p>
                    </div>
                )}
                {passEmpty && (
                    <div>
                        <p>Password fields cannot be empty.</p>
                    </div>
                )}
            </div>
            </div>
            </div>
        );
    }
}

export default RecoverPassword;

