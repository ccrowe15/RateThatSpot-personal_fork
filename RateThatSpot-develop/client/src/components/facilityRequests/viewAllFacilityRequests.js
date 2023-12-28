import { Button, Card, CardActions, CardContent, CardMedia, List, ListItem, Typography } from "@material-ui/core"
import { useEffect, useState } from "react"
import moderatorService from "../../services/moderator.service"
import { useNavigate } from "react-router-dom";

const ViewAllFacilityRequests = () => {
  const [requests, setRequests] = useState([])
  const navigate = useNavigate();

  useEffect(async () => {
    try {
      await moderatorService.verifyModerator().then((response) => {
        if (response.data.message === 'is a moderator') {
            // given user is a moderator
            console.log("modstatus verified")
        }
        else {
            // given user is not a moderator
            console.log("not a moderator")
            navigate('/404');
        }
        }).catch((error) => {
            // given user is not a moderator
            console.log(error);
            navigate('/404');
      });
      const requestData = await moderatorService.getAllFacilityRequests();
      setRequests(requestData.data);
    }
    catch (err) {
      setRequests([]);
      console.log(err);
    }
  }, [])

  return (
    <div style={{ justifyContent: 'center'}}>
      <List>
        { requests.map((request) => (
          <ListItem key={request._id} xs={12} sm = {6}>
            <Request request={request} />
          </ListItem>
        ))}
      </List>
    </div>
  )
}

const Request = (request) => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" compoent="div">
          {request.request.type}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {request.request.description}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Floor {request.request.floor}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {request.request.username}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {request.request.requestDate}
        </Typography>
      </CardContent>
      <CardMedia 
            component="img"
            alt={require(`../../images/default_profile.png`)}
            style={{ 
              maxHeight: "200px",
              width: "auto"}
            }
            src={request.request.picture}
          />
      <CardActions>
        <Button size="small" onClick={() => {navigate(`/viewFacilityRequest/${request.request._id}`)}}>
            View Request
        </Button>
      </CardActions>
    </Card>
  )
}

export default ViewAllFacilityRequests;