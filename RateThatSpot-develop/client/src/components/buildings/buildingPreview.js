import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Rating } from "@mui/material";



export function BuildingPreviewCard(props) {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-link">
          <Link to={"/facilities/bldgabbr/" + props.building.buildingCode} className="nav-link">
            {props.building.name}
          </Link>
        </h5>
        <h6 className="card-subtitle mb-2 text-muted">
          Building Code: {props.building.buildingCode}
        </h6>
        <p className="card-text">
            Aggregate Rating: <Rating value={Number(props.building.aggregateRating)} readOnly size='small' precision={0.05}/> 
        </p>
      </div>
    </div>
  )
}