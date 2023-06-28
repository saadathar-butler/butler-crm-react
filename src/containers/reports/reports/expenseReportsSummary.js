import { io } from 'socket.io-client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DatePicker, Select, Table } from 'antd';
import { CSVLink } from 'react-csv';

const { RangePicker } = DatePicker;

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

function ExpenseReportsSummary(props) {

    let [services, setServices] = useState([])
    let [date1, setDate1] = useState(new Date())
    let [date2, setDate2] = useState(new Date())
    let [cat, setCat] = useState("")

    let [jobs, setJobs] = useState([])
    let [filteredJobs, setFilteredJobs] = useState([])

    let [dataForCsv, setDataForCsv] = useState([])

    const columns = [
        {
            title: 'Material Cost',
            label: "material",
            dataIndex: 'material',
            key: "material",
        },
        {
            title: 'Outsource Paid',
            label: "outsourcePaid",
            dataIndex: 'outsourcePaid',
            key: "outsourcePaid",
        },
        {
            title: 'Fuel Transportation',
            label: "fuelTransportation",
            dataIndex: 'fuelTransportation',
            key: "fuelTransportation",
        },
        {
            title: 'Card Repair',
            label: "cardRepair",
            dataIndex: 'cardRepair',
            key: "cardRepair",
        },
        {
            title: 'Gas Refill',
            label: "gasRefill",
            dataIndex: 'gasRefill',
            key: "gasRefill",
        },
        {
            title: 'Workshop Charges',
            label: "workshopCharges",
            dataIndex: 'workshopCharges',
            key: "workshopCharges",
        },
        {
            title: 'Machinery Rent',
            label: "machineryRent",
            dataIndex: 'machineryRent',
            key: "machineryRent",
        },
    ];

    const getJobs = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/jobs`,
            // url: 'http://localhost:5000/api/jobs'
        };

        axios(config)
            .then((res) => {
                setJobs(res.data)
            })
    }

    const getServices = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/service`,
            // url: 'http://localhost:5000/api/service'
        };

        axios(config)
            .then((res) => {
                setServices(res.data)
            })
    }

    useEffect(() => {
        getServices()
        getJobs()
    }, [])

    useEffect(() => {
        let dateArr = generateDateArray(date1, date2)
        if (jobs.length) {
            let jb = [...jobs]
            let jbs = jb.filter((a) => {
                return (
                    dateArr.filter((b) => b === a.dateCreated.split("T")[0]).length
                )
            })
            if (cat) {
                jbs = jbs.filter((a) => {
                    return a.serviceId === cat
                })
            }
            let arr = [
                {
                    material: 0,
                    outsourcePaid: 0,
                    fuelTransportation: 0,
                    cardRepair: 0,
                    gasRefill: 0,
                    workshopCharges: 0,
                    machineryRent: 0
                }
            ]
            for (let i = 0; i < jbs.length; i++) {
                if (jbs[i].forAccounts[0]) {
                    if (Number(jbs[i].forAccounts[0].material)) {
                        arr[0].material = arr[0].material + jbs[i].forAccounts[0].material
                    }
                    if (Number(jbs[i].forAccounts[0].outsourcePaid)) {
                        arr[0].outsourcePaid = arr[0].outsourcePaid + jbs[i].forAccounts[0].outsourcePaid
                    }
                    if (Number(jbs[i].forAccounts[0].fuelTransportation)) {
                        arr[0].fuelTransportation = arr[0].fuelTransportation + jbs[i].forAccounts[0].fuelTransportation
                    }
                    if (Number(jbs[i].forAccounts[0].cardRepair)) {
                        arr[0].cardRepair = arr[0].cardRepair + jbs[i].forAccounts[0].cardRepair
                    }
                    if (Number(jbs[i].forAccounts[0].gasRefill)) {
                        arr[0].gasRefill = arr[0].gasRefill + jbs[i].forAccounts[0].gasRefill
                    }
                    if (Number(jbs[i].forAccounts[0].workshopCharges)) {
                        arr[0].workshopCharges = arr[0].workshopCharges + jbs[i].forAccounts[0].workshopCharges
                    }
                    if (Number(jbs[i].forAccounts[0].machineryRent)) {
                        arr[0].machineryRent = arr[0].machineryRent + jbs[i].forAccounts[0].machineryRent
                    }
                }
            }
            setFilteredJobs(arr)
        }
    }, [date1, date2, cat])

    function generateDateArray(startDate, endDate) {
        var dateArray = [];
        var currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
            dateArray.push(currentDate.toISOString().slice(0, 10));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    }

    return (
        <div className='reportInner p-3'>
            <h2>{props.name.split("-").join(" ")}</h2>
            <div className='filterDiv card p-3'>
                <div className='row justiy-content-between align-items-center'>
                    <div className='col-6'>
                        <h6>Filters</h6>
                    </div>
                    <div className='col-6 text-right'>
                        <CSVLink filename={props.name.split("-").join(" ")} className='csvLink' data={filteredJobs} headers={columns}>Export to CSV</CSVLink>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-3 flex-direction-column'>
                        <label>Select Date</label>
                        <RangePicker onChange={(e) => {
                            setDate1(e[0].$d)
                            setDate2(e[1].$d)
                        }} />
                    </div>
                    <div className='col-3 d-flex flex-column'>
                        <label>Category</label>
                        <Select
                            size="middle"
                            style={{ width: "100%" }}
                            onChange={(e) => setCat(e)}
                        >
                            {services.map((a, i) => {
                                return (
                                    <option value={a._id}>{a.name}</option>
                                )
                            })}
                        </Select>
                    </div>
                </div>
            </div>

            <Table
                columns={columns}
                dataSource={filteredJobs}
                scroll={{
                    x: 1300,
                }}
            />
        </div>
    );
}

export default ExpenseReportsSummary;