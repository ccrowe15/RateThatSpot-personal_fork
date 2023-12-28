import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";


   
export default function UserSearchBox() {
    const [term, setTerm] = useState({
        text: ""
    });
    const navigate = useNavigate();
        
    function updateSearch(value) {
        console.log("Setting term")
        return setTerm({text: value});
    }
          
    function submitSearch(e) {
        e.preventDefault();
          
        const target = "/searchUsers";
        
        navigate(target, {state: {
          term: term.text}});
        window.location.reload(true);
    }

    return (
        <form className="form-inline" onSubmit={submitSearch} style={{"whiteSpace": "nowrap"}}>
            <input type="search" value={term.text} onChange={(e) => updateSearch(e.target.value)} className="form-control mr-sm-2" style={{color: "white", display:"inline-block", width: "50%"}}/>
            <button type="submit" value="Search Users" className="btn btn-success my-2 my-sm-0" style={{display:"inline-block", scale:"75%"}}>Search Users</button>
        </form>
    );
}