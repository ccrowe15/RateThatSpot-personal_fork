import React, { Component, useEffect, useState } from "react";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";
import { useParams } from "react-router";
import Button from '@material-ui/core/Button';
import { Link } from "react-router-dom";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce } from 'react-table'
import { useSortBy } from "react-table/dist/react-table.development";
import { matchSorter } from 'match-sorter'
import { useNavigate } from "react-router";
import NotificationService from "../services/notification.service";

const Notification = (props) => (
    <tr>
        <td>props.notification.title</td>
        <td>props.notification.body</td>
        <td>props.notification.sent</td>
    </tr>
);



export default function Notifications() {
    const [authData, setAuthData] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [mayNotify, setMayNotify] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        async function getNotifications() {
            const auth = await AuthService.getCurrentUser();
            console.log("auth");
            console.log(auth);
            if (auth !== null || auth !== undefined) {
                setAuthData(auth);
            } else {
                const message = 'Please log in to view your notifications.'
                window.alert(message);
                navigate("/login");
            }
            if (authData != null) {
                console.log("authdata");
                console.log(authData);
                const response = await fetch(`http://localhost:5000/notifications/` + auth.username);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const notifications = await response.json();
            console.log("notifications");
            console.log(notifications);

            setNotifications(notifications);

            const mn = await fetch(`http://localhost:5000/users/mayNotifyUsername/` + auth.username);
            const mayn = await mn.json();
            if (mayn[0].mayNotify == false) {
              setMayNotify(false);
            } else {
              setMayNotify(true);
            }
            }
        }
        getNotifications();

        return;
    }, [notifications.length]);

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

    async function resetState() {
      const auth = await AuthService.getCurrentUser();
            console.log("auth");
            console.log(auth);
            if (auth !== null || auth !== undefined) {
                setAuthData(auth);
            } else {
                const message = 'Please log in to view your notifications.'
                window.alert(message);
                navigate("/login");
            }
            if (authData != null) {
                console.log("authdata");
                console.log(authData);
                const response = await fetch(`http://localhost:5000/notifications/` + auth.username);
            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const notifications = await response.json();
            console.log("notifications");
            console.log(notifications);

            setNotifications(notifications);
            }
    }

    async function deleteNotification (target) {
        const deletedNotification = await NotificationService.deleteNotification(target);
        console.log(deletedNotification)
        resetState();
    }

    const data = React.useMemo(()=>notifications)

    const columns = React.useMemo(()=> [
        {Header: "Title", accessor: "title"},
        {Header: "Body", accessor: "body"},
        {Header: "Sent On", accessor: "sent"},
        {Header: "Delete", accessor: "_id", url: true, Cell: e =><a> <button onClick={() => deleteNotification(e.value)}>Delete</button> </a>}
    ], []);

    const filterTypes = React.useMemo(
        () => ({
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
    );

    const defaultColumn = React.useMemo(
        () => ({
          // Let's set up our default Filter UI
          Filter: DefaultColumnFilter,
        }),
        []
    );

    const tableInstance = useTable({columns, data, defaultColumn, filterTypes}, useFilters, useGlobalFilter, useSortBy);

    async function setNotify(yn) {
      const mn = {mayNotify: yn};
      await fetch(`http://localhost:5000/users/mayNotify/` + authData.username, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mn)
      }).catch(error => {
        window.alert(error);
        return;
      });
      setMayNotify(yn);
      resetState();
    }

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
            <h3>Your Notifications</h3>
            Notify me when a user I follow posts: <b>{mayNotify.toString()}</b><br></br>
            <button onClick={() => setNotify(true)}>True</button>
            <button onClick={() => setNotify(false)}>False</button>
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