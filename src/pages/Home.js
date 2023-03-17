import React, { useState, useEffect } from "react";
import Grid from "@material-ui/core/Grid";
import "date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import Button from "@material-ui/core/Button";

import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";

import { DataGrid } from "@mui/x-data-grid";
import { getEvents } from "../services/api";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [events, setEvents] = useState([]);

  const fetchEvents = () => {
    getEvents(selectedDate, selectedEndDate)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((json) => {
        console.log(json);
        let _events = json.data.map((item, index) => {
          return { ...item, id: index };
        });
        setEvents(_events);
        return _events;
      })
      .then((_events) => {
        console.log(_events);
      })
      .catch((err) => {
        alert("Error fetching data.");
        console.log(err);
        setEvents([]);
      });
  };
  useEffect(() => {
    fetchEvents();
    return () => {
      setEvents([]);
    };
  }, []);

  const handleSearch = () => {
    fetchEvents();
  };

  const classes = useStyles();
  const [age, setAge] = useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const rows = [
    { id: 1, col1: "Hello", col2: "World" },
    { id: 2, col1: "DataGridPro", col2: "is Awesome" },
    { id: 3, col1: "Material-UI", col2: "is Amazing" },
  ];

  const columns = [
    { field: "timestamp_application", headerName: "Time", width: 180 },
    { field: "flow_name", headerName: "App", width: 250 },
    { field: "key1", headerName: "Key", width: 300 },
    { field: "status", headerName: "Status", width: 140 },
    { field: "request_id", headerName: "Request Id", width: 250 },
    { field: "country_code", headerName: "Country", width: 130 },
  ];

  return (
    <div className="">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justifyContent="flex-start">
          <FormControl className={classes.formControl}>
            <InputLabel id="demo-simple-select-label">Country</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              onChange={handleChange}
            >
              <MenuItem value={10}>Bata Italy</MenuItem>
              <MenuItem value={20}>Awlab Italy</MenuItem>
              <MenuItem value={30}>Bata Czechia</MenuItem>
            </Select>
          </FormControl>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date"
            value={selectedDate}
            onChange={setSelectedDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
            style={{ marginRight: 25 }}
          />
          {/*
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="dd/MM/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="End Date"
            value={selectedEndDate}
            onChange={setSelectedEndDate}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
          */}
        </Grid>
        <Button variant="outlined" color="secondary" onClick={handleSearch}>
          Search
        </Button>
      </MuiPickersUtilsProvider>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={events} columns={columns} />
      </div>
    </div>
  );
};

export default Home;
