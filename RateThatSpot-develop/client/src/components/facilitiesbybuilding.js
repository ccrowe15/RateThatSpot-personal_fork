import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import FilterableTable from "react-filterable-table";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { useSortBy } from "react-table/dist/react-table.development";
import { matchSorter } from 'match-sorter'
import BuildingService from "../services/building.service";
import AuthService from "../services/auth.service";
import userService from "../services/user.service";
import { Rating } from "@mui/material";

const Facility = (props) => (
    <tr>
      <td>{props.facility.type}</td>
      <td>{props.facility.description}</td>
      <td>{props.facility.floor}</td>
      <td>{props.facility.aggregateRating}</td>
      <td>{props.facility.link}</td>
    </tr>
   );

   export default function FacilitiesByBuilding() {
       const [facilities, setFacilities] = useState([]);
       const [building, setBuilding] = useState({});

        const {abbr} = useParams();

        const [favoritedBuildings, setFavoritedBuildings] = useState([{}]);
        const [favorited, setFavorited] = useState(false);
        const [userData, setUserData] = useState({});


       console.log("abbr:" + abbr + "\n");

       useEffect(() => {
        async function getFacilities() {
          const response = await fetch(`http://localhost:5000/facilities/bldgabbr/` + abbr);
      
          if (!response.ok) {
            const message = `An error occurred: ${response.statusText}`;
            window.alert(message);
            return;
          }
      
          const facilities = await response.json();
          
          for (var x = 0; x < facilities.length; x++) {
            //console.log("id="+facilities[x]._id);
            const a = await fetch('http://localhost:5000/facilities/getrating/' + facilities[x]._id);
            if (!a.ok) {
              const message = `An error occurred: ${response.statusText}`;
              window.alert(message);
              return;
            }
            const agg = await a.json();
            //console.log("agg=");
            //console.log(agg);
            facilities[x].aggregateRating = agg.aggregateRating;

            facilities[x].link = "http://localhost:3000/facility/" + facilities[x]._id;
          }

          //console.log(facilities);
          setFacilities(facilities);

          const buildingbyAddr = await BuildingService.getBuildingByCode(abbr);
          setBuilding(buildingbyAddr.data[0]);
          console.log(building)

          const auth = await AuthService.getCurrentUser()
          //console.log(auth)
          if (auth !== undefined) {
            setUserData(auth)
          } else {
            setUserData(null)
          }

          //console.log(auth.username)
          
          if (auth !== null) {
            await userService.getUserData(auth.username)
            .then(user => {
                if (!user) {
                    setFavoritedBuildings([]);
                }
                else {
                    setFavoritedBuildings(user.data[0].favoritedBuildings)
                    //console.log(user.data[0].favoritedBuildings)
                    //console.log("building ID " + buildingbyAddr.data[0]._id)
                    setFavorited(user.data[0].favoritedBuildings.includes(buildingbyAddr.data[0]._id))
                }
            })
          }
        }
      
        getFacilities();
      
        return;
      }, [facilities.length]);

       function facilitiesList() {
        return facilities.map((facility) => {
          return (
            <Facility
              facility={facility}
              key={facility._id}
            />
          );
        });
      }

      const addFavoriteBuilding = async() => {
        try {
            await userService.updateFavoritedBuildings({
                username: userData.username,
                favoritedBuildings: building._id,
                favorite: true
            })
            setFavorited(true)
        } catch (error) {
            console.log(error)
        }
      }

      const removeFavoriteBuilding = async() => {
        try {
            await userService.updateFavoritedBuildings({
                username: userData.username,
                favoritedBuildings: building._id,
                favorite: false
            })
            setFavorited(false)
        } catch (error) {
            console.log(error)
        }
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
            to
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

      const data = React.useMemo(()=>facilities)

      const columns = React.useMemo(()=> [
        {Header: "Type", accessor: "type"},
        {Header: "Description", accessor: "description"},
        {Header: "Floor", accessor: "floor"},
        {Header: "Rating", accessor: "aggregateRating"},
        {Header: "Link", accessor: "link", Cell: e =><a href={e.value}> Link </a>}
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
          <h3>Facilities in {abbr}</h3>
          <h5>{abbr}'s Aggregate Rating: <Rating value={Number(building.aggregateRating)} readOnly size='small' precision={0.05}/></h5>
        </div>
        <div style={{float: "right", marginRight: '1rem' } }>
                {(userData !== null && !favorited) && (
                    <button size="large" onClick={addFavoriteBuilding}>
                        Favorite {abbr}
                    </button>
                )}
                {(userData !== null && favorited) && (
                    <button size="large" onClick={removeFavoriteBuilding}>
                        Unfavorite {abbr}
                    </button>
                )}
        </div>
        <div style={{float: "right", marginRight: '1rem' } }>
                {(userData !== null) && (
                    <Link to={"/createFacilityRequest/" + abbr}>
                      <button size="large">
                        Request a new Facility for {abbr}
                      </button>
                    </Link>
                )}
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