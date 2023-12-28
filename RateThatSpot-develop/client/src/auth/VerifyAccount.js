import React, {Component, useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import history from '../history';

const API_URL = "http://localhost:5000/users/";

//class RecoverPassword extends Component {
function VerifyAccount() {
    // analagous to constructor for older react versions
    const [valid, setValid] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    
    // extract token from :token param in the page link
    const { token } = useParams();

    // on page load, get route to see if token is valid
    // analagous to componentDidMount() 
    useEffect(async() => {  
        await axios.get(`${API_URL}verify/${token}`)
        .then(response => {
            if (response.data.message === 'valid token') {
                // server sent valid response and username
                setValid(true);
                setIsLoading(false);
                setError(false);
            } else {
                // invalid token
                setValid(false);
                setIsLoading(false);
                setError(true);
            }
        }).catch(error => {
            console.log(error.data);
        });
    }, []); // this empty array[] makes useEffect run only once on pageload

        
    if (error) {
        return (
        <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
        <div className="col s8 offset-s2">
            <h4>Verification token was not found, try creating a new account.</h4>
            <h4>If you remember your account email, try to recover your account through the login page.</h4>
        </div>
        </div>
        </div>
        );
    } else if (isLoading) {
        return (
            <div className="container">
            <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8 offset-s2">
                <h4>Validating account verification token.</h4>
            </div>
            </div>
            </div>
        )
    }
    else if (valid) {
        return (
            <div className="container">
            <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8 offset-s2">
            <h3>Your account has been verified, head to the login page to access your account.</h3>
            </div>
            </div>
            </div>
        );
    }
}

export default VerifyAccount;