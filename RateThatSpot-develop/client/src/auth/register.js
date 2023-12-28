import React, {Component} from 'react'
import { Link } from "react-router-dom";
import axios from "axios";
import history from '../history';
import {withAlert} from 'react-alert';
import userService from '../services/user.service';



class Register extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
      passwordConfirm: "",
      errors: {},
    };

  }

  onChange = e => {
    this.setState({ [e.target.id]: e.target.value});
  };

  // These functions will update the state properties
  onSubmit = e => {
    e.preventDefault();

    if (this.state.password !== this.state.passwordConfirm) {
      this.props.alert.show("Passwords do not match!", {type: 'error'});
      return
    }

    // When a post request is sent to the create url, we'll add a new user into the database
    const newUser = {
      name: this.state.username,
      email: this.state.email,
      password: this.state.password
    };

    userService.registerUser(newUser).then(
      () => {
        history.push("/login");
        window.location.reload();
      },
      error => {
        console.log(error.response)
        if (error.response.status == 400) {
          console.log("here");
          if (error.response.data.email == "Email is already used by another account!") {
            this.props.alert.show("Email is already in use!", {type: 'error'});
          } else if (error.response.data.name == "Username is already used by another account!") {
            this.props.alert.show("Username is already in use!", {type: 'error'});
          } else if (error.response.data.email == "email must be from a purdue.edu domain") {
            this.props.alert.show("Email must be hosted on a purdue.edu domain", {type: 'error'});
          }
        }
      }
    )
  };

  // This function will handle the submission
  render() {
    const { errors } = this.state;
    return (
      <div className="container">
      <div style={{ marginTop: "4rem" }} className="row justify-content-center">
        <div className="col-md-6">
          <div className="card" style={{padding: "3%"}}>
            <div className="col s12" style={{ paddingLeft: "11.250px" }}>
            <h2>
              <b>Register</b>
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
                value={this.state.email}
                error={errors.email}
                id="email"
                type="email"
                />
                <label htmlFor="email">Email</label>
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
              <div className="input-field col s12">
                <input
                onChange={this.onChange}
                value={this.state.passwordConfirm}
                error={errors.passwordConfirm}
                id="passwordConfirm"
                type="password"
                />
                <label htmlFor="passwordConfirm">Confirm Password</label>
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
                Signup
                </button>
                <div style={{"marginTop": "5%"}}>
                  <p className="grey-text text-darken-1">
                  Already have an account? <Link to="/login">Login</Link>
                  </p>
                </div>
              </div>
            </form>
            </div>
          </div>
          </div>
        </div>
    );
  }
}
export default Register;