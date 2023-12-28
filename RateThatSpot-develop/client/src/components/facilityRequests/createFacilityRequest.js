import React, { useState, Component, useEffect } from 'react'
import { renderMatches, useNavigate, useParams } from "react-router";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import authToken from '../../services/auth-token';
import axios from 'axios';
import { Rating, Alert, Box, TextField, Card, Paper  } from "@mui/material";
import {Button, Typography} from "@material-ui/core";
const API_URL = 'http://localhost:5000/'

export default function CreateFacilityRequest() {
    const [form, setForm] = useState({
        type: "Bathroom",
        description: "",
        floor: "",
        building: "",
        author: "",
        username: ""
      });
    const [inputContainsFile, setInputContainsFile] = useState(false);
    const [file, setFile] = useState(null);
    const {abbr} = useParams();
    const [userData, setUserData] = useState({})
    const navigate = useNavigate();
    const [err, setErr] = useState(false)
    const [err2, setErr2] = useState(false)
    const [nextDate, setNextDate] = useState()
    const [submitted, setSubmitted] = useState(false);
    const [requests, setRequests] = useState();

    // These functions will update the state properties
    function updateForm(value) {
        return setForm((prev) => {
              return {...prev, ...value};
        });
      }
    
    // update file state to given image
    const handlePhoto = async(e) => {
        setFile(e.target.files[0]);
        setInputContainsFile(true);
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

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate()+1)
        tomorrow = tomorrow.toString().substring(0, 15)
        console.log('tomorrow: ' + tomorrow)
        setNextDate(tomorrow)
        setRequests(requests + 1)
  
      }, [])

    async function onSubmit(e) {
        e.preventDefault();

        console.log(requests)
        if (requests >= 3) {
            setErr(true)
            setErr2(false)
            setSubmitted(false)
            return;
            window.alert("Users cannot submit more than 3 request per day");
            return;
        }

        if (!inputContainsFile || form.type === "" || form.floor === "") {
          //empty values, do not submit request
          setErr2(true)
          console.log("some inputs are empty, submit failed")
          return;
        }
        const newRequest = {
            type: form.type,
            description: form.description,
            floor: form.floor,
            building: abbr,
            author: userData.id,
            username: userData.username
        }
        // get access token
        const token = authToken();
        // formdata includes our new image file and the completed request
        var formData = new FormData();
        formData.append("file", file);
        formData.append("document", JSON.stringify(newRequest))
        // post formdata to back-end to create facility request
        await axios.post(`${API_URL}facilityRequests`, formData, {
          headers: {
            'x-access-token': token,
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
          },
        }).then((response) => {
          window.alert(response.data.message);
        })
        .catch(error => {
          window.alert(error);
          return;
        });

        const attempt = await UserService.submitAmenityRequest(userData.username)
        if (attempt.data.message === 'error') {
            setErr(true)
            setErr2(false)
            setSubmitted(false)
            return;
        }

        setForm({title: "", body:""});
        setSubmitted(true)
        setErr2(false)

        await new Promise(r => setTimeout(r, 1000));
        const users = await UserService.getUserData(userData.username)
        setRequests(users.data[0].dailyRequests)


        //navigate("/facilities/bldgabbr/" + abbr);
      }

    return(
      <div className="container">

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
      <h3>Request a New Facility for {abbr}</h3>

      <form onSubmit={onSubmit}>

        { err && (
            <div>
                <p style={{color: "red"}}>Users can only submit 3 request per day</p>
                <p style={{color: "red"}}>Please wait until {nextDate} to submit another request</p>
            </div>
        )}

          { err2 && (
              <div>
                  <p style={{color: "red"}}>Error: You have left fields unfilled</p>
              </div>
          )}

        { submitted && (
            <div>
              <p style={{color: "green"}}>Request has been submitted! ({requests}/3)</p>
            </div>
        )}
        
        <div className="form-group"> 
            <label htmlFor="type"> Type of Facility</label>
            
            <select id="type" name="type" className="form-control" value={form.type} onChange={(e) => updateForm({type: e.target.value})}>
                <option value="Bathroom">Bathroom</option>
                <option value="Drinking Fountain">Drinking Fountain</option>
                <option value="Study Space">Study Space</option>
            </select>
           
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description of Facility</label>
          <input
            type="text"
            className="form-control"
            id="description"
            maxLength={100}
            value={form.description}
            onChange={(e) => updateForm({description: e.target.value})}
          />
        </div>

        <div className="form-group">
        <label htmlFor="floor">Floor Facility is Located on:</label>
          <input
            type="number"
            className="form-control"
            id="floor"
            min="0"
            max="10"
            value={form.floor}
            onChange={(e) => updateForm({floor: e.target.value})}
          />
        </div>
        {
        <div className="form-group">
        <label htmlFor="file">Image of Facility:</label>
          <input 
            type="file"
            accept="image/*"
            id="file"
            onChange={handlePhoto}
            style={{marginLeft: "5px"}}
          ></input>
        </div>
        }
        <div className="form-group" style={{paddingBottom: "30px", paddingTop: "30px"}}>
          <input
            type="submit"
            value="Submit Facility Request"
            disabled={ form.floor<-1 || form.floor>10}
            className="btn btn-primary"
          />
        </div>
      </form>
      </Paper>
      </div>
      </Box>
    </div>
    );
}