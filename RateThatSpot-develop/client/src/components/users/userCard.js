import { Link} from "react-router-dom";
import {ListItem} from "@material-ui/core";

export default function UserCard(props) {
  return (
    <ListItem>
      <div className="card" style={{padding: "10px"}}>
        <div className="row g-0">
            <div className="card-body">
              <h5 className="card-tile">{props.user.name}</h5>
              <Link to={"/profile/" + props.user.name} className="nav-link">
                  view profile
              </Link>
          </div>
        </div>
      </div>
    </ListItem>
  )
}