import { io } from 'socket.io-client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DatePicker, Select, Table } from 'antd';
import { CSVLink } from "react-csv";

const { RangePicker } = DatePicker;

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

function ReceivableReports(props) {

    let [date1, setDate1] = useState(new Date())
    let [date2, setDate2] = useState(new Date())
    let [cat, setCat] = useState("")
    let [status, setStatus] = useState("")
    let [worker, setWorker] = useState("")
    let [customer, setCustomer] = useState("")

    let [services, setServices] = useState([])
    let [customers, setCustomers] = useState([])
    let [workers, setWorkers] = useState([])
    let [jobs, setJobs] = useState([])
    let [filteredJobs, setFilteredJobs] = useState([])

    let [dataForCsv, setDataForCsv] = useState([])

    useEffect(() => {
        let dateArr = generateDateArray(date1, date2)
        if (jobs.length) {
            let jb = [...jobs]
            let jbs = jb.filter((a) => {
                return (
                    dateArr.filter((b) => b === a.dateCreated.split("T")[0]).length
                )
            })
            if (status) {
                jbs = jbs.filter((a) => {
                    return a.status === status
                })
            }
            if (cat) {
                jbs = jbs.filter((a) => {
                    return a.serviceId === cat
                })
            }
            if (customer) {
                jbs = jbs.filter((a) => {
                    return a.customerId === customer
                })
            }
            if (worker) {
                jbs = jbs.filter((a) => {
                    return a.scheduledTo === "Worker" ?
                        a.workerObj[0] && a.workerObj[0]._id === worker
                        :
                        a.scheduledTo === "Vendor" ?
                            a.vendorObj[0] && a.workerObj[0]._id === worker
                            :
                            false
                })
            }
            let dataForCsv = []
            for(let i = 0; i < jbs.length; i++){
                let obj = {...jbs[i]}
                obj.paymentReceived = obj.forAccounts[0] ? obj.forAccounts[0].paymentReceived ? obj.forAccounts[0].paymentReceived : 0 : 0
                obj.balance =  Number(obj.amount) - (Number(obj.forAccounts[0].paymentReceived) ? Number(obj.forAccounts[0].paymentReceived) : 0)
                dataForCsv.push(obj)
            }
            setDataForCsv(dataForCsv)
            setFilteredJobs(jbs)
        }
    }, [date1, date2, cat, status, customer, worker])

    function generateDateArray(startDate, endDate) {
        var dateArray = [];
        var currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
            dateArray.push(currentDate.toISOString().slice(0, 10));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    }

    const columns = [
        {
            title: 'Serial no.',
            label: 'Serial no.',
            dataIndex: 's.no',
            key: 's.no',
            render: (i, record) => (
                `${new Date(record.dateCreated).getDate()}-${new Date(record.dateCreated).getMonth() + 1}-${new Date(record.dateCreated).getFullYear()} | ${new Date(record.dateCreated).getHours()}:${new Date(record.dateCreated).getMinutes()}:${new Date(record.dateCreated).getSeconds()}`
            ),
        },
        {
            title: 'Date',
            label: 'Date',
            dataIndex: 'dateCreated',
            key: 'dateCreated',
            render: (i, record) => (
                i + 1
            ),
        },
        {
            title: 'Lead no.',
            label: 'Lead no.',
            dataIndex: 'leadNo',
            key: 'leadNo',
        },
        {
            title: 'Client name',
            label: 'Client name',
            dataIndex: 'customerName',
            key: 'customerName',
        },
        {
            title: 'Category',
            label: 'Category',
            dataIndex: 'service',
            key: 'service',
        },
        {
            title: 'Description',
            label: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Amount',
            label: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Discounts',
            label: 'Discounts',
            dataIndex: 'discount',
            key: 'discount',
        },
        {
            title: 'Received Amount',
            label: 'Received Amount',
            dataIndex: 'address',
            key: "paymentReceived",
            render: (i, record) => (
                record.forAccounts[0] ? record.forAccounts[0].paymentReceived ? record.forAccounts[0].paymentReceived : 0 : 0
            ),
        },
        {
            title: 'Balance',
            label: 'Balance',
            dataIndex: 'address',
            key: "balance",
            render: (i, record) => (
                record.forAccounts[0] ?
                    Number(record.amount) - (Number(record.forAccounts[0].paymentReceived) ? Number(record.forAccounts[0].paymentReceived) : 0) : 0
            ),
        }
    ];

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York Park',
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 40,
            address: 'London Park',
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
                setJobs(res.data.filter(a => a.forAccounts[0]))
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

    const getCustomers = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/customer`,
            // url: 'http://localhost:5000/api/service'
        };

        axios(config)
            .then((res) => {
                setCustomers(res.data)
            })
    }

    const getWorkers = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/worker`,
            // url: 'http://localhost:5000/api/service'
        };

        axios(config)
            .then((res) => {
                setWorkers(res.data)
            })
    }

    useEffect(() => {
        getServices()
        getJobs()
        getCustomers()
        getWorkers()
    }, [])

    return (
        <div className='reportInner p-3'>
            <h2>{props.name.split("-").join(" ")}</h2>
            <div className='filterDiv card p-3 mb-3'>
                <div className='row justiy-content-between align-items-center'>
                    <div className='col-6'>
                        <h6>Filters</h6>
                    </div>
                    <div className='col-6 text-right'>
                        <CSVLink filename={props.name.split("-").join(" ")} className='csvLink' data={dataForCsv} headers={columns}>Export to CSV</CSVLink>
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
                    <div className='col-3 d-flex flex-column'>
                        <label>Job Status</label>
                        <Select
                            size="middle"
                            style={{ width: "100%" }}
                            onChange={(e) => setStatus(e)}
                        >
                            <option value="New">New</option>
                            <option value="Not Responded">Not Responded</option>
                            <option value="Only Info">Only Info</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="On Hold">On Hold</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Fake">Fake</option>
                        </Select>
                    </div>
                    <div className='col-3 d-flex flex-column'>
                        <label>Customer</label>
                        <Select
                            size="middle"
                            style={{ width: "100%" }}
                            onChange={(e) => setCustomer(e)}
                        >
                            {customers.map((a, i) => {
                                return (
                                    <option value={a._id}>{a.name} &nbsp; ({a.phone})</option>
                                )
                            })}
                        </Select>
                    </div>
                    <div className='col-3 d-flex flex-column'>
                        <label>Worker / Vendor</label>
                        <Select
                            size="middle"
                            style={{ width: "100%" }}
                            onChange={(e) => setWorker(e)}
                        >
                            {workers.map((a, i) => {
                                return (
                                    <option value={a._id}>{a.name} ({a.workerOrVendor})</option>
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

export default ReceivableReports;