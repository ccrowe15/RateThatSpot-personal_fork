import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import NavStyles from '../styles/navbarStyles';
import HomeIcon from '@mui/icons-material/Home';
import authService from '../services/auth.service';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

export default function PrimarySearchAppBar({navColor, navTextColor}) {
  const classes = NavStyles();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [currentUser, setCurrentUser] = React.useState(null);
  const [term, setTerm] = React.useState({
    text: ""
  });

  const [isModerator, setModStatus] = React.useState(false);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  useEffect(() => {
    async function fetchData() {
      const user = await authService.getCurrentUser();
      if (user) {
        setCurrentUser(user);
        if (user.isModerator !== null && user.isModerator !== undefined) {
          setModStatus(user.isModerator);
        }
      }
    }
    fetchData();
  }, [])


  const logOut = () => {
    authService.logout();
    navigate("/login")
    window.location.reload(true)
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  function updateSearch(value) {
    return setTerm({text: value});
  }

  function submitSearch(e) {
    if (term.text !== "") {
      const target = "/searchUsers";
      navigate(target, {state: {
        term: term.text}});
      window.location.reload(true)
    }
  }

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {currentUser ? (<div>
        <MenuItem onClick={()=>navigate("/profile/" + currentUser.username)}>Profile</MenuItem>
        <MenuItem onClick={()=>navigate("/notifications")}>Notifications</MenuItem>
        <MenuItem onClick={()=>navigate("/settings/" + currentUser.username)}>Settings</MenuItem>
        <MenuItem onClick={logOut}>LogOut</MenuItem>
      </div>)
      :
      (<div>
        <MenuItem onClick={()=>navigate("/login")}>Login</MenuItem>
        <MenuItem onClick={()=>navigate("/register")}>SignUp</MenuItem>
      </div>)
      }
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <div>
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem onClick={()=>navigate("/facilitiesList")}>
        <p>Facilities</p>
      </MenuItem>
      <MenuItem onClick={()=>navigate("/buildings")}>
        <p>Buildings</p>
      </MenuItem>
      {isModerator && (<div>
        <MenuItem onClick={()=>navigate("/moderator")}>Moderator</MenuItem>
      </div>)}
      <MenuItem onClick={()=>navigate("/helpPage")}>
        <p>Help Page</p>
      </MenuItem>
    </Menu>
    </div>
  );

  return (
    <div className={classes.grow}>
      <AppBar position="static" className={classes.abRoot} style={{backgroundColor: navColor, color: navTextColor}}>
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="open drawer"
            onClick={()=>navigate("/")}
          >
            <HomeIcon />
          </IconButton>
          <div className={classes.sectionDesktop}>
            <IconButton color="inherit" onClick={()=>navigate("/facilitiesList")}>
              <h5>Facilities</h5>
            </IconButton>
            <IconButton color="inherit" onClick={()=>navigate("/buildings")}>
              <h5>Buildings</h5>
            </IconButton>
            <IconButton color="inherit" onClick={()=>navigate("/rules")}>
              <h5>Rules</h5>
            </IconButton>
            <IconButton color="inherit" onClick={()=>navigate("/contact")}>
              <h5>Contact</h5>
            </IconButton>
            {isModerator && (<IconButton color="inherit" onClick={()=>navigate("/moderator")}>
              <h5>Moderator</h5>
            </IconButton>)}
            <IconButton color="inherit" onClick={()=>navigate("/helpPage")}>
              <h5>Help</h5>
            </IconButton>
          </div>
          <div className={classes.grow} />
          <Typography className={classes.title} variant="h6" noWrap>
            Rate That Spot
          </Typography>
          <div className={classes.grow} />
          <div className={classes.search}>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open drawer" 
              onClick={(e) => submitSearch()}>
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search users"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
              value={term.text}
              onChange={(e) => updateSearch(e.target.value)}
            />
          </div>
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
          </div>
          <div>
          <IconButton
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle fontSize='large'/>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}