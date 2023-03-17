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
import { createTheme, makeStyles } from "@material-ui/core/styles";

import Typography from "@material-ui/core/Typography";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";

import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { getDashboard, getEvents, getFlowDetails } from "../services/api";

import {
  AccessAlarm,
  ThreeDRotation,
  ExpandMoreIcon,
  CheckCircle,
  Warning,
  Error,
  ExpandMore,
  Lens,
  Delete,
  Refresh,
  Info,
  InfoOutlined,
} from "@material-ui/icons";
import Chip from "@material-ui/core/Chip";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import { green, orange, red, lightBlue, amber } from "@material-ui/core/colors";

import LinearProgress from "@material-ui/core/LinearProgress";
import moment from "moment";
import { Modal } from "@material-ui/core";

function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: "absolute", top: 0, width: "100%" }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "1px solid #c1c1c1",
    borderRadius: "5px",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  button: {
    marginLeft: theme.spacing(2),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
}));

function rand() {
  return Math.round(Math.random() * 20) - 10;
}
function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Dashboard = () => {
  const [isFetcing, setIsFetcing] = useState(false);
  const [isDetailsFetching, setIsDetailsFetching] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const [events, setEvents] = useState([]);
  const [subEvents, setSubEvents] = useState([]);

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const fetchEvents = () => {
    setIsFetcing(true);
    getDashboard(selectedDate, selectedEndDate)
      .then((response) => {
        setIsFetcing(false);
        console.log(response);
        return response.json();
      })
      .then((json) => {
        console.log(json);
        let _events = json.map((item, index) => {
          let statusColor =
            item.totalSuccessTransactions == item.totalTransactions
              ? "GREEN"
              : item.totalErrorTransactions > 0 &&
                item.totalErrorTransactions < item.totalTransactions
              ? "GOLD"
              : item.totalErrorTransactions > 0 &&
                item.totalErrorTransactions == item.totalTransactions
              ? "RED"
              : "GRAY";
          return {
            ...item,
            id: index,
            statusColor,
            detail: index,
            detail2: index,
          };
        });
        setEvents(_events);
        return _events;
      })
      .then((_events) => {
        console.log("OKAY", _events);
      })
      .catch((err) => {
        setIsFetcing(false);
        console.log(err);
        setEvents([]);
        setExpanded(false);
        alert("Error fetching data.");
      });
  };
  const fetchDetails = (flowName) => {
    setIsDetailsFetching(true);
    getFlowDetails(flowName, selectedDate)
      .then((response) => {
        setIsDetailsFetching(false);
        console.log(response);
        return response.json();
      })
      .then((json) => {
        console.log(json);
        let _events = json.data.map((item, index) => {
          let date = moment(item.timestamp_application);
          return {
            ...item,
            id: index,
            actions: `${flowName}_${index}`,
            detail: index,
            detail2: index,
            datetime: date.format("DD MMM YYYY HH:mm"),
          };
        });
        setSubEvents(_events);
        return _events;
      })
      .then((_events) => {
        console.log("OKAY", _events);
      })
      .catch((err) => {
        setIsDetailsFetching(false);
        console.log(err);
        setSubEvents([]);
        // alert("Error fetching flow details.");
      });
  };

  // useEffect(() => {
  //   fetchEvents();
  //   return () => {
  //     setEvents([]);
  //   };
  // }, [selectedDate]);

  useEffect(() => {
    fetchEvents();
    if (expanded) {
      fetchDetails(expanded);
    }
    return () => {
      setEvents([]);
      setSubEvents([]);
    };
  }, [selectedDate]);

  useEffect(() => {
    if (expanded) {
      fetchDetails(expanded);
    }
    return () => {
      setSubEvents([]);
    };
  }, [expanded]);

  const handleSearch = () => {
    setExpanded(false);
    fetchEvents();
  };

  const handleChangeFlow = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    // if (isExpanded) {
    //   fetchDetails(panel);
    // }
  };
  const handleDetailsModalClose = () => {
    setDetailsModalOpen(false);
  };

  const TestComponent = ({ param }) => <p>{param}</p>;

  const handleOpen = () => {
    setDetailsModalOpen(true);
  };

  const handleClose = () => {
    setDetailsModalOpen(false);
  };

  // const columns = [
  //   { field: "flow", headerName: "Service", width: 250 },
  //   {
  //     field: "statusColor",
  //     headerName: "Status",
  //     renderCell: (params) => {
  //       //console.log("here", params);
  //       return (
  //         <p>
  //           <span>{params.value.value}</span>
  //         </p>
  //       );
  //     },
  //   },
  //   {
  //     field: "detail",
  //     headerName: "b",
  //     renderCell: (params) => {
  //       //console.log("here", params);
  //       return (
  //         <div>
  //           <AccordionSummary
  //             expandIcon={<AccessAlarm />}
  //             aria-controls="panel1a-content"
  //             id="panel1a-header"
  //           >
  //             <div className="container">Accordion 1</div>
  //           </AccordionSummary>
  //           <AccordionDetails>
  //             <div className="container">
  //               Lorem ipsum dolor sit amet, consectetur adipiscing elit.
  //               Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
  //               eget.
  //             </div>
  //           </AccordionDetails>
  //         </div>
  //       );
  //     },
  //   },
  //   { field: "", headerName: "Key", width: 300 },
  // ];

  const detail_columns = [
    {
      field: "status",
      headerName: "Status",
      renderCell: (params) => {
        console.log("here", params);
        return (
          <div>
            <Lens
              style={{
                color: params.value === "START" ? green[500] : red[500],
              }}
            />
          </div>
        );
      },
      width: 150,
    },
    { field: "site_id", headerName: "Market", width: 125 },
    { field: "datetime", headerName: "Start Time", width: 200 },
    { field: "flow_name", headerName: "Service", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => {
        return (
          <div>
            {/* <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              startIcon={<Info />}
              //disabled={params.row.status === "START"}
              onClick={() => {
                setDetailsModalOpen(true);
              }}
            ></Button> */}
            <InfoOutlined
              className="mr-3"
              style={{ color: lightBlue[500] }}
              onClick={() => {
                setDetailsModalOpen(true);
              }}
            />
            <Button
              variant="outlined"
              size="small"
              color="secondary"
              className={classes.button}
              startIcon={<Refresh />}
              disabled={params.row.status === "START"}
              onClick={() => {
                alert("New run requested successfully.");
                //setDetailsModalOpen(true);
              }}
            >
              resubmit
            </Button>
          </div>
        );
      },
    },
    // {
    //   field: "detail",
    //   headerName: "b",
    //   renderCell: (params) => {
    //     console.log("here", params);
    //     return (
    //       <div>
    //         <AccordionSummary
    //           expandIcon={<AccessAlarm />}
    //           aria-controls="panel1a-content"
    //           id="panel1a-header"
    //         >
    //           <div className="container">Accordion 1</div>
    //         </AccordionSummary>
    //         <AccordionDetails>
    //           <div className="container">
    //             Lorem ipsum dolor sit amet, consectetur adipiscing elit.
    //             Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
    //             eget.
    //           </div>
    //         </AccordionDetails>
    //       </div>
    //     );
    //   },
    // },
  ];

  const StatusIcon = ({ status }) => {
    switch (status) {
      case "GREEN":
        return (
          <CheckCircle
            style={{ color: green[500], marginRight: theme.spacing(2) }}
          />
        );
      case "GOLD":
        return (
          <Error
            style={{ color: orange[500], marginRight: theme.spacing(2) }}
          />
        );
      case "RED":
        return <Warning color="error" />;
      default:
        return <Warning color="error" />;
    }
  };

  const DetailsModal = (item) => {
    return (
      <Modal
        open={detailsModalOpen}
        onClose={handleDetailsModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <h4>Run Details</h4>
          <p>No data available, retry later.</p>
        </div>
      </Modal>
    );
  };

  return (
    <div className="">
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Grid container justifyContent="flex-start">
          {/*
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
          */}
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
          <Button
            className="my-3"
            variant="outlined"
            color="secondary"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </MuiPickersUtilsProvider>

      <div className="mt-3">
        {events.length ? (
          events.map((item, index) => {
            return (
              <Accordion
                expanded={expanded === item.flow}
                onChange={handleChangeFlow(item.flow)}
              >
                <AccordionSummary
                  className=""
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <div className="container">
                    <h4>
                      {
                        <StatusIcon
                          style={{ marginRight: theme.spacing(2) }}
                          status={item.statusColor}
                        />
                      }{" "}
                      {item.label}
                    </h4>
                  </div>
                </AccordionSummary>
                <AccordionDetails>
                  <div style={{ height: 300, width: "100%" }}>
                    <DataGrid
                      columns={detail_columns}
                      rows={subEvents}
                      loading={isDetailsFetching}
                    />
                  </div>
                </AccordionDetails>
              </Accordion>
            );
          })
        ) : isFetcing ? (
          <p>is loading...</p>
        ) : (
          <p>No data</p>
        )}
      </div>
      {/*
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid rows={events} columns={columns} getRowHeight={() => "auto"} />
      </div>
      */}
      <DetailsModal open={detailsModalOpen} />
    </div>
  );
};

export default Dashboard;
