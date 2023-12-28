import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router";

   
export default function SearchBox() {
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
          
        const target = "/building/search/" + term.text;
        
        navigate(target);
        window.location.reload(true);
    }

    return (
        <form onSubmit={submitSearch} className="form-inline">
            <input type="text" value={term.text} onChange={(e) => updateSearch(e.target.value)}className="form-control mr-sm-2" style={{color: "black", display:"inline-block", width: "50%"}}></input>
            <input type="submit" value="Search"className="btn btn-success my-2 my-sm-0" style={{display:"inline-block", scale:"75%"}}></input>
        </form>
    );
}