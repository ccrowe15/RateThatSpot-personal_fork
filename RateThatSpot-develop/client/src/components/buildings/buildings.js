import React, {useEffect} from 'react';
import { useSelector } from  'react-redux';
import Building from './building/building';
import {CircularProgress, List, ListItem} from "@material-ui/core";
import BuildingService from "../../services/building.service"
import {useState} from "react";
import SearchBox from '../searchBox';

function routeChange() {
    //TODO
}

const Buildings = () => {
    const [buildings, setBuildingData] = useState([])

    useEffect(async () => {
        const buildingData = await BuildingService.getAllBuildings()
        setBuildingData(buildingData.data)
    }, [])


    return (
        !buildings.length ? (
            <div style={{marginTop: "30px", marginLeft: "30px"}}>
                <CircularProgress/>
                <h4 style={{marginTop: "20px"}}>loading...</h4>
            </div>) : (
            <div style={{ justifyContent:'center'}}>
            <List>
                { buildings.map((building) => (
                    <ListItem onClick={routeChange} key={building.id} item xs={12} sm={6}>
                        <Building building={building}/>
                    </ListItem>
                ))}
            </List>
            </div>
        )
    )
}


export default Buildings;