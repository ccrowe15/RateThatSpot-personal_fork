import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import UserService from "../../services/user.service";
import { useNavigate, useParams } from "react-router";
import postService from "../../services/post.service";
import userService from "../../services/user.service";
import ModeratorService from "../../services/moderator.service";
import buildingService from "../../services/building.service"; //
import facilitiesService from "../../services/facilities.service"; //
import { Container, Grid } from "@mui/material";
import UserDisplay from "./profile.userdisplay";
import PostGroups from "./profile.postlists";
import '../../styles/profile.css'
import FavoriteGroups from "./profile.favoritelists";
import {CircularProgress} from "@mui/material";

const Profile = () => {

    const [authData, setAuthData] = useState({})
    const [userPosts, setUserPosts] = useState([])
    const [favoritePosts, setFavoritePosts] = useState([])
    const [favoriteBuildings, setFavoriteBuildings] = useState([]) 
    const [favoriteFacilities, setFavoriteFacilities] = useState([]) 
    const [timelinePosts, setTimelinePosts] = useState([])
    const [followedUsers, setFollowedUsers] = useState([])
    const [followed, setFollowed] = useState(false)
    const [blockedUsers, setBlockedUsers] = useState([]) 
    const [blocked, setBlocked] = useState(false) 
    const [isBlocked, setIsBlocked] = useState(false) 
    const [banned, setBanStatus] = useState(false) 
    const [isMod, setModStatus] = useState(false)
    const [blockedBy, setBlockedBy] = useState([])
    const [userData, setUserData] = useState({})
    const [bioUpdate, setBioUpdate] = useState(false)
    const { username } = useParams()
    const [profilepic, setProfilePic] = useState(null);
    const [userRatio, setUserRatio] = useState(0); 
    const [userRating, setUserRating] = useState(0); 
    const [isLoading, setIsLoading] = useState(true);
    const [privateFavorites, setPrivateFavorites] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);
    const navigate = useNavigate();


    useEffect(() => {
        async function fetchData () {
        const userInfo = await UserService.getUserData(username)
        .catch((error) => {
            navigate("/404page")
        })
        if (userInfo !== null && userInfo !== undefined) {
            const posts = await UserService.getUserPosts(username);
            setUserPosts(posts.data);
            setProfilePic(userInfo.data[0].ProfilePicture);
            setUserData(userInfo.data[0]);
            setFollowedUsers(userInfo.data[0].followedUsers);
            setBlockedUsers(userInfo.data[0].followedUsers);
            setBlockedBy(userInfo.data[0].blockedBy)
            setPrivateFavorites(userInfo.data[0].privateFavorites);
            if (userInfo.data[0].isBanned !== null && userInfo.data[0].isBanned !== undefined) {
                setBanStatus(userInfo.data[0].isBanned)
            }
            let total = 0;
            let upVotes = 0;
            let downVotes = 0;
            for (let i = 0; i < posts.data.length; i++) {
                total += posts.data[i].rating;
                upVotes += posts.data[i].upVotes;
                downVotes += posts.data[i].downVotes;
            }
            if (posts.data.length == 0) {
                setUserRating(0);
            }
            else {
                setUserRating(total / posts.data.length);
            }
            if (upVotes === 0 && downVotes == 0) {
                setUserRatio(0)
            }
            else if (downVotes === 0) {
                setUserRatio(1)
            }
            else {
                setUserRatio(upVotes / (upVotes + downVotes) * 100);
            }

            // Get favorite posts
            await postService.getFavoritePosts(username)
            .then((posts) => {
                if (posts.data == null) {
                    setFavoritePosts([]);
                }
                else {
                    setFavoritePosts(posts.data);
                }
            })
            .catch((error) => {
                console.log(error)
                setFavoritePosts([])
            })

            //Get favorite buildings
            await buildingService.getFavoriteBuildings(username)
            .then((buildings) =>{
                if (buildings.data == null) {
                    setFavoriteBuildings([]);
                } 
                else {
                    setFavoriteBuildings(buildings.data);
                }
            })

            
            await facilitiesService.getFavoritedFacilities(username)
            .then((facilities) => {
                if (facilities.data === null) {
                    setFavoriteFacilities([])
                }
                else {
                    setFavoriteFacilities(facilities.data)
                }
            })

            // Get timeline posts
            await postService.getTimelinePosts(username)
            .then((posts) => {
                if(posts.data == null) {
                    setTimelinePosts([])
                }
                else {
                    setTimelinePosts(posts.data)
                }
            })
            .catch((error) => {
                console.log(error)
                setTimelinePosts([])
            })

            const auth = await AuthService.getCurrentUser();
            if (auth !== null && auth !== undefined) {
                if (auth.username === username) {
                    setIsCurrentUser(true);
                }
                setAuthData(auth)
                const user = await userService.getUserData(auth.username)
                if (!user) {
                    setFollowed(false);
                    setBlocked(false);
                    setIsBlocked(false)
                }
                else {
                    setIsBlocked(user.data[0].blockedBy.includes(userInfo.data[0]._id))
                    setFollowed(user.data[0].followedUsers.includes(userInfo.data[0]._id))
                    setBlocked(user.data[0].blockedUsers.includes(userInfo.data[0]._id))
                    if (user.data[0].isModerator !== null && user.data[0].isModerator !== undefined) {
                        setModStatus(user.data[0].isModerator)
                    }
                }
            } else {
                setAuthData(null)
            }
        }
        else {
            navigate("/404page")
        }

        setIsLoading(false);

    }
    fetchData();

    }, [username])

    const onBioChange = (event) => {
        setUserData({bio: event.target.value});
    }

    const updateUserBio = async(event) => {
        console.log(userData.bio)
        try {
            const updateBio = await UserService.updateUserBio({
                username: username,
                bio: userData.bio
            });
            setBioUpdate(true)
        } catch (error) {
            console.log(error)
            setBioUpdate(false)
        }
    }

    // Follow the user whose profile you're on
    const followUser = async() => {
        try {
            await UserService.updateFollowedUsers({
                username: authData.username,
                followedUsers: userData._id,
                follow: true
            });
            setFollowed(true)
        } catch (error) {
            console.log(error)
        }
    }

    const unfollowUser = async() => {
        try {
            await UserService.updateFollowedUsers({
                username: authData.username,
                followedUsers: userData._id,
                follow: false
            });
            setFollowed(false)
        } catch (error) {
            console.log(error)
        }
    }

    // Block the user whose profile you're on
    const blockUser = async() => {
        try {
            await UserService.updateBlockedUsers({
                username: authData.username,
                blockedUsers: userData._id,
                block: true
            });
            setBlocked(true)
        } catch (error) {
            console.log(error)
        }
    }

    const unblockUser = async() => {
        try {
            await UserService.updateBlockedUsers({
                username: authData.username,
                blockedUsers: userData._id,
                block: false
            });
            setBlocked(false)
        } catch (error) {
            console.log(error)
        }
    }

    const banUser = async() => {
        await ModeratorService.banUser(username)
            .then(response => {
                window.alert(response.data.message);
                setBanStatus(true)
            }).catch(error => {
                window.alert(error);
                return;
            });
    }

    const unBanUser = async() => {
        await ModeratorService.unBanUser(username)
            .then(response => {
                window.alert(response.data.message);
                setBanStatus(false)
            }).catch(error => {
                window.alert(error);
                return;
            });
    }

    return (
        <div style={{height: "100vh", padding:"3%"}} className="root-div">
       { isLoading !== true && (isCurrentUser || (userData.privateProfile !== true  && isBlocked !== true)) && (<Container maxWidth="xl">
            <Grid container spacing={4}>
                <Grid item md={3} xs={12}>
                    <UserDisplay
                        username={username}
                        userData={userData}
                        authData={authData}
                        bioUpdate={bioUpdate}
                        onBioChange={onBioChange}
                        updateUserBio={updateUserBio}
                        userRatio={userRatio}
                        userRating={userRating}
                        followed={followed}
                        followUser={followUser}
                        unfollowUser={unfollowUser}
                        blocked={blocked}
                        blockUser={blockUser}
                        unblockUser={unblockUser}
                        isCurrentUser={isCurrentUser}
                        profilepic={profilepic}
                        banned={banned}
                        isMod={isMod}
                        banUser={banUser}
                        unBanUser={unBanUser}
                        />
                </Grid>

                <Grid item md={6} xs={12}>
                    <PostGroups 
                        userPosts={userPosts}
                        timelinePosts={timelinePosts}
                        favoritePosts={favoritePosts}
                        privateFavorites={(!(isCurrentUser) && privateFavorites)}
                    />
                </Grid>

                <Grid item md={3} xs={12}>
                    <FavoriteGroups 
                        favoriteBuildings={favoriteBuildings}
                        favoriteFacilities={favoriteFacilities}
                        privateFavorites={(!(isCurrentUser) && privateFavorites)}
                    />
                </Grid> 

            </Grid>

            
        </Container>)}
        { (!(isCurrentUser) && userData.privateProfile === true) &&

                (<div>
                    <h4 style={{marginTop: "30px", marginLeft: "30px"}}>this profile is private.</h4>
                </div>)

            }

            {   (!(isCurrentUser) && isBlocked == true) && (
                <div>
                    <h4 style={{marginTop: "30px", marginLeft: "30px"}}> this user has blocked you. </h4>
                </div>
            )}
        { isLoading === true && (
            <div style={{marginTop: "30px", marginLeft: "30px"}}>
                <CircularProgress/>
                <h4 style={{marginTop: "20px"}}>loading...</h4>
            </div>)}
        </div>
    );

}

export default Profile;