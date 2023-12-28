import React, {Component, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./styles.css"



const HelpPage = () => {

    const navigate = useNavigate();

    return (
        <div style={{marginTop: "30px", marginLeft: "30px", marginRight: "30px", height: "1750px"}}>
            <h3>
                <strong>RateThatSpot Help Page</strong>
            </h3>
            <div style={{marginTop: "30px"}}>
                <h4>About our application:</h4>
                <p>RateThatSpot is a community-based social media platform that allows users to
                    rate different amenities on Purdue campus such as bathrooms, water fountains, and
                    study spaces.</p>
                <p>Share thoughts about your favorite spots on campus!</p>
            </div>
            <div style={{marginTop: "30px"}}>
                <h4>Sign-up for an account:</h4>
                <p>If you have not created an account, click the link below to register:</p>
                <p className="register" onClick={() => navigate("/register")}>Register for an account</p>
                <p>Accounts are limited to students & faculty of Purdue University. Signing up for an account
                    will require verification of your unique purdue.edu email. </p>
            </div>
            <div style={{marginTop: "30px"}}>
                <h4>Posting a review:</h4>
                <p>RateThatSpot allows users to post reviews of individual amenities on campus</p>
                <img style={{width: "425px"}}src={require('../../../images/help_A.png')} />
                <p>At the top right corner of an individual amenity page, locate the button above to create a
                    new review. To prevent spam, users must wait 5 minutes in-between posting consecutive reviews.</p>
                <p>Logged-in users have the ability to upvote, downvote, and comment on individual posts.</p>
            </div>
            <div style={{marginTop: "30px"}}>
                <h4>Using the map:</h4>
                <p>Wanna find where amenities are near you? Use the map page to find buildings and their amenities!</p>
                <img style={{width: "425px", marginTop: "30px"}}src={require('../../../images/help_Whereami.png')} />
                <p>The map is located on the homepage. If you have location services enabled, you will appear as a black dot like the one 
                    circled in red. </p> <p>Use your mouse or fingers to move the map. Pinch with two fingers or use the mousewheel to zoom. </p>
                <img style={{width: "425px", marginTop: "30px"}}src={require('../../../images/help_MapPin.png')} />
                <p>Blue pins on the map indicated a building with facilities. The stars next to the pin indicate the average star rating of the buildings facilites.</p>
                <img style={{width: "425px", marginTop: "30px"}}src={require('../../../images/help_pinClick.png')} />
                <p>When you click or tap on a pin, a popoup will appear showing the buildings name, location, rating, and a picture of it. </p> <p> Clicking the blue text labeled "forum page"
                    will take you to that building's list of individual amenities.
                </p>
            </div>
            <div style={{marginTop: "30px"}}>
                <h4>Requesting a new amenity:</h4>
                <p>Found an amenity on campus that currently isn't in our system? Users can request for the
                addition of new amenities. Find the option to request a new amenity on each individual
                building page.</p>
                <img style={{width: "425px"}}src={require('../../../images/help_B.png')} />
                <img style={{width: "425px", marginTop: "30px"}}src={require('../../../images/help_C.png')} />
                <p>New requests can include a submission of an image taken of the ammenity. Requests must obtain
                    approval by a moderator before it can be added to our system. Request approvals can take up to 2-4
                    days to be fully processed.</p>
            </div>
            <div style={{marginTop: "30px"}}>
                <h4>Rules & Terms of Service:</h4>
                <p>RateThatSpot has certain terms of service that must be followed by all users. </p>
                <p>
                    - Users are prohibited from using the service in any manner that could interfere with,
                    disable, disrupt, overburden, or otherwise impair the service.
                </p>
                <p>
                    - Upload, transmit, or distribute to or through the service any viruses, worms, malicious code,
                    or other software intended to interfere with the services, including its security-related features.
                </p>
                <p>
                    - Use the service in any manner that we reasonably believe to be an abuse of or fraud on
                    RateThatSpot or any payment system.
                </p>
                <p>
                    - Unnecessary profanity, violence, or hateful conduct is not tolerated. Promotion of any of
                    these may result in a permanent ban of your account.
                </p>
            </div>
        </div>
    )


}

export default HelpPage;