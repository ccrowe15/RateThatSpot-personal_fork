import React from "react";
import { Link } from "react-router-dom";
import { CardContent, Rating, Card, Typography, Box, Grid, ListItem, Paper} from "@mui/material";


export function PostPreviewCard(props) {
  return (
    <ListItem style={{"justifyContent": "center"}}>
      <Paper style={{width: "70%"}}>
        <CardContent className="card-body" style={{textAlign: "left"}}>
          <Typography variant="h5" className="card-link">
            <Link to={"/viewPost/" + props.post._id} className="nav-link">{props.post.title}</Link>
          </Typography>
          <Typography variant="h6" className="card-subtitle text-muted">
            Rating: <Rating value={Number(props.post.rating)} readOnly size='small' precision={0.05}/>
          </Typography>
          <Typography className="card-text">
            {props.post.body}
          </Typography>
          <Typography className="card-text text-muted">
            Posted: {props.post.postDate.substring(0, 10)}
          </Typography>
        </CardContent>
      </Paper>
    </ListItem>
  )
}