import React, { Component } from 'react';
import axios from "axios";
const API_URL = "http://localhost:5000/users/";

class ForgotPassword extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            showError: false,
            showNullError: false,
            sent: false
        }
    }

    // on change function for updating element
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = async(e) => {
        // prevent page refresh
        e.preventDefault();
        const  { email } = this.state;
        if (email === '') {
            this.setState({
                showError: false,
                sent: false,
                showNullError: true
            })
        } else {
            // send email 
            try {
                await axios.post(
                    API_URL + "forgotpassword", {
                        email
                }).then(response => {
                    if (response.data.message === 'recovery email sent') {
                        this.setState({
                            showError: false,
                            sent: true,
                            showNullError: false
                        });
                    }
                    else {
                        this.setState({
                            showError: true,
                            showNullError: false,
                            sent: false
                        })
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    render() {
        const {email, sent, showNullError, showError } = this.state;
        return (
            <div className="container">
            <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8 offset-s2">
                <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                    <h4>
                        <b>Enter your account's email below.</b>
                    </h4>
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                    <div className="input-field col s12">
                        <input
                        onChange={this.onChange}
                        value={email}
                        id="email"
                        type="email"
                        />
                        <label htmlFor="email">Email</label>
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
                        Recover Account
                        </button>
                    </div>
                </form>
                {showNullError && (
                    <div>
                        <p>The email address cannot be empty.</p>
                    </div>
                )}
                {showError && (
                    <div>
                        <p> That email address not recognized.</p>
                    </div>
                )}
                {sent && (
                    <div>
                        <h3>Password Reset Email Successfully Sent!</h3>
                    </div>
                )}    
            </div>
            </div>
            </div>
        );
    }
}

export default ForgotPassword;