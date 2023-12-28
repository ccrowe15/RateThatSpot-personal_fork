import { Card, CardActionArea, CardContent, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@material-ui/core';
import { Button } from '@mui/material';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router';
import authService from '../../../services/auth.service';
import userService from '../../../services/user.service';




const UserTheme = ({uiSetting, changeUISetting}) => {
  const {username} = useParams();
  const [authData, setAuthData] = React.useState({})
  const [currSetting, setCurrSetting] = React.useState(uiSetting)
  const navigate = useNavigate();

  React.useEffect(async () => {
    const auth = await authService.getCurrentUser()
    if (auth === undefined) {
        navigate('/')
    } else {
        setAuthData(auth)
    }

  }, [username])


  const onSubmit = (e) => {
    e.preventDefault();
    userService.updateUIPreferenceLocal(username, uiSetting)
  }
  

  return (
    <Container style={{"padding": "2%"}}>
      <Card>
        <CardContent>
          <form onSubmit={onSubmit}>
            <h5>Change UI themes</h5>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={currSetting}
              name="radio-buttons-group"
              onChange={changeUISetting}
            >
              <FormControlLabel value="0" control={<Radio />} label="Rate That Spot Classic" />
              <FormControlLabel value="1" control={<Radio />} label="Boilermaker Special" />
              <FormControlLabel value="2" control={<Radio />} label="Chill Mountain" />
            </RadioGroup>
            <div style={{"paddingTop": "1%"}}>
              <button type="submit" className="btn btn-medium waves-effect waves-light hoverable blue accent-3">Submit Changes</button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Container>
  )
}

export default UserTheme;