import { Button } from "@material-ui/core";
import { Close } from '@material-ui/icons'
import { Box, Card, CardActions, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@material-ui/core";
import { useNavigate, useParams } from "react-router";
import React, { useState } from "react";
import authService from "../../../services/auth.service";
import userService from "../../../services/user.service";
import { ButtonGroup, Container } from "@mui/material";

const DeleteAccount = () => {

  const {username} = useParams();
  const navigate = useNavigate();
  const [openApprove, setOpenApprove] = useState(false);
  const [openDeny, setOpenDeny] = useState(false);

  React.useEffect(async () => {
    const auth = await authService.getCurrentUser()
    if (auth === undefined || auth === null) {
        navigate('/')
    } else if (auth.username !== username) {
      navigate('/')
    } 
  }, [username])

  const onClose = () => {
    setOpenApprove(false);
    setOpenDeny(false);
  };

  const onApprove = () => {
    userService.deleteAccount(username)
    .then((res) => {
      setOpenApprove(false);
      authService.logout();
      navigate("/login")
      window.location.reload(true)
    })
    .catch((error) => {
      console.log(error)
    })
  }



  return(
    <Container style={{padding: "2%"}}>
      <Card>
        <CardContent>
          <h3>Delete account</h3>
          <p>Deleting your account will remove your user information from the Rate that Spot. Post and comments made by you will remain.</p>
        </CardContent>
        <CardActions>
          <ButtonGroup>
            <Button onClick={() => setOpenApprove(true)}>Delete</Button>
            <Button onClick={() => navigate("/")}>Cancel</Button>
          </ButtonGroup>
        </CardActions>
        <ConfirmApprove open={openApprove} onClose={onClose} onApprove={onApprove} />
      </Card>
    </Container>
  )
}

const ConfirmApprove = (props) => {
  const { onClose, open, onApprove } = props;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle><strong>Are you sure you want to delete your account?</strong></DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </Box>
      <DialogContent>
        <Typography>Are you sure you want to delete your account?</Typography>
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

export default DeleteAccount;