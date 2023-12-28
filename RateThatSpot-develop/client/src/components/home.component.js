import React, {useEffect} from 'react';
import BuildingService from "../services/building.service"
import {useState} from "react";
import { Link } from "react-router-dom";
import { MapContainer, useMap, Tooltip, TileLayer, Marker, Popup, LayerGroup, LayersControl } from 'react-leaflet';
import { CardMedia } from "@material-ui/core";
import TopAmenities from './homeCard/topAmenities';
import L from "leaflet";
import { Rating } from "@mui/material";

import './map.css';

//custom icon for user
var userIcon = L.icon({
  iconUrl: 'https://res.cloudinary.com/ratethatspot/image/upload/v1649661968/mapMarker/person_grr5rn.png',
  iconSize: [25, 38],
  iconAnchor: [12, 38],
  popupAnchor: [2, -37],

  shadowUrl: 'https://res.cloudinary.com/ratethatspot/image/upload/v1649661768/mapMarker/shadow_xkurty.png',
  shadowSize: [41, 41],
  shadowAnchor: [8, 39]
});

//home page that includes our map and pins, grabs building data and maps data to markers
const Home = () => {
  const [buildings, setBuildingData] = useState([]);
  const defaultPosition = [40.425, -86.914];

  useEffect(async () => {
    await BuildingService.getAllBuildings().then((buildingdata => {
      console.log(buildingdata);
      setBuildingData(buildingdata.data)
    }));
  }, []);

  //child component of map to find user location
  function UserMarker() {
    const [position, setPosition] = useState(null);

    const map = useMap();

    //update map when given user's geolocation
    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        // on extremely inaccurate networks the accuracy radius is quite large
        //const radius = e.accuracy;
        const circle = L.circle(e.latlng, 30);
        circle.setStyle({color: 'black'});
        circle.addTo(map);
      });
    }, []);
    // if position was given, a marker for their location is created
    return position === null ? null : (
      <Marker position={position} icon={userIcon} >
        <Popup>
          You are here. <br />
        </Popup>
      </Marker>
    );
  }

  return (
      <div className="container">
      <div style={{ marginTop: "4rem" }} className="row">
      <div className="col s8 offset-s2">
        <h1>Welcome to RateThatSpot!</h1>
        <br></br>
        <h5>A site for students to collaboratively map Purdue's amenities</h5>

        <MapContainer center={defaultPosition} zoom={16} scrollWheelZoom={true}>
        
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Select Buildings">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>
          <UserMarker />
          <LayersControl.Overlay checked name="All Buildings">
            <LayerGroup>
              {buildings.map(building => (
                <Marker key={building.id} position={[building.loc.coordinates[1], building.loc.coordinates[0]]}>
                  <Tooltip direction="right" offset={[0,0]} opacity={1} permanent>
                    <Rating value={Number(building.aggregateRating)} readOnly size='small' precision={0.05}/>
                    </Tooltip>
                  <Popup>
                    <h4>{building.name} ({building.buildingCode})</h4>
                    <p>{building.address}</p>
                    <p>AggregateRating: {building.aggregateRating}</p>
                    <p><Rating value={Number(building.aggregateRating)} readOnly size='small' precision={0.05}/></p>
                    <Link to={`/facilities/bldgabbr/${building.buildingCode}`}>Forum Page</Link>
                    <p></p>
                    <CardMedia
                      component="img"
                      alt="green iguana"
                      height="140"
                      src={require(`../images/${building.buildingCode}.png`)}
                    />
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Rating Greater Than 4">
            <LayerGroup>
              {buildings.filter(obj => obj.aggregateRating >= 4).map(building => (
                <Marker key={building.id} position={[building.loc.coordinates[1], building.loc.coordinates[0]]}>
                  <Tooltip direction="right" offset={[0,0]} opacity={1} permanent>
                    <Rating value={Number(building.aggregateRating)} readOnly size='small' precision={0.05}/>
                  </Tooltip>
                  <Popup>
                    <h4>{building.name} ({building.buildingCode})</h4>
                    <p>{building.address}</p>
                    <p>AggregateRating: {building.aggregateRating}</p>
                    <p><Rating value={Number(building.aggregateRating)} readOnly size='small' precision={0.05}/></p>
                    <Link to={`/facilities/bldgabbr/${building.buildingCode}`}>Forum Page</Link>
                    <p></p>
                    <CardMedia
                      component="img"
                      alt="green iguana"
                      height="140"
                      src={require(`../images/${building.buildingCode}.png`)}
                    />
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Rating Below 4">
            <LayerGroup>
              {buildings.filter(obj => obj.aggregateRating < 4).map(building => (
                <Marker key={building.id} position={[building.loc.coordinates[1], building.loc.coordinates[0]]}>
                  <Tooltip direction="right" offset={[0,0]} opacity={1} permanent>
                    <Rating value={Number(building.aggregateRating)} readOnly size='small' precision={0.05}/>
                  </Tooltip>
                  <Popup>
                    <h4>{building.name} ({building.buildingCode})</h4>
                    <p>{building.address}</p>
                    <p>AggregateRating: {building.aggregateRating}</p>
                    <p><Rating value={Number(building.aggregateRating)} readOnly size='small' precision={0.05}/></p>
                    <Link to={`/facilities/bldgabbr/${building.buildingCode}`}>Forum Page</Link>
                    <p></p>
                    <CardMedia
                      component="img"
                      alt="green iguana"
                      height="140"
                      src={require(`../images/${building.buildingCode}.png`)}
                    />
                  </Popup>
                </Marker>
              ))}
            </LayerGroup>
          </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
        <br />
        <h3>Here are some of the top amenities at Purdue</h3>
        <TopAmenities />
      </div>
      </div>
      </div>

  );
}

export default Home;