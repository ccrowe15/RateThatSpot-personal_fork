import { Button, Card, CardContent, FormControl, InputLabel, List, ListItem, MenuItem, NativeSelect, Typography } from "@material-ui/core"
import { ButtonGroup, CardActions, Stack } from "@mui/material";
import { useState } from "react";
import { PostPreviewCard } from "../posts/postPreview"



const PostGroups = ({timelinePosts, userPosts, favoritePosts, privateFavorites}) => {
  const [postView, setPostView] = useState("userPosts")
  

  // Timeline posts
  const listTimeLinePosts = () => {
    return timelinePosts.map((post) => {
        return (
                <PostPreviewCard
                    post={post}
                    key={post._id}
                />
        )
    })
  }

  // List all of the users posts
  const listUserPosts = () => {
    return userPosts.map((post) => {
        return (
                <PostPreviewCard
                    post={post}
                    key={post._id}
                />
        )
    })
  }

  // Favorite posts
  const listFavoritePosts = () => {
    return favoritePosts.map((post) => {
        return (
                <PostPreviewCard
                    post={post}
                    key={post._id}
                />
        )
    })
  }


  return (
    <Stack justifyContent="center" alignItems="center">
        <Card style={{width: "100%"}}>
            <CardActions style={{"justifyContent": "center"}}>
                <ButtonGroup variant="outlined" aria-label="text button group" style={{"width":"100%"}}>
                    <Button size="large" style={{"width":"33%", textTransform:"none"}}  onClick={()=>setPostView("userPosts")}>
                    <Typography variant="h6"><strong>User Posts</strong></Typography>
                    </Button>
                    <Button size="large" style={{"width":"33%", textTransform:"none"}} onClick={()=>setPostView("timelinePosts")}>
                        <Typography variant="h6"><strong>Timeline Posts</strong></Typography>
                    </Button>
                    {!privateFavorites ? (
                    <Button size="large" style={{"width":"33%", textTransform:"none"}} onClick={()=>setPostView("favoritePosts")}>
                        <Typography variant="h6"><strong>Favorite Posts</strong></Typography>
                    </Button>
                    ) :
                    (
                    <Button size="large" style={{"width":"33%", textTransform:"none"}}>
                        <Typography variant="h6"><strong>[Private]</strong></Typography>
                    </Button>
                    )
                    }
                </ButtonGroup>
                <Button size="medium" style={{textTransform:"none"}} onClick={()=>setPostView("")}>
                        <Typography><strong>[Hide]</strong></Typography>
                    </Button>
            </CardActions>
        </Card>

      {postView === 'userPosts' && (
          <List style={{width: "100%"}}>
              {listUserPosts()}
          </List>
      )}
      
      {postView === 'favoritePosts' && (
          <List style={{width: "100%"}}>
              {listFavoritePosts()}
          </List>
      )}

      {postView === 'timelinePosts' && (
          <List style={{width: "100%"}}>
              {listTimeLinePosts()}
          </List>
      )}
    </Stack>

  )
}

export default PostGroups;