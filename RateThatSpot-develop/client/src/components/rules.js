import React, {Component} from "react";

export default class RulesPage extends Component {
    render() {
        return (
            <div>
                <h1>RateThatSpot Rules</h1>
                <h3>1: Speak kindly.</h3>
                Hate speech and vulgarity will not be tolerated. This is a collaborative site where we review our campus for the purpose of helping each other find the best opportunities, we should not push people away. Any such actions will be subject to moderator intervention.<br></br>
                <h3>2: Be on topic.</h3>
                This site is about campus facilities, please refrain from derailing that discussion more than necessary. Spamming and other repeated off-topic and intentionally unhelpful behaviors will be subject to moderation.<br></br>
                <h3>3: Keep pictures appropriate.</h3>
                Notably, when submitting a request to add a facility, do not take pictures of the inside of the bathrooms for privacy reasons. Furthermore, inappropriate profile pictures will be removed and repeat offenses will be subject to further moderation.
            </div>
        );
    }
}