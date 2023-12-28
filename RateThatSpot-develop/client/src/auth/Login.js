import React, { Component } from "react";
import { Link } from "react-router-dom";
//import Form from "react-validation/build/form";
//import Input from "react-validation/build/input";
//import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import history from '../history';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            username: "",
            password: "",
            loading: false,
            message: "",
            errors: '',
            empty: false,
            badpass: false,
            usernotfound: false,
            notverified: false
        }
    };

    //componentDidMount() {
        // If logged in and user navigates to Login page, should redirect them to dashboard
        //if (this.props.auth.isAuthenticated) {
         // history.push("/home");
          //window.location.reload();
        //}
    //}
    //all editable elements have an onChange event
    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        //do not reload page on submission of user information
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });
        
        const userData = {
            username: this.state.username,
            password: this.state.password
        }

        if (this.state.password === '') {
            this.props.alert.show("Password cannot be empty!", {type: 'error'});
            this.setState({
                emptypass: true,
                badpass: false,
                usernotfound: false,
                loading: false,
                notverified: false
            })
            return;
        }

        console.log(userData);
        AuthService.login(this.state.username, this.state.password).then(
            () => {
              history.push("/");
              window.location.reload();
            },
            error => {
                const resMessage =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();
                if (error.response.data.message === 'User Not found.') {
                    this.props.alert.show("User not found!", {type: 'error'});
                    this.setState({
                        loading: false,
                        message: resMessage,
                        badpass: false,
                        emptypass: false,
                        usernotfound: true,
                        notverified: false
                    });
                }
                else if (error.response.data.message === 'Account not Verified!') {
                    this.props.alert.show("Account not nerified!", {type: 'error'});
                    this.setState({
                        loading: false,
                        message: resMessage,
                        badpass: false,
                        emptypass: false,
                        usernotfound: false,
                        notverified: true
                    });
                }
                else {
                    this.props.alert.show("Bad password!", {type: 'error'});
                    // bad password
                    this.setState({
                        loading: false,
                        message: resMessage,
                        badpass: true,
                        emptypass: false,
                        usernotfound: false,
                        notverified: false
                    });
                }
              }
            );
    };

    render() {
        const { errors, badpass, emptypass, usernotfound, notverified } = this.state;  

    return (
        <div className="container">
                <div style={{ marginTop: "4rem" }} className="row justify-content-center">
                    <div className="col-md-6">
                    <div className="card" style={{padding: "3%"}}>
                        <div className="col s12">
                        <h2>
                            <b>Login</b>
                        </h2>
                        </div>
                        <form noValidate onSubmit={this.onSubmit}>
                        <div className="input-field col s12">
                            <input
                            onChange={this.onChange}
                            value={this.state.username}
                            error={errors.username}
                            id="username"
                            type="email"
                            />
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="input-field col s12">
                            <input
                            onChange={this.onChange}
                            value={this.state.password}
                            error={errors.password}
                            id="password"
                            type="password"
                            />
                            <label htmlFor="password">Password</label>
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
                            Login
                            </button>
                        </div>
                        </form>
                        <div style={{"marginTop": "5%"}}>
                            <p className="grey-text text-darken-1">
                                Don't have an account? <Link to="/register">Register</Link>
                            </p>
                            <p className="grey-text text-darken-1">
                                Forgot Your Password? <Link to="/forgotpassword">Recover Account</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    };
};
export default Login;