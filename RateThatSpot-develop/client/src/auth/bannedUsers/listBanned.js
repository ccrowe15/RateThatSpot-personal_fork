import React, {Component, useEffect, useState} from "react";
import ModeratorService from "../../services/moderator.service";
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Grid } from "@material-ui/core";
import { Link } from "react-router-dom";


// list of all banned users
function ListBanned() {
    // analagous to constructor for older react versions
    const [bannedUsers, setBannedUsers] = useState([]);
    const [isModerator, setIsModerator] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    // on page load, get route to see if token is valid
    // analagous to componentDidMount() 
    useEffect(async() => {  
        // verify mod status
        await ModeratorService.verifyModerator()
        .then((response) => {
            console.log(response);
            if (response.data.message === 'is a moderator') {
                // given user is a moderator
                setIsLoading(false);
                setIsModerator(true);
                setError(false);
            }
            else {
                // given user is not a moderator
                setIsLoading(false);
                setIsModerator(false);
                setError(true);
            }
        }).catch((error) => {
            // given user is not a moderator
            console.log(error);
        });

        await ModeratorService.listBannedUsers().then((bannedusers => {
            setBannedUsers(bannedusers.data);
        })).catch((error) => {
            // given user is not a moderator
            console.log(error);
        });
    }, []); // this empty array[] makes useEffect run only once on pageload

        
    if (error) {
        return (
        <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
        <div className="col s8 offset-s2">
            <h4>You are not a moderator, you may not access this page</h4>
            <h4>If this is not the intended behavior, email an admin.</h4>
        </div>
        </div>
        </div>
        );
    } else if (isLoading) {
        return (
            <div className="container">
            <div style={{ marginTop: "4rem" }} className="row">
            <div className="col s8 offset-s2">
                <h4>Checking Moderator Status.</h4>
            </div>
            </div>
            </div>
        )
    }
    else  {
        return (
            <div className="container">
            <div style={{ marginTop: "4rem" }} className="row">

            <h1>Below is the list of Banned Users</h1>
            <br />
            <br />
            <br />
            <Grid container spacing={2}>
            {bannedUsers.map(user => (
            <Grid item key={user._id} xs={12} sm={6} md={4}>
                <Card sx={{ maxWidth: 400, minWidth: 200}}>
                    <CardActionArea component={Link} to={`/profile/${user.name}`}>
                    <CardContent >
                    <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
                        {user.name} 
                    </Typography>
                    </CardContent>
                    </CardActionArea>
                </Card>
                </Grid>
            ))}
            </Grid>
            </div>
            </div>
        );
    }
}

export default ListBanned;