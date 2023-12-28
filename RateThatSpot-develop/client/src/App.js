import React, { Component } from "react";
import { Link } from "react-router-dom";
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import AuthService from "./services/auth.service";
import Navbar from "./components/navbar";
import Register from "./auth/register";
//import RecordList from "./components/recordList";
//import Edit from "./components/edit";
//import Create from "./components/create";
import CreatePost from "./components/posts/createPost";
import ViewPost from "./components/posts/viewPost";
import EditPost from "./components/posts/editPost"
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./components/home.component";
import Profile from "./components/profile/profile.component";
import Login from "./auth/Login";
import UserBoard from "./components/userboard.component";
import Moderator from "./auth/Moderator"; 
import ForgotPassword from "./auth/ForgotPassword"; 
import RecoverPassword from "./auth/RecoverPassword"; 
import VerifyAccount from "./auth/VerifyAccount"; 
import PageNotFound from "./components/404page.component";
import {withAlert} from 'react-alert';
import Buildings from "./components/buildings/buildings";
import Settings from "./components/settings/settings"
import ChangePassword from "./components/settings/change-password/change-password"
import UserSearchPage from "./components/users/userSearch";
import Facilities from "./components/facilities";
import FacilitiesByBuilding from "./components/facilitiesbybuilding";
import SearchBuildings from "./components/searchbuildings";
import SingleFacility from "./components/SingleFacility"
import Notifications from "./components/notifications";
import Privacy from "./components/settings/privacy/privacy";
import UserFlairs from "./components/settings/user-flairs/user-flairs"
import Comments from "./components/comments/comments"
import CreateFacilityRequest from "./components/facilityRequests/createFacilityRequest";
import NewNav from "./components/navbar.component";
import PrimarySearchAppBar from "./components/navbar.component";
import ProfilePicture from "./components/settings/profile-picture/profile-picture";
import ViewFacilityRequest from "./components/facilityRequests/viewFacilityRequest";
import ViewAllFacilityRequests from "./components/facilityRequests/viewAllFacilityRequests";
import RulesPage from "./components/rules";
import Contact from "./components/contact";
import ActivityPage from "./components/settings/activity-page/activity-page";
import BlockedFollowedUsers from "./components/profile/profile.followedBlockedUsers";
import UserTheme from "./components/settings/change-theme/change-theme";
import './styles/base.css'
import DeleteAccount from "./components/settings/delete-account/delete-account";
import ListBanned from "./auth/bannedUsers/listBanned";
import HelpPage from "./components/settings/help-page/help-page"
 
class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);
    //can add moderator role to state
    this.state = {
      currentUser: undefined,
      showButton: false,
      bcolor: "#f8f8ffd4",
      navColor: "black",
      navTextColor: "white",
      uiSetting: 0
    };
  }
  //get current logged in user
  componentDidMount() {
    const user = AuthService.getCurrentUser();
    console.log(user);
    if (user) {
      this.setState({
        currentUser: user
        //can set moderator here
      });

      if (user === undefined || user === null || !user.uiSetting || String(user.uiSetting) === "0") {
        this.setState({uiSetting: "0"})
        document.getElementsByTagName('body')[0].style.backgroundColor= "#f8f8ffd4"
        this.setState({navColor: "black"})
        this.setState({navTextColor: "white"})
      }
      else if (String(user.uiSetting) === "1") {
        this.setState({uiSetting: "1"})
        document.getElementsByTagName('body')[0].style.backgroundColor= "#eae0c8"
        this.setState({navColor: "black"})
        this.setState({navTextColor: "whilte"})
      }
      else {
        this.setState({uiSetting: "2"})
        document.getElementsByTagName('body')[0].style.backgroundColor= "#d4ebf2"
        this.setState({navColor: "white"})
        this.setState({navTextColor: "black"})
      }
    }

    // Adding event listener for back to top button
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        this.setState({showButton: true});
      } else {
        this.setState({showButton: false});
      }
    });
  }
  logOut() {
    AuthService.logout();
    document.getElementsByTagName('body')[0].style.backgroundColor= "#f8f8ffd4"
  }

  // Scroll to top function for back to top button
  scrollToTop = () =>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  componentDidUpdate() {
  }

  changeUISetting = (e) => {
    this.setState({uiSetting: String(e.target.value)})
    if (String(e.target.value) === "0") {
      this.setState({uiSetting: "0"})
      document.getElementsByTagName('body')[0].style.backgroundColor= "#f8f8ffd4"
      this.setState({navColor: "black"})
      this.setState({navTextColor: "white"})
    }
    else if (String(e.target.value) === "1") {
      this.setState({uiSetting: "1"})
      document.getElementsByTagName('body')[0].style.backgroundColor= "#eae0c8"
      this.setState({navColor: "black"})
      this.setState({navTextColor: "white"})
    }
    else {
      this.setState({uiSetting: "2"})
      document.getElementsByTagName('body')[0].style.backgroundColor= "#d4ebf2"
      this.setState({navColor: "white"})
      this.setState({navTextColor: "black"})
    }
  }


  //render routes
  render () {
    const { currentUser } = this.state;
    const alert = this.props.alert;
    return (
      //please clean up navbar by making component (saved someone time)
      <div style={{"height": "100vh"}}>
      <PrimarySearchAppBar navColor={this.state.navColor} navTextColor={this.state.navTextColor}/>
        <div style={{"height": "100vh"}}>
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/register" element={<Register alert={alert}/>} />
            <Route exact path="/login" element={<Login alert={alert}/>} />
            <Route exact path="/forgotpassword" element={<ForgotPassword />} />
            <Route exact path="/moderator" element={<Moderator />} />
            <Route exact path="/recover/:token" element={<RecoverPassword />} />
            <Route exact path="/verify/:token" element={<VerifyAccount />} />
            <Route exact path="/profile/:username" element={<Profile />} />
            <Route exact path="/user" element={<UserBoard />} />
            <Route path="*" element={<PageNotFound />} />
            <Route exact path="/buildings" element={<Buildings />} />
            <Route exact path="/createPost/:id" element={<CreatePost />} />
            <Route exact path="/viewPost/:id" element={<ViewPost />} />
            <Route exact path="/editPost/:id" element={<EditPost />} />
            <Route exact path="/comments/:id" element={<Comments />} />
            <Route exact path="/settings/:username" element={<Settings />} />
            <Route exact path="/privacySettings/:username" element={<Privacy />} />
            <Route exact path="/flairSettings/:username" element={<UserFlairs />} />
            <Route exact path="/updatePassword/:username" element={<ChangePassword />} />
            <Route exact path="/changeProfilePic/:username" element={<ProfilePicture />} />
            <Route exact path="/searchUsers" element={<UserSearchPage />} />
            <Route exact path="/facilitiesList" element={<Facilities />} />
            <Route exact path="/building/search/:searchKey" element={<SearchBuildings/>} />
            <Route exact path="/facilities/bldgabbr/:abbr" element={<FacilitiesByBuilding/>}/>
            <Route exact path="/facility/:id" element={<SingleFacility/>}/>
            <Route exact path="/notifications" element={<Notifications/>}/>
            <Route exact path="/createFacilityRequest/:abbr" element={<CreateFacilityRequest/>}/>
            <Route exact path="/viewFacilityRequest/:id" element={<ViewFacilityRequest/>} />
            <Route exact path="/viewAllFacilityRequests" element={<ViewAllFacilityRequests />} />
            <Route exact path="/rules" element={<RulesPage/>}/>
            <Route exact path="/contact" element={<Contact/>}/>
            <Route exact path="/activityPage/:username" element={<ActivityPage />} />
            <Route exact path="/followedUsers/:username" element={<BlockedFollowedUsers />} />
            <Route exact path="/uiSettings/:username" element={<UserTheme uiSetting={this.state.uiSetting} changeUISetting={this.changeUISetting}/>}/>
            <Route exact path="/deleteAccount/:username" element={<DeleteAccount />} />
            <Route exact path="/listBanned" element={<ListBanned />} />
            <Route exact path="/helpPage" element={<HelpPage></HelpPage>} />
          </Routes>
        </div>
        {this.state.showButton && (
          <button onClick={this.scrollToTop} className="btn btn-large waves-effect waves-light hoverable blue accent-3" style={{
            position: 'fixed',
            bottom: '50px',
            right: '20px',
            'fontSize': '35px',
            background: 'blue',
            color: 'white',
            cursor: 'pointer',
            'borderRadius': '150px',
            border: 'none',
          }}>
            &#8679;
          </button>
        )}
      </div>
    );
  }
};
 
export default withAlert()(App);