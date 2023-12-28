import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import React, {useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import FacilitiesService from "../../services/facilities.service";
import { CardMedia, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Rating } from "@mui/material";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  gridContainer: {
    paddingRight: "100px",
    //paddingLeft: "40px"
  }
})

const img = require(`../../images/default_profile.png`);

// sets up the grid for all 6 of the top amenities 
const TopAmenities = () => {
  const [facilities, setFacilitiesData] = useState([]);

  useEffect(async () => {
    await FacilitiesService.getTopFacilities().then((facilitiesData => {
      setFacilitiesData(facilitiesData.data);
    }));
  }, []);

  const classes = useStyles();


  return (
    <Grid container spacing={2} className={classes.gridContainer}>
    {facilities.map(facility => (
      <Grid item key={facility._id} xs={12} sm={6} md={4}>
        <Card sx={{ maxWidth: 400, minWidth: 200}}>
        <CardActionArea component={Link} to={`/facility/${facility._id}`}>
        <CardContent >
          <Typography sx={{ fontSize: 20 }} color="text.secondary" gutterBottom>
            {facility.description} 
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {facility.type}
          </Typography>
          <Typography variant="h5" component="div">
          <Rating value={Number(facility.aggregateRating)} readOnly size='small' precision={0.05}/>
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            Located in {facility.building} on floor: {facility.floor}
          </Typography>
          <CardMedia
            component="img"
            style={{ 
              maxHeight: "200px",
              width: "auto"}
            }
            src={facility.picture}
          />
        </CardContent>
        </CardActionArea>
        </Card>
      </Grid>
    ))}
    </Grid>
  );
}

export default TopAmenities;