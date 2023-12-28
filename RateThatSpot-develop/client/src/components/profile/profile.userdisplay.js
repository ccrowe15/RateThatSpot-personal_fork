import { Avatar, Badge, ButtonGroup, Rating, TextField } from "@mui/material";
import React, {useState} from "react";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/AddCircle";
import { Link, useLocation } from "react-router-dom";
const { Card, CardContent, Grid, CardMedia, Typography, Button, CardActions } = require('@material-ui/core');


const ProfileView = ({username, userData, authData, onBioChange, updateUserBio, userRatio, userRating, followed, blocked, followUser, unfollowUser, blockUser, unblockUser, isCurrentUser, profilepic, banned, isMod, banUser, unBanUser}) => {
  const [edit, setEdit] = useState(false);
  const [editBody, setEditBody] = useState(userData.bio);
  const navigate = useNavigate();

  const clickEdit = async () => {
    if (edit) {
        setEdit(false);
    } else {
        setEdit(true);
        setEditBody(userData.bio)
    }
  }

  const onClick = async () => {
    updateUserBio();
    setEdit(false);
  }
  return(
    <div className="info-div">
    <Card>
      <CardContent>
          <div style={{ justifyContent: "center", display: "flex" }}>
            <Avatar
                alt='green iguana'
                src={profilepic}
                sx={{width: '150px', height: '150px'}}              
              />
            </div>
            <h3>
                <strong>{username}</strong>
            </h3>
            <Typography className="text-muted">U/D Ratio: {userRatio.toFixed(0)}%</Typography>
            <Typography className="text-muted">Avg Rating: <Rating value={Number(userRating)} readOnly size='small' precision={0.05}/></Typography>
            
            { (authData !== undefined && (authData !== null && !(isCurrentUser))) && (<div>
              <ButtonGroup variant="contained">
                  { (authData !== null && !followed) && (
                      <Button onClick={followUser}>Follow User</Button>)}
                  { (authData !== null && followed) && (
                      <Button onClick={unfollowUser}>Unfollow User</Button>)}
                  { (authData !== null && !blocked) && (
                      <Button onClick={blockUser}>Block User</Button>)}
                  { (authData !== null && blocked) && (
                      <Button onClick={unblockUser}>Unblock User</Button>)}
                  { (authData !== null && isMod && banned) && (
                    <Button onClick={unBanUser}>Unban User</Button>)}
                  { (authData !== null && isMod && !banned) && (
                    <Button onClick={banUser}>Ban User</Button>)}
              </ButtonGroup>
              </div>)}

            <CardContent>
              <div>
              { !edit && (
                <div style={{maxWidth: "300px", marginTop: "10px"}}>
                  <p style={{ textAlign: "left", wordWrap: "break-word"}}>
                      {userData.bio}
                  </p>
                </div>
              )
              }

              { edit && (
                <div style={{maxWidth: "300px", marginTop: "10px"}}>
                  <TextField style={{ width: "300px", marginTop: "10px", marginBottom: "15px" }}
                              id="outlined-multiline-static"
                              label="Edit Bio"
                              multiline
                              autoFocus
                              rows={4}
                              value={userData.bio}
                              onChange={onBioChange}
                  />
                  <Button style={{backgroundColor: "lightsteelblue"}}
                                                        variant="contained" onClick={onClick}>Edit</Button>
                  <Button style={{backgroundColor: "lightgray", marginLeft: "15px"}}
                                      variant="contained" onClick={()=>setEdit(false)}>Cancel</Button>
                </div>
              )}
              { (authData !== null && isCurrentUser) &&
                (<EditIcon onClick={clickEdit}>edit post</EditIcon>)}
              </div>
            </CardContent>
            <Button size="small" onClick={()=>{navigate(`/followedUsers/${username}`)}}>
                  Followed Users
                </Button>
          </CardContent>
        </Card>
    </div>
  )
}
export default ProfileView;