import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import FilterableTable from "react-filterable-table";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { useSortBy } from "react-table/dist/react-table.development";
import { matchSorter } from 'match-sorter'

/*class Facilities extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }

    render() {
    //const [facilities, setFacilities] = useState([]);

    //const ref = useRef(null);

    const FilterableTable = require('react-filterable-table');

    console.log("test\n");

    async function getFacilities() {
      const response = await fetch(`http://localhost:5000/facilities`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
   
      const facilities = await response.json();
       
      for (var x = 0; x < facilities.length; x++) {
        console.log("id="+facilities[x]._id);
        const a = await fetch('http://localhost:5000/facilities/getrating/' + facilities[x]._id);
        if (!a.ok) {
          const message = `An error occurred: ${response.statusText}`;
          window.alert(message);
          return;
        }
        const agg = await a.json();
        console.log("agg=");
        console.log(agg);
        facilities[x].aggregateRating = agg.aggregateRating;
      }

      //console.log(facilities);
      this.state;
    }
   
    getFacilities();
   

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

    return (
      <div>
      <h3>Facilities</h3>
      <FilterableTable
        namespace="Facilities"
        initialSort="type"
        data={facilitiesList()}
        fields={[
          {name: "type", displayName: "Type", inputFilterable: true, exactFilterable: true, sortable: true},
          {name: "description", displayName: "Description", inputFilterable: true, exactFilterable: false, sortable: false},
          {name: "building", displayName: "Building", inputFilterable: true, exactFilterable: true, sortable: true},
          {name: "floor", displayName: "Floor", inputFilterable: false, exactFilterable: false, sortable: false},
          {name: "aggregateRating", displayName: "AggregateRating", inputFilterable: false, exactFilterable: false, sortable: true}
        ]}
        noRecordsMessage="No facilities found"
        noFilteredRecordsMessage="No facilities match your filter"
      />
    </div>
    );
  }
}*/

const Facility = (props) => (
    <tr>
      <td>{props.facility.type}</td>
      <td>{props.facility.description}</td>
      <td>{props.facility.building}</td>
      <td>{props.facility.floor}</td>
      <td>{props.facility.aggregateRating}</td>
      <td>{props.facility.link}</td>
    </tr>
   );

    export default function Facilities() {
       const [facilities, setFacilities] = useState([]);

       const ref = useRef(null);

       const FilterableTable = require('react-filterable-table');

       console.log("test\n");

       useEffect(() => {
        async function getFacilities() {
          const response = await fetch(`http://localhost:5000/facilities`);
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
            
            //create link
            facilities[x].link = "http://localhost:3000/facility/" + facilities[x]._id;
          }

          //console.log(facilities);
          setFacilities(facilities);
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

      /*console.log("List:")
      console.log(facilitiesList())
      console.log("or")
      console.log(facilities)*/

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
        {Header: "Building", accessor: "building"},
        {Header: "Floor", accessor: "floor"},
        {Header: "Rating", accessor: "aggregateRating"},
        {Header: "Link", accessor: "link", url: true, Cell: e =><a href={e.value}> Link </a>},
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
        <h3>Facilities</h3>
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