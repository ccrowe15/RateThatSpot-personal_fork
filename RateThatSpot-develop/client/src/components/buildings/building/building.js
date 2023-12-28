import React, { useEffect, useState } from 'react';
import { useSelector } from  'react-redux';
import {Card, CardActions, CardContent, CardMedia, Button, Typography} from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { Rating } from "@mui/material";


const Building = ( { building } ) => {
    const navigate = useNavigate();

    return (
        <Card sx={{ Width: 345 }}>
            <CardMedia
                style={{width: "400px"}}
                component="img"
                alt="green iguana"
                height="140"
                src={require(`../../../images/${building.buildingCode}.png`)}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {building.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {building.address}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Average Rating: 
                </Typography>
                <Rating value={Number(building.aggregateRating)} readOnly size='small' precision={0.05}/>
                <Typography variant="body2" color="text.secondary">
                    {building.numFloors} floors
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => {navigate('/facilities/bldgabbr/' + building.buildingCode)}}>
                    View facilities
                </Button>
            </CardActions>
        </Card>
    )
}

/*
const Building = ( { building } ) => {
    return (
        <Card variant ="outlined">
            <Typography variant="h5"> {building.name} - {building.buildingCode}</Typography>
            <Typography> {building.address} </Typography>
            <Typography> Average Rating: {building.aggregateRating} </Typography>
            <Typography> {building.numFloors} floors </Typography>
            <Paper variant="outlined">
                <img height={200} src={require(`../../../images/${building.buildingCode}.png`)}/>
            </Paper>
        </Card>
    )
}

 */

export default Building;