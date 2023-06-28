import { Modal } from "antd";
import axios from "axios";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Calls from "../calls/calls";
import './dispatch.scss'

// const socket = io('http://localhost:5000')
const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)


export default function Dispatch(props) {

    let [workers, setWorkers] = useState([])
    let [vendors, setVendors] = useState([])
    let [jobs, setJobs] = useState([])

    const getWorkers = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/worker`,
            // url: 'http://localhost:5000/api/worker'
        };

        axios(config)
            .then((res) => {
                let arr = res.data.filter((a) => a.isActive && a.workerOrVendor === "Worker")
                let arr2 = res.data.filter((a) => a.isActive && a.workerOrVendor === "Vendor")
                setWorkers(arr)
                setVendors(arr2)
            })
    }

    const getjobs = (date) => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/jobs`,
            // url: 'http://localhost:5000/api/jobs'
        };

        axios(config)
            .then((res) => {
                // console.log(res.data)
                if(date){
                    let data = res.data.filter((a) => `${new Date(a.scheduledDate).getDate()}${new Date(a.scheduledDate).getMonth()}${new Date(a.scheduledDate).getFullYear()}` === `${new Date(date).getDate()}${new Date(date).getMonth()}${new Date(date).getFullYear()}`)
                    setJobs(data)
                }else{
                    let data = res.data.filter((a) => `${new Date(a.scheduledDate).getDate()}${new Date(a.scheduledDate).getMonth()}${new Date(a.scheduledDate).getFullYear()}` === `${new Date().getDate()}${new Date().getMonth()}${new Date().getFullYear()}`)
                    setJobs(data)
                }
            })
    }

    useEffect(() => {
        getWorkers()
        getjobs()
    }, [])

    useEffect(() => {
        // console.log(jobs)
    }, [jobs])

    const [isModalOpen, setIsModalOpen] = useState(false);
    let [editObj, setEditObj] = useState("")

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        joinRoom({ roomname: "abc" })
    }, [])

    const joinRoom = (id) => {
        socket.emit("join_room", id);
    };

    useEffect(() => {
        socket.on("receive_message", (data) => {
            getjobs()
        });

    }, [socket]);

    return (
        <>
        <div className="dispatchMain">
            <div className="headers">
                <div className="slots">
                    <div className="slot">Workers</div>
                    <div className="slot">11am - 12pm</div>
                    <div className="slot">12pm - 01pm</div>
                    <div className="slot">01pm - 02pm</div>
                    <div className="slot">02pm - 03pm</div>
                    <div className="slot">03pm - 04pm</div>
                    <div className="slot">04pm - 05pm</div>
                    <div className="slot">05pm - 06pm</div>
                    <div className="slot">06pm - 07pm</div>
                    <div className="slot">07pm - 08pm</div>
                    <div className="slot">08pm - 09pm</div>
                    <div className="slot">09pm - 10pm</div>
                    <div className="slot">10pm - 11pm</div>
                </div>
            </div>

            <div className="d-flex">
                <div className="sideHeaders">
                    {workers.map((a, i) => {
                        return (
                            <div className="jobsMain">
                                <div key={i} className="worker">{a.name}</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("11am - 12pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("11am - 12pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("11am - 12pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("11am - 12pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("12pm - 01pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("12pm - 01pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("12pm - 01pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("12pm - 01pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("01pm - 02pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("01pm - 02pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("01pm - 02pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("01pm - 02pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("02pm - 03pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("02pm - 03pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("02pm - 03pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("02pm - 03pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("03pm - 04pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("03pm - 04pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("03pm - 04pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("03pm - 04pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("04pm - 05pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("04pm - 05pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("04pm - 05pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("04pm - 05pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("05pm - 06pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("05pm - 06pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("05pm - 06pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("05pm - 06pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("06pm - 07pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("06pm - 07pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("06pm - 07pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("06pm - 07pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("07pm - 08pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("07pm - 08pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("07pm - 08pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("07pm - 08pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("08pm - 09pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("08pm - 09pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("08pm - 09pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("08pm - 09pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("09pm - 10pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("09pm - 10pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("09pm - 10pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("09pm - 10pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("10pm - 11pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("10pm - 11pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("10pm - 11pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.workerObj[0] && b.workerObj[0]._id).filter((c) => c.workerObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("10pm - 11pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Modal
                style={{ top: 20 }}
                width={"100%"}
                title={"Edit"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[

                ]}
            >

                <Calls setEditObj={setEditObj} getJobs={getjobs} editObj={editObj} handleCancel={handleCancel} fromLeads={true} />

            </Modal>
        </div>

        <div className="dispatchMain">
            <div className="headers">
                <div className="slots">
                    <div className="slot">Vendors</div>
                    <div className="slot">11am - 12pm</div>
                    <div className="slot">12pm - 01pm</div>
                    <div className="slot">01pm - 02pm</div>
                    <div className="slot">02pm - 03pm</div>
                    <div className="slot">03pm - 04pm</div>
                    <div className="slot">04pm - 05pm</div>
                    <div className="slot">05pm - 06pm</div>
                    <div className="slot">06pm - 07pm</div>
                    <div className="slot">07pm - 08pm</div>
                    <div className="slot">08pm - 09pm</div>
                    <div className="slot">09pm - 10pm</div>
                    <div className="slot">10pm - 11pm</div>
                </div>
            </div>

            <div className="d-flex">
                <div className="sideHeaders">
                    {vendors.map((a, i) => {
                        return (
                            <div className="jobsMain">
                                <div key={i} className="worker">{a.name}</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("11am - 12pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("11am - 12pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("11am - 12pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("11am - 12pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("12pm - 01pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("12pm - 01pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("12pm - 01pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("12pm - 01pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("01pm - 02pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("01pm - 02pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("01pm - 02pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("01pm - 02pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("02pm - 03pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("02pm - 03pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("02pm - 03pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("02pm - 03pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("03pm - 04pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("03pm - 04pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("03pm - 04pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("03pm - 04pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("04pm - 05pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("04pm - 05pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("04pm - 05pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("04pm - 05pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("05pm - 06pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("05pm - 06pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("05pm - 06pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("05pm - 06pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("06pm - 07pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("06pm - 07pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("06pm - 07pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("06pm - 07pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("07pm - 08pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("07pm - 08pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("07pm - 08pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("07pm - 08pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("08pm - 09pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("08pm - 09pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("08pm - 09pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("08pm - 09pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("09pm - 10pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("09pm - 10pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("09pm - 10pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("09pm - 10pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                                <div className="job">{
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0] &&
                                    jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("10pm - 11pm"))[0] &&
                                    <div onClick={() => {
                                        setEditObj(jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("10pm - 11pm"))[0])
                                        setIsModalOpen(true)
                                    }} className={`${jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                        !jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                        "green"
                                        :
                                        jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedIn &&
                                            jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id)[0].checkedOut ?
                                            "blue"
                                            :
                                            "gray"
                                        } 
                                    bgColor`}>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("10pm - 11pm"))[0].customerName}
                                        </div>
                                        <div>
                                            {jobs.filter((b) => b.vendorObj[0] && b.vendorObj[0]._id).filter((c) => c.vendorObj[0]._id === a._id).filter((d) => d.slot.join(" ").match("10pm - 11pm"))[0].service}
                                        </div>
                                    </div>
                                }</div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <Modal
                style={{ top: 20 }}
                width={"100%"}
                title={"Edit"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[

                ]}
            >

                <Calls setEditObj={setEditObj} getJobs={getjobs} editObj={editObj} handleCancel={handleCancel} fromLeads={true} />

            </Modal>
        </div>
        </>
    );
}