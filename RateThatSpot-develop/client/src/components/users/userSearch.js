import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate, useParams } from "react-router";
import {CircularProgress, List, ListItem} from "@material-ui/core";
import UserCard from "./userCard";
const { default: userService } = require("../../services/user.service");


const UserSearchPage = (route) => {
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState(location.state.term);
  const [searchedUsers, setUsers] = useState([]);

  useEffect(async () =>{
    const response = await userService.searchUsers(location.state.term);
    if (response.status != 200) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const users = await response.data;
    setUsers(users);
  },[]);

  function listUsers() {
    return searchedUsers.map((searchedUser) => {
      return(
        <UserCard
          user={searchedUser}
          key={searchedUser._id}
        />
      )
    })
  }

  return (
    !searchedUsers.length ? <CircularProgress/> : (
      <div style={{ justifyContent: 'center'}}>
        <List>
          {listUsers()}
        </List>
      </div>
    )
  )
}
export default UserSearchPage;