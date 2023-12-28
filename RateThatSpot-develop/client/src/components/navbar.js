import React, { Component } from "react";
import AuthService from "../services/auth.service";
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";

// We import NavLink to utilize the react router.
import { Link } from "react-router-dom";
import UserSearchBox from "./users/userSearchBar";
import SearchBox from "./searchBox";
import HomeIcon from '@mui/icons-material/Home';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
 
export default class Navbar extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    //can add moderator role to state
    this.state = {
      currentUser: undefined
    };  
  }

  logOut() {
    AuthService.logout();
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();
    if (user) {
      this.setState({
        currentUser: user
        //can set moderator here
      });
    }
  }

  render() {
    const { currentUser } = this.state;
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between" style={{height: "150%"}}>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
            <Link to={"/"} className="nav-link">
              <HomeIcon fontSize="large" float="right">
              </HomeIcon>
              </Link>
            </li>
          </div>

          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/buildings"} className="nav-link">
                Buildings
              </Link>
            </li>
            <li className="nav-item">
            <Link to={"/facilitiesList"} className="nav-link">
                Facilities
              </Link>
            </li>
          </div>
          <div className="navbar-nav ml-auto" style={{justifyContent: "right"}}>
            <li className="nav-item">
              <UserSearchBox>
              </UserSearchBox>
            </li>
            <li className="nav-item">
              <SearchBox>
              </SearchBox>
            </li>
          </div>
        
          <div className="navbar-nav ml-auto">
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile/" + currentUser.username} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/settings/" + currentUser.username} className="nav-link">
                  Settings
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
          </div>
        </nav>
    )
  }

}
