import logo from './logo.svg';
import './App.css';
import './common/common.scss';
// import { Provider } from 'react-redux';
// import { PersistGate } from 'redux-persist/integration/react';
// import { store, persistor } from './redux/store';
import { Route, BrowserRouter } from 'react-router-dom';
import Home from './containers/home/home';
import Header from './common/header/header';
import Dashboard from './containers/home/dashboard/dashboard';
import SideDrawerHome from './common/sideDrawers/sideDrawerHome';
import 'antd/dist/reset.css';
import Leads from './containers/leads/leads';
import Calls from './containers/calls/calls';

import { Provider } from 'react-redux'

import store from './redux/store';
import { useEffect, useState } from 'react';
import LoginPage from './containers/loginPage/loginPage';

import { io } from 'socket.io-client'
import FinanceMain from './containers/finance/financeMain';
import Dispatch from './containers/dispatch/dispatch';

// const socket = io('http://localhost:5000')
const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

function App() {

  let [activeUser, setActiveUser] = useState("")

  const [time, setTime] = useState('fetching')

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"))
    if (user) {
      setActiveUser(user)
    } else {
      if (window.location.pathname !== "/login") {
        // window.location.href = "http://192.168.18.228:3000/login"
        window.location.href = "https://admin.qualitybutlerservices.com/login"
      }
    }
  }, [])

  const showNotification = () => {
    new Notification('You have a new job')
  }

  useEffect(() => {
    socket.emit("join_room", { roomname: "abc" });
    socket.on("notifier", (data) => {
      showNotification()
    });
    if (!("Notification" in window)) {
      console.log("Browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }, [socket])


  // console.log = console.warn = console.error = () => { };

  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          {activeUser &&
            <Header />
          }
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/home/dashboard" component={Home} />
          <Route exact path="/home/services" component={Home} />
          <Route exact path="/home/subservices" component={Home} />
          <Route exact path="/home/mobilesubservices" component={Home} />
          <Route exact path="/home/workers" component={Home} />
          <Route exact path="/home/teams" component={Home} />
          <Route exact path="/home/vendorteams" component={Home} />
          <Route exact path="/home/customers" component={Home} />
          <Route exact path="/home/crm-users" component={Home} />
          <Route exact path="/home/vendors" component={Home} />
          <Route exact path="/leads" component={Leads} />
          <Route exact path="/calls" component={Calls} />
          <Route exact path="/finance" component={FinanceMain} />
          <Route exact path="/dispatch" component={Dispatch} />
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;


// import React, { useState } from "react";
// import Papa from "papaparse";
// import axios from "axios";

// // Allowed extensions for input file
// const allowedExtensions = ["csv"];

// const App = () => {

//   // This state will store the parsed data
//   const [data, setData] = useState([]);

//   // It state will contain the error when
//   // correct file extension is not used
//   const [error, setError] = useState("");

//   // It will store the file uploaded by the user
//   const [file, setFile] = useState("");

//   // This function will be called when
//   // the file input changes
//   const handleFileChange = (e) => {
//     setError("");

//     // Check if user has entered the file
//     if (e.target.files.length) {
//       const inputFile = e.target.files[0];

//       // Check the file extensions, if it not
//       // included in the allowed extensions
//       // we show the error
//       const fileExtension = inputFile?.type.split("/")[1];
//       if (!allowedExtensions.includes(fileExtension)) {
//         setError("Please input a csv file");
//         return;
//       }

//       // If input type is correct set the state
//       setFile(inputFile);
//     }
//   };
//   const handleParse = () => {

//     // If user clicks the parse button without
//     // a file we show a error
//     if (!file) return setError("Enter a valid file");

//     // Initialize a reader which allows user
//     // to read any file or blob.
//     const reader = new FileReader();

//     // Event listener on reader when the file
//     // loads, we parse it and set the data.
//     reader.onload = async ({ target }) => {
//       const csv = Papa.parse(target.result, { header: true });
//       const parsedData = csv?.data;
//       const columns = parsedData;
//       console.log(columns[0])
//       for (let i = 0; i < columns.length; i++) {
//         if (i >= 150 && i < 200) {
//           let obj = {
//             leadNo: columns[i].Id,
//             jobId: "",
//             service: columns[i].Title,
//             dateCreated: columns[i][`Booking Date`],
//             serviceId: "",
//             subService: "",
//             subServiceId: "",
//             city: "",
//             nearestLandmark: "",
//             zone: "",
//             address: columns[i].Address,
//             status: "",
//             source: "",
//             formName: "",
//             description: columns[i].Desc,
//             notes: "",
//             customerName: columns[i].Customer,
//             customerId: "",
//             customerRating: "",
//             email: "",
//             customerFeedback: "",
//             customerPhone: columns[i].Contact,
//             workerObj: [
//               {
//                 workerName: "",
//                 workerTeam: "",
//                 workerId: "",
//                 workerTeamId: "",
//                 workerRating: ""
//               }
//             ]
//             ,
//             vendorObj: [
//               {
//                 vendorName: "",
//                 vendorTeam: "",
//                 vendorId: "",
//                 vendorTeamId: "",
//                 vendorRating: ""
//               }
//             ]
//             ,
//             images: [],
//             amount: 0,
//             scheduledDate: "",
//             scheduledTo: "",
//             followUpDate: "",
//             dateContacted: "",
//             slot: "",
//             history: []
//           }

//           var config = {
//             method: 'post',
//             url: `${process.env.REACT_APP_BACKEND_URL}/api/jobs`,
//             data: obj
//           };
//           axios(config)
//             .then((res) => {

//             })
//         }
//       }
//       // setData(columns);
//     };
//     reader.readAsText(file);
//   };

//   return (
//     <div>
//       <label htmlFor="csvInput" style={{ display: "block" }}>
//         Enter CSV File
//       </label>
//       <input
//         onChange={handleFileChange}
//         id="csvInput"
//         name="file"
//         type="File"
//       />
//       <div>
//         <button onClick={handleParse}>Parse</button>
//       </div>
//       <div style={{ marginTop: "3rem" }}>
//         {error ? error : data.map((col,
//           idx) => <div key={idx}>{col.Customer}</div>)}
//       </div>
//     </div>
//   );
// };

// export default App;
