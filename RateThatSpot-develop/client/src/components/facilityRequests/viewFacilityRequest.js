import { Box, Card, CardActions, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import { Button, ButtonGroup } from "@mui/material";
import { useEffect, useState } from "react";
import {useParams, useNavigate} from "react-router";
import { Close } from '@material-ui/icons'
import ModeratorService from "../../services/moderator.service";
import PropTypes from 'prop-types';

export default function ViewFacilityRequest() {
  const {id} = useParams();
  const [facilityRequest, setFacilityRequest] = useState({})
  const [openApprove, setOpenApprove] = useState(false);
  const [openDeny, setOpenDeny] = useState(false);
  const navigate = useNavigate();
  
  useEffect(async () => {
    await ModeratorService.verifyModerator().then((response) => {
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
    const facilityData = await ModeratorService.getSpecificFacilityRequest(id)
    setFacilityRequest(facilityData.data);
    console.log(facilityData.data)
  }, [id])

  const onClose = () => {
    setOpenApprove(false);
    setOpenDeny(false);
  };

  const onApprove = () => {
    ModeratorService.approveFacilityRequest(id)
    .then((res) => {
      ModeratorService.deleteFacilityRequest(id)
      navigate(`/facilities/bldgabbr/${facilityRequest.building}`)
    })
    .catch((error) => {
      console.log(error)
    })
  }

  const onDeny = () => {
    ModeratorService.deleteFacilityRequest(id)
    .then((res) => {
      navigate('/viewAllFacilityRequests')
    })
    .catch((error) => {
      console.log(error)
    })
  }

  return (
    <div>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {facilityRequest.type}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {facilityRequest.description}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {facilityRequest.building}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Floor {facilityRequest.floor}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {facilityRequest.username}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {facilityRequest.requestDate}
          </Typography>
          <CardMedia 
            component="img"
            alt={require(`../../images/default_profile.png`)}
            style={{ 
              maxHeight: "200px",
              width: "auto"}
            }
            src={facilityRequest.picture}
          />
        </CardContent>
        <CardActions>
          <ButtonGroup>
            <Button onClick={() => setOpenApprove(true)}>Approve</Button>
            <Button onClick={() => setOpenDeny(true)}>Deny</Button>
          </ButtonGroup>
        </CardActions>
      </Card>
      <ConfirmApprove open={openApprove} onClose={onClose} onApprove={onApprove} />
      <ConfirmDeny open={openDeny} onClose={onClose} onDeny={onDeny} />
    </div>
  )
}

const ConfirmApprove = (props) => {
  const { onClose, open, onApprove } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Approve Request?</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>Are you sure you want to approve the request?</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button color="secondary" variant="contained" onClick={onApprove}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmApprove.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};

const ConfirmDeny = (props) => {
  const { onClose, open, onDeny } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Deny Request?</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>Are you sure you want to deny the request?</Typography>
      </DialogContent>
      <DialogActions>
        <Button color="primary" variant="contained" onClick={onClose}>
          Cancel
        </Button>
        <Button color="secondary" variant="contained" onClick={onDeny}>
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmDeny.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
};