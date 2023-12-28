import React, { useEffect, useState, useRef} from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {Card, CardActions, CardContent, CardMedia, Button, Typography} from "@material-ui/core";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { useSortBy } from "react-table/dist/react-table.development";
import { matchSorter } from 'match-sorter';
import userService from "../services/user.service";
import authService from "../services/auth.service";
import { Rating } from "@mui/material";

const Post = (props) => (
    <tr>
      <td>{props.post.title}</td>
      <td>{props.post.username}</td>
      <td>{props.post.rating}</td>
      <td>{props.post.totalVotes}</td>
      <td>{props.post.postDate}</td>
      <td>{props.post.link}</td>
    </tr>
);

export default function SingleFacility() {
    const [facility, setFacility] = useState([]);
    const [posts, setPosts] = useState([]);
    const {id} = useParams();
    const navigate = useNavigate();
    const [authData, setAuthData] = useState({});
    const [followed, setFollowed] = useState(false);

    useEffect(() => {
        async function getFacility() {
          const response = await fetch(`http://localhost:5000/facilities/` + id);
          if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
          }
      
          const facility = await response.json();
          
         /* const a = await fetch('http://localhost:5000/facilities/getrating/' + facility._id);
            if (!a.ok) {
              const message = `An error occurred: ${response.statusText}`;
              window.alert(message);
              return;
            }
            const agg = await a.json();
            console.log("agg=");
            console.log(agg);
            facility.aggregateRating = agg.aggregateRating;*/

        const p = await fetch('http://localhost:5000/posts/amenity/' + id);
        if (!p.ok) {
            const message = `An error occured: ${p.statusText}`;
            window.alert(message);
            return
        }

            var posts = await p.json();
            for (var i = 0; i < posts.length; i++) {
              posts[i].link = "http://localhost:3000/viewPost/" + posts[i]._id
            }

            setFacility(facility);

            // Get data of logged in user to check if post is favorited or not
            const auth = await authService.getCurrentUser();
            if (auth !== null && auth !== undefined) {
              setAuthData(auth)
              const user = await userService.getUserData(auth.username);
              console.log(user)
              if (!user) {
                setFollowed(false);
              }
              else {
                setFollowed(user.data[0].favoritedFacilities.includes(facility._id))
                console.log(user.data[0].blockedBy.includes(posts[0].author))
                posts = posts.filter(post => !(user.data[0].blockedBy.includes(post.author)))
              }
            }
            else {
              setFollowed(false);
            }
            setPosts(posts)
        }
      
        getFacility();
      
        return;
      }, [posts.length]);

      const addFavoriteFacility = async() => {
        try {
            await userService.updateFavoritedFacilities({
                username: authData.username,
                favoritedFacilities: facility._id,
                favorite: true
            })
            setFollowed(true)
        } catch (error) {
            console.log(error)
        }
    }

    const removeFavoriteFacility = async() => {
      try {
          await userService.updateFavoritedFacilities({
              username: authData.username,
              favoritedFacilities: facility._id,
              favorite: false
          })
          setFollowed(false)
      } catch (error) {
          console.log(error)
      }
    }



      function postList() {
        return posts.map((post) => {
          return (
            <Post
              post={post}
              key={post._id}
            />
          );
        });
      }

      function GlobalFilter({
        preGlobalFilteredRows,
        globalFilter,
        setGlobalFilter,
      }) {
        const count = preGlobalFilteredRows.length
        const [value, setValue] = React.useState(globalFilter)
        const onChange = useAsyncDebounce(value => {
          setGlobalFilter(value || undefined)
        }, 200)
      
        return (
          <span>
            Search:{' '}
            <input
              value={value || ""}
              onChange={e => {
                setValue(e.target.value);
                onChange(e.target.value);
              }}
              placeholder={`${count} records...`}
              style={{
                fontSize: '1.1rem',
                border: '0',
              }}
            />
          </span>
        )
      }

      function DefaultColumnFilter({
        column: { filterValue, preFilteredRows, setFilter },
      }) {
        const count = preFilteredRows.length
      
        return (
          <input
            value={filterValue || ''}
            onChange={e => {
              setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
            }}
            placeholder={`Search ${count} records...`}
          />
        )
      }

      function SelectColumnFilter({
        column: { filterValue, setFilter, preFilteredRows, id },
      }) {
        // Calculate the options for filtering
        // using the preFilteredRows
        const options = React.useMemo(() => {
          const options = new Set()
          /*preFilteredRows.forEach(row => {
            options.add(row.values[id])
          })*/
          options.add("Drinking Fountain");
          options.add("Bathroom");
          options.add("Study Space");
          return [...options.values()]
        }, [id, preFilteredRows])
      
        // Render a multi-select box
        return (
          <select
            value={filterValue}
            onChange={e => {
              setFilter(e.target.value || undefined)
            }}
          >
            <option value="">All</option>
            {options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      }

      function NumberRangeColumnFilter({
        column: { filterValue = [], preFilteredRows, setFilter, id },
      }) {
        const [min, max] = React.useMemo(() => {
          let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
          let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0
          preFilteredRows.forEach(row => {
            min = Math.min(row.values[id], min)
            max = Math.max(row.values[id], max)
          })
          return [min, max]
        }, [id, preFilteredRows])
      
        return (
          <div
            style={{
              display: 'flex',
            }}
          >
            <input
              value={filterValue[0] || ''}
              type="number"
              onChange={e => {
                const val = e.target.value
                setFilter((old = []) => [val ? parseInt(val, 10) : undefined, old[1]])
              }}
              placeholder={`Min (${min})`}
              style={{
                width: '70px',
                marginRight: '0.5rem',
              }}
            />
            
            <input
              value={filterValue[1] || ''}
              type="number"
              onChange={e => {
                const val = e.target.value
                setFilter((old = []) => [old[0], val ? parseInt(val, 10) : undefined])
              }}
              placeholder={`Max (${max})`}
              style={{
                width: '70px',
                marginLeft: '0.5rem',
              }}
            />
          </div>
        )
      }

      function fuzzyTextFilterFn(rows, id, filterValue) {
        return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
      }
      
      // Let the table remove the filter if the string is empty
      fuzzyTextFilterFn.autoRemove = val => !val

      const data = React.useMemo(()=>posts)

      const columns = React.useMemo(()=> [
        {Header: "Title of Post", accessor: "title"},
        {Header: "Author of Post", accessor: "username"},
        {Header: "Rating Given", accessor: "rating"},
        {Header: "Total Votes", accessor: "totalVotes"},
        {Header: "Date Posted", accessor: "postDate", Cell: e => <a>{e.value.substring(0,10)}</a>},
        {Header: "Review Link", accessor: "link", Cell: e =><a href={e.value}> Link </a>}
      ], []);
 
      const filterTypes = React.useMemo(
        () => ({
          // Add a new fuzzyTextFilterFn filter type.
          fuzzyText: fuzzyTextFilterFn,
          // Or, override the default text filter to use
          // "startWith"
          text: (rows, id, filterValue) => {
            return rows.filter(row => {
              const rowValue = row.values[id]
              return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .startsWith(String(filterValue).toLowerCase())
                : true
            })
          },
        }),
        []
      )
    
      const defaultColumn = React.useMemo(
        () => ({
          // Let's set up our default Filter UI
          Filter: DefaultColumnFilter,
        }),
        []
      )

      const tableInstance = useTable({columns, data, defaultColumn, filterTypes}, useFilters, useGlobalFilter, useSortBy);
 
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        visibleColumns,
        preGlobalFilteredRows,
        setGlobalFilter,
      } = tableInstance;

       return (
        <div>
        <div style={{float: "left"}}>
              <CardContent>
              <Typography gutterBottom variant="h4" component="div">
                    {facility.type} located in {facility.building} floor {facility.floor}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                    Description: {facility.description}
                </Typography>
                <Typography gutterBottom variant="h5" component="div">
                    Aggregate Rating: <Rating value={Number(facility.aggregateRating)} readOnly size='small' precision={0.05}/>
                </Typography>
                <CardMedia 
                  component="img"
                  style={{ 
                    maxHeight: "200px",
                    width: "auto"}
                  }
                  src={facility.picture}
                />
              </CardContent>
              <CardActions>
                
              </CardActions>
            </div>
          <div style={{float: "left",  marginTop: '2rem', marginRight: '1rem' }}>
                <Button size = "large" variant="contained" onClick={() => {navigate("/createPost/" + id)}}>
                  Create a Review
                </Button>
                { (authData !== null && followed === false) && (<Button size = "large" variant="contained" onClick={addFavoriteFacility}>Favorite</Button>)}
                { (authData !== null && followed === true) && (<Button size = "large" variant="contained" onClick={removeFavoriteFacility}>Unfavorite</Button>)}
          </div>
        <table {...getTableProps()}>
          <thead>
            {
              headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {
                    headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                        {
                          column.render('Header')}
                          {<span>
                            {column.isSorted 
                              ? column.isSortedDesc 
                                ? ' \u25b2'
                                : ' \u25bc'
                              : ''}</span>}
                              <div>{column.canFilter ? column.render('Filter') : null}</div>
                      </th>
                    ))}
                </tr>
              ))}
          </thead>
          {}
          <tbody {...getTableBodyProps}>
            {
              rows.map(row=>{
                prepareRow(row)
                return (
                  <tr {...row.getRowProps()}>
                    {
                      row.cells.map(cell=>{
                        return (
                          <td {...cell.getCellProps()}>
                            {cell.render('Cell')}
                          </td>
                        )
                      })}
                  </tr>
                )
              })}
          </tbody>
        </table>

      </div>
       );

  
} 