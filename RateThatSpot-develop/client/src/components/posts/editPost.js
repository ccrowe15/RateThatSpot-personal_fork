import React, {Component, useEffect, useState} from "react";
import { useNavigate } from "react-router";
import PostService from "../../services/post.service";
import AuthService from "../../services/auth.service";
import {useParams} from "react-router";
import { Link } from "react-router-dom";
import { Rating, Alert, Box, TextField, Card, Paper  } from "@mui/material";
import {Button, Typography} from "@material-ui/core";

export default function EditPost() {
    const { id } = useParams()

    const [form, setForm] = useState({
        title: "",
        body: "",
        rating: ""
    })
    const [userData, setUserData] = useState({})

    const [post, setPostData] = useState({})
    const [author, setAuthor] = useState({})

    //const [postAuth, setPostAuth] = useState([])

    const navigate = useNavigate();

    useEffect(async () => {

        const postData = await PostService.getSinglePost(id);
        setPostData(postData.data);

        //console.log(postData.data.title)
        //console.log(postData.data.body)
        //console.log(postData.data.rating)

        setForm((form) => ({
            title: postData.data.title,
            body: postData.data.body,
            rating: postData.data.rating
        }));
        
        const auth = await AuthService.getCurrentUser();
        console.log(auth);
        if (auth && auth !== undefined) {
            setUserData(auth)
        } else {
            //user not logged in, route to 404 page
            setUserData(null)
            navigate('/404')
        }
      
        /*const auth = await AuthService.getCurrentUser()
        setAuthor(auth.username)
        //console.log(auth.username)
        //console.log(postData.data.username)  
        if (auth === undefined || auth.username != postData.data.username) {
          navigate('/')
        }*/

    },[id])

    function updateForm(value) {
        return setForm((prev) => {
              return {...prev, ...value};
        });
      }

    async function deletePost(e) {
        const deletedPost = await PostService.deleteSinglePost(id);
        console.log(deletedPost)
        setForm({title: "", body:""});
        navigate("/profile/" + author);

    }

    async function onSubmit(e) {
        
        const newPost = {
            title: form.title,
            body: form.body,
            rating: form.rating, 
          }

        await fetch("http://localhost:5000/posts/" + id, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPost),
        })
        .catch(error => {
          window.alert(error);
          return;
        });
    
        setForm({title: "", body:""});
        navigate("/viewPost/" + id);
        
      }    
  
      return (
        
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
               
               <Typography variant="h3" gutterBottom component="div" style={{textAlign: "center"}}>
                 Edit a Review
               </Typography>
               
               <div>
               <TextField
                 id="title"
                 label="Title"
                 sx={{m: 1}}
                 value={form.title}
                 multiline
                 fullWidth
                 onChange={(e) => updateForm({title: e.target.value})}
                 inputProps={{ maxLength: 51}}
                 error={form.title.length < 1 || form.title.length > 50}
                 helperText={(form.title.length < 1 || form.title.length > 50) ? 'Improper Title Length' : ' '}
               />
     
               <TextField
                 id="body"
                 label="Body"
                 sx={{ m:1}}
                 value={form.body}
                 multiline
                 fullWidth
                 onChange={(e) => updateForm({body: e.target.value})}
                 inputProps={{ maxLength: 1001}}
                 error={form.body.length < 1 || form.body.length > 1000}
                 helperText={(form.body.length < 1 || form.body.length > 1000) ? 'Improper Body Length' : ' '}
               />
     
               <Typography 
               component="legend"
               style={{paddingBottom: "0px", paddingTop: "10px", paddingLeft: "9px"}}
               >
                 Choose a Rating for the Amenity
               </Typography>
               <Rating
               sx={{ m:1}} 
               value={Number(form.rating)}
               size='large'
               precision={1} 
               onChange={(e) => updateForm({rating: e.target.value})}
               />
               </div>
     
               <div>
               <Button
                 variant='contained'
                 fullWidth
                 color="primary"
                 sx={{m: 1}}
                 onClick={() => {onSubmit()}}
                 disabled={form.rating === 0 || form.title.length<1 || form.title.length>100 || form.body.length<1 || form.body.length>1000 }
                 className="btn btn-primary"
               >
                 Edit Review
               </Button>
               </div>
               
               <div>
                 <p></p>
               <Button
                 variant='contained'
                 fullWidth
                 color="secondary"
                 sx={{m: 1, marginTop: "10px"}}
                 onClick={() => {deletePost()}}
                 className="btn btn-primary"
               >
                 Delete This Review
               </Button>
               </div>

             </Paper >
             
           </div>
         </Box>
      );
    

}