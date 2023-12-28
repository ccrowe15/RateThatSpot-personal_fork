import { useEffect, useState } from "react"
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import {useParams, useNavigate} from "react-router";
import { Box, Button, ButtonGroup, Card, CardActions, CardContent, Container, List, Typography } from "@material-ui/core";
import UserCard from "../users/userCard";
import { CardHeader, Stack } from "@mui/material";

const BlockedFollowedUsers = () => {
  const {username} = useParams();
  const [userView, setUserView] = useState("Followed");
  const [userData, setUserData] = useState({})
  const [authData, setAuthData] = useState({})
  const [followedUsers, setFollowedUsers] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])
  const [blocked, setBlocked] = useState(false)
  const navigate = useNavigate();

  useEffect(() =>{
    async function fetchData () {
      // Check if the user is logged in
      const authData = await AuthService.getCurrentUser()
      if (authData !== null || authData !== undefined) {
        setAuthData(authData);
      }
      else {
        setAuthData(null);
      }

      // Get the data of the user whose profile you are viewing
      const userData = await UserService.getUserData(username);
      if (userData !== null || userData !== undefined) {
        const followedUsers = await UserService.getFollowedUsers(username);
        setFollowedUsers(followedUsers.data);
        // Get all info regarding a logged in user
        if (authData !== null || authData !== undefined) {
          setBlocked(userData.data[0].blockedUsers.includes(authData.username))
          if (authData.username === username) {
            const blockedUsers = await UserService.getBlockedUsers(username);
            setBlockedUsers(blockedUsers.data);
          }
        }
      }
      else {
        navigate("*")
      }
    }
    fetchData();
  }, [username])

  // List followed users
  const listFollowedUsers = () => {
    if (followedUsers !== undefined && followedUsers.length !== 0) {
        return followedUsers.map((user) =>{
            return (
                <UserCard
                    user={user}
                    key={user._id}
                />
            )
        })
    }
  }

  const listBlockedUsers = () => {
    if (blockedUsers !== undefined && blockedUsers.length !== 0) {
        return blockedUsers.map((user) =>{
            return (
                <UserCard
                    user={user}
                    key={user._id}
                />
            )
        })
    }
  }

  return (
    <Container>
      <Stack
      display="flex"
      alignItems="center">
          <Card>
            <CardContent style={{"textAlign": "center"}}>
                <Typography gutterBottom variant="h5" component="div">
                    {username}'s {userView} Users
                </Typography>
            </CardContent>
            <CardActions>
                <Button onClick={() => setUserView('Followed')}>Followed Users</Button>
                {(authData !== undefined && (authData !== null && authData.username === username)) && (
                    <Button onClick={() => setUserView('Blocked')}>Blocked Users</Button>
                )}
            </CardActions>
          </Card>
      
      { (userView === 'Followed' && followedUsers.length !== 0 && followedUsers !== undefined) && (
          <List>
              {listFollowedUsers()}
          </List>
      )}

      {(userView === 'Blocked' && followedUsers.length !== 0 && followedUsers !== undefined) &&(
          <List>
              {listBlockedUsers()}
          </List>
      )}
      </Stack>
    </Container>
  )
}

export default BlockedFollowedUsers;