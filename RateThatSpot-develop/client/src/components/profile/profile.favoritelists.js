import { ButtonGroup, CardActions, Rating, Stack } from "@mui/material";
import { Button, Card, CardContent, List, ListItem, Typography} from "@material-ui/core";
import { useState } from "react";
import Building from "../buildings/building/building";
import { useNavigate } from "react-router";

const FavoriteGroups = ({favoriteBuildings, favoriteFacilities, privateFavorites}) => {

  const [favoriteView, setFavoriteView] = useState("")
  const navigate = useNavigate();

  return (
    <Stack justifyContent="center" alignItems="center">
        <Card align="stretch">
            <CardActions style={{"justifyContent": "center"}}>
              {!privateFavorites ? 
              (
              <ButtonGroup variant="outlined" aria-label="text button group" style={{"width":"100%"}}>
                <Button size="large" style={{"width":"50%", textTransform:"none"}}  onClick={()=>setFavoriteView("buildings")}>
                  <Typography variant="h6"><strong>Buildings</strong></Typography>
                </Button>
                <Button size="large" style={{"width":"50%", textTransform:"none"}} onClick={()=>setFavoriteView("facilities")}>
                    <Typography variant="h6"><strong>Facilities</strong></Typography>
                </Button>
              </ButtonGroup>
              )
              :
              (
              <ButtonGroup variant="outlined" aria-label="text button group" style={{"width":"100%"}}>
                <Button size="large" style={{"width":"50%", textTransform:"none"}}>
                  <Typography variant="h6"><strong>[Private]</strong></Typography>
                </Button>
                <Button size="large" style={{"width":"50%", textTransform:"none"}}>
                    <Typography variant="h6"><strong>[Private]</strong></Typography>
                </Button>
              </ButtonGroup>
              )}
            </CardActions>
        </Card>

        {favoriteView === "buildings" && (
        <div style={{ justifyContent:'center'}}>
        <List>
          { favoriteBuildings.map((building) => (
              <ListItem key={building.id} item xs={12} sm={6}>
                  <Building building={building}/>
              </ListItem>
          ))}
        </List>
        </div>)}

        {favoriteView === "facilities" && (
          <div style={{ justifyContent:'center'}}>
          <List>
            { favoriteFacilities.map((facility) => (
                <ListItem key={facility.id} item xs={12} sm={6} style={{"justifyContent": "center"}}>
                    <Facitlity facility={facility}/>
                </ListItem>
            ))}
          </List>
          </div>)}


      </Stack>
  )
}

const Facitlity = ({facility}) => {
  const navigate = useNavigate();
  return (
    <Card style={{width: "70%"}}>
        <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                {facility.description}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {facility.building}, floor {facility.floor}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                Average Rating: 
            </Typography>
            <Rating value={Number(facility.aggregateRating)} readOnly size='small' precision={0.05}/>
        </CardContent>
        <CardActions>
            <Button size="small" onClick={() => {navigate('/facility/' + facility._id)}}>
                View Reviews
            </Button>
        </CardActions>
    </Card>
)
}



export default FavoriteGroups;