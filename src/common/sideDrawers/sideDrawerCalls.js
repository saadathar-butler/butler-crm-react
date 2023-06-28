import { Select } from 'antd';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './sideDrawerCalls.scss'
import axios from 'axios';

export default function SideDrawerHome(props) {

    let [newJobs, setNewJobs] = useState([])
    let [selectedItem, setSelectedItem] = useState("")

    let [selectedType, setSelectedType] = useState("New Leads")

    const handleChange = (value) => {
        setSelectedType(value)
        setSelectedItem("")
        props.setSelectedItem("")
    };

    useEffect(() => {
        if (props.newJobs.length) {
            setNewJobs(props.newJobs)
        }
    }, [props.newJobs])

    useEffect(() => {
        setSelectedItem(props.selectedItem)
        console.log(props.selectedItem)
    }, [props.selectedItem])

    useEffect(() => {
        joinRoom({ ...selectedItem, roomname: "abc" })
        getJobs()
    }, [])

    const joinRoom = (id) => {
        props.socket.emit("join_room", id);
    };

    let [todayDispatchJobs, setTodayDispatchJobs] = useState([])

    const getJobs = () => {
        let date = `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${new Date().getDate().toString().padStart(2, '0')}`
        var config = {
            method: 'post',
            data: {
                date: date
            },
            url: `${process.env.REACT_APP_BACKEND_URL}/todayDispathed`,
        };

        axios(config)
            .then((res) => {
                setTodayDispatchJobs(res.data.filter(a => !a.checkedOut))
            })
    }

    useEffect(() => {
        props.socket.on("standing", (data) => {
            // console.log(data)
        });
    }, [props.socket]);

    return (
        <aside>
            <div>
                <Select
                    size='large'
                    defaultValue="New Leads"
                    style={{ width: "100%" }}
                    onChange={handleChange}
                    options={[
                        {
                            value: 'New Leads',
                            label: 'New Leads',
                        },
                        {
                            value: 'Follow Ups',
                            label: 'Follow Ups',
                        },
                        {
                            value: 'Dispatch Calls',
                            label: 'Dispatch Calls',
                        },
                        {
                            value: 'Feedback',
                            label: 'Feedback',
                        },
                    ]}
                />
            </div>
            <div class="sidebar left sidebarCalls">

                {selectedType === "New Leads" && newJobs.map((a, i) => {
                    return (
                        !a.followUpDate &&
                        <div onClick={() => {
                            props.socket.emit("check_standing", { room: "abc", _id: a._id });
                            props.setSelectedItem(a)
                        }} style={{ backgroundColor: selectedItem._id === a._id ? 'lightgray' : "white" }} key={i} className='callBoxes'>
                            <p><b>Name: </b>{a.customerName}</p>
                            <p><b>Address: </b>{a.address}</p>
                            <p><b>Service: </b>{a.service}</p>
                            <p><b>description: </b>{a.description}</p>
                        </div>
                    )
                })}

                {selectedType === "Follow Ups" && newJobs.map((a, i) => {
                    return (
                        a.followUpDate &&
                        <div onClick={() => {
                            props.socket.emit("check_standing", { room: "abc", _id: a._id });
                            props.setSelectedItem(a)
                        }} style={{ backgroundColor: selectedItem._id === a._id ? 'lightgray' : "white" }} key={i} className='callBoxes'>
                            <p><b>Name: </b>{a.customerName}</p>
                            <p><b>Address: </b>{a.address}</p>
                            <p><b>Service: </b>{a.service}</p>
                            <p><b>description: </b>{a.description}</p>
                        </div>
                    )
                })}

                {selectedType === "Dispatch Calls" && todayDispatchJobs.map((a, i) => {
                    return (
                        <div onClick={() => {
                            props.socket.emit("check_standing", { room: "abc", _id: a._id });
                            props.setSelectedItem(a)
                        }} style={{ backgroundColor: selectedItem._id === a._id ? 'lightgray' : "white" }} key={i} className='callBoxes'>
                            <p><b>Name: </b>{a.customerName}</p>
                            <p><b>Address: </b>{a.address}</p>
                            <p><b>Service: </b>{a.service}</p>
                            <p><b>description: </b>{a.description}</p>
                        </div>
                    )
                })}

            </div>
        </aside>
    );
}