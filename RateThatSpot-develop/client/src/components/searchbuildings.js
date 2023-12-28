import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Building = (props) => (
    <tr>
      <td>{props.building.name}</td>
      <td>{props.building.address}</td>
      <td>{props.building.aggregateRating}</td>
      <td>{props.building.numFloors}</td>
      <td>{props.building.buildingCode}</td>
    </tr>
   );

   export default function SearchBuildings() {
       const [buildings, setBuildings] = useState([]);

        const {searchKey} = useParams();
        console.log("Search Key: "+searchKey+"\n")

       useEffect(() => {
        async function getBuildings() {
          const response = await fetch(`http://localhost:5000/building/search/` + searchKey);
      
          if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
          }
      
          const buildings = await response.json();
          console.log(buildings);
          setBuildings(buildings);
        }
      
        getBuildings();
      
        return;
      }, [buildings.length]);

       function buildingsList() {
        return buildings.map((building) => {
          return (
            <Building
              building={building}
              key={building._id}
            />
          );
        });
      }

       return (
        <div>
        <h3>Buildings Found</h3>
        <table className="table table-striped" style={{ marginTop: 20 }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
              <th>Rating</th>
              <th>Floors</th>
              <th>Code</th>
            </tr>
          </thead>
          <tbody>{buildingsList()}</tbody>
        </table>
      </div>
       );
   }