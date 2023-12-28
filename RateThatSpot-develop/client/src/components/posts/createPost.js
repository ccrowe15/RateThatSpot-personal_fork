import React, { useState, Component, useEffect } from 'react'
import { renderMatches, useNavigate, useParams } from "react-router";
import AuthService from "../../services/auth.service";
import axios from 'axios';
import UserService from "../../services/user.service";
import PostService from "../../services/post.service";
import { Rating, Alert, Box, TextField, Card, Paper  } from "@mui/material";
import {Button, Typography} from "@material-ui/core";

export default function CreatePost() {
    const [form, setForm] = useState({
      title: "",
      body: "",
      author: "",
      rating: 0,
      amenity: ""
    });

    const [userData, setUserData] = useState({})
    const navigate = useNavigate();
    const [currentDate, setCurrentDate] = useState({});
    const [lastPostTime, setLastPostTime] = useState({});
    var FIVE_MIN = 5*60*1000;
    
    //id here is the id of the amenity
    const { id } = useParams()
    
    // These functions will update the state properties
    function updateForm(value) {
      return setForm((prev) => {
            return {...prev, ...value};
      });
    }

    //if no user is signed in it sends them back to the home page
    useEffect(async () => {
      
      const auth = await AuthService.getCurrentUser()
        if (auth !== undefined) {
            setUserData(auth)
        } else {
            setUserData(null)
            navigate('/')
        }

      const user = await UserService.getUserData(auth.username)
      setLastPostTime(user.data[0].lastPostTime);
      setCurrentDate(new Date());
      
      //console.log(auth.username)
      //console.log(new Date(user.data[0].lastPostTime))
      //console.log(new Date())

    }, [])


  // This function will handle the submission
  async function onSubmit(e) {

    //console.log("submit reached")
    const newPost = {
      title: form.title,
      body: form.body,
      author: userData.id,
      rating: form.rating,
      username: userData.username,
      amenity: id
    }

    await fetch("http://localhost:5000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPost),
    })
    .catch(error => {
      window.alert(error);
      return;
    });

    //update facility and building aggregate scores now that a post has been created
    const updateFacilityAgg = await PostService.updateFacilityAgg(id);
    const updateBuildingAgg = await PostService.updateBuildingAgg(id);

    //set Post Time Limit
    const lastPost = true;
    await UserService.updateLastPostTime(userData.username, lastPost)

    //notify followers
    const f = await fetch("http://localhost:5000/users/getFollowers/" + userData.id);
    const followers = await f.json();
    

    const title = "New post from " + userData.username;
    const body = userData.username + " posted a new review titled \"" + newPost.title;

    console.log("Attempting to notify followers");
    console.log(followers);


    for (var x = 0; x < followers.length; x++) {
      var fid = followers[x]._id;
      console.log("pending message to " + fid);
      var u = await fetch("http://localhost:5000/users/getUsername/" + fid);
      var uname = await u.json();
      console.log(uname);
      var mn = await fetch("http://localhost:5000/users/mayNotify/" + fid);
      var mayNotify = await mn.json();
      console.log(mayNotify);
      if (mayNotify[0].mayNotify != false) {
        var newNotification = {
          title: title,
          body: body,
        }
        console.log("created message, sending...");
        await fetch("http://localhost:5000/notifications/" + uname[0].name, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newNotification)
        })
        .catch(error => {
          window.alert(error);
          return;
        });
      }
    }


    setForm({title: "", body:""});
    navigate("/profile/" + userData.username);
  }

  return (
    <Box 
    alignItems="center" 
    justify="center"
    justifyContent="center"
    sx={{ display: 'flex', flexWrap: 'wrap', width: 'auto'}}
    >
      <div>
        <Paper  
          style={{ padding: "20px 30px", marginTop: 10, marginBottom: 10, width:'auto' }}
        >
          
          <Typography variant="h3" gutterBottom component="div" style={{textAlign: "center"}}>
            Create a New Review
          </Typography>
          
          <div>
          <TextField
            id="title"
            label="Title"
            sx={{m: 1}}
            value={form.title}
            multiline
            fullWidth
            onChange={(e) => updateForm({title: e.target.value})}
            inputProps={{ maxLength: 51}}
            error={form.title.length < 1 || form.title.length > 50}
            helperText={(form.title.length < 1 || form.title.length > 50) ? 'Improper Title Length' : ' '}
          />

          <TextField
            id="body"
            label="Body"
            sx={{ m:1}}
            value={form.body}
            multiline
            fullWidth
            onChange={(e) => updateForm({body: e.target.value})}
            inputProps={{ maxLength: 1001}}
            error={form.body.length < 1 || form.body.length > 1000}
            helperText={(form.body.length < 1 || form.body.length > 1000) ? 'Improper Body Length' : ' '}
          />

          <Typography 
          component="legend"
          style={{paddingBottom: "0px", paddingTop: "10px", paddingLeft: "9px"}}
          >
            Choose a Rating for the Amenity
          </Typography>
          <Rating
          sx={{ m:1}} 
          value={Number(form.rating)}
          size='large'
          precision={1} 
          onChange={(e) => updateForm({rating: e.target.value})}
          />
          </div>

          <div>
          <Button
            variant='contained'
            fullWidth
            color="primary"
            sx={{m: 1}}
            onClick={() => {onSubmit()}}
            disabled={form.rating === 0 || form.title.length<1 || form.title.length>100 || form.body.length<1 || form.body.length>1000 || ((currentDate - new Date(lastPostTime)) < FIVE_MIN)}
            className="btn btn-primary"
          >
            Submit
          </Button>
          </div>

        <div style={{paddingBottom: "30px", paddingTop: "30px"}}>
          {((currentDate - new Date(lastPostTime)) < FIVE_MIN) &&
            <Alert variant="filled" severity="warning">
              Must wait 5 minutes after creating a review to create another 
            </Alert>
          }
        </div>
        </Paper >
        
      </div>
    </Box>
  );
}