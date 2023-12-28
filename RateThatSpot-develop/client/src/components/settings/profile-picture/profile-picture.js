import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../../services/auth.service";
import UserService from "../../../services/user.service";
import {useParams} from "react-router";
import { Button, CardMedia } from "@mui/material";

const ProfilePicture = () => {

  const [file, setFile] = useState(null);
  const [profilepic, setProfilePic] = useState(null);
  const [inputContainsFile, setInputContainsFile] = useState(false);
  const [authData, setAuthData] = useState({})
  const { username } = useParams()
  const navigate = useNavigate();

  useEffect(async () => {
    const auth = await AuthService.getCurrentUser()
    if (auth === undefined) {
        navigate('/')
    } else {
        setAuthData(auth)
    }

    try {
      const userInfo = await UserService.getUserData(username);
      setProfilePic(userInfo.data[0].ProfilePicture);
    } catch (error) {
      console.log(error);
    }



  }, [username])


  const handlePhoto = async(e) => {
    console.log("added file");
    setFile(e.target.files[0]);
    setInputContainsFile(true);
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("do i even get here?");
    if (inputContainsFile) {
        console.log("sent file to back end");
        await UserService.updateProfilePicture({
            username: username,
            file: file
        }).then(response => {
            console.log(response);
            const fileReader = new FileReader();
            fileReader.onload = () => {
                setProfilePic(fileReader.result);
            }
            fileReader.readAsDataURL(file);
        });
    }
  }


  return (
    <div style={{marginLeft: "30px", marginTop: "30px"}}>

      <h4> Update your profile picture:</h4>

      {(profilepic === null) && (
        <CardMedia
          component='img'
          alt='green iguana'
          src={require('../../../images/default_profile.png')}
          sx={{width: '150px'}}
                              
        />
      )}
      { profilepic && (
        <CardMedia
          component='img'
          alt='green iguana'
          src={profilepic}
          style={{width: 150, marginTop: "30px"}}
        />
      )}

      <form onSubmit={handleSubmit} encType='multipart/form-data'>
          <div>
            <input
                type="file"
                accept="image/*"
                onChange={handlePhoto}
                style={{ display: 'none' }}
                id="contained-button-file"
            />
            <label htmlFor="contained-button-file">
                <Button style={{ marginTop: '2rem', backgroundColor: "black" }} variant="contained" component="span">
                    Upload Profile Pic
                </Button>
            </label>
          </div>
          <div className="col s12">
              <Button
              style={{
                  marginTop: "15px",
                  backgroundColor: "black"
              }}
              type="submit"
              variant="contained"
              component="span"
              onClick={handleSubmit} 
              encType='multipart/form-data'
              >
              Submit Profile Pic
              </Button>
          </div>
      </form>
    </div>
  )
}

export default ProfilePicture;