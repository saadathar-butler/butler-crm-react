import { io } from 'socket.io-client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DatePicker, Select, Table } from 'antd';
import { CSVLink } from "react-csv";

const { RangePicker } = DatePicker;

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

function ExpenseReportsDetails(props) {

    let [services, setServices] = useState([])
    let [date1, setDate1] = useState(new Date())
    let [date2, setDate2] = useState(new Date())
    let [cat, setCat] = useState("")

    let [jobs, setJobs] = useState([])
    let [filteredJobs, setFilteredJobs] = useState([])

    let [dataForCsv, setDataForCsv] = useState([])

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
            key: '7',
            render: (i, record) => (
                record.forAccounts[0] ? record.forAccounts[0].paymentReceived : 0
            ),
        },
        {
            title: 'Material Cost',
            label: 'Material Cost',
            dataIndex: 'address',
            key: '8',
            render: (i, record) => (
                record.forAccounts[0] ? record.forAccounts[0].material : 0
            ),
        },
        {
            title: 'Outsource Paid',
            label: 'Outsource Paid',
            dataIndex: 'address',
            key: '8',
            render: (i, record) => (
                record.forAccounts[0] ? record.forAccounts[0].outsourcePaid : 0
            ),
        },
        {
            title: 'Fuel Transportation',
            label: 'Fuel Transportation',
            dataIndex: 'address',
            key: '8',
            render: (i, record) => (
                record.forAccounts[0] ? record.forAccounts[0].fuelTransportation : 0
            ),
        },
        {
            title: 'Card Repair',
            label: 'Card Repair',
            dataIndex: 'address',
            key: '8',
            render: (i, record) => (
                record.forAccounts[0] ? record.forAccounts[0].cardRepair : 0
            ),
        },
        {
            title: 'Gas Refill',
            label: 'Gas Refill',
            dataIndex: 'address',
            key: '8',
            render: (i, record) => (
                record.forAccounts[0] ? record.forAccounts[0].gasRefill : 0
            ),
        },
        {
            title: 'Workshop Charges',
            label: 'Workshop Charges',
            dataIndex: 'address',
            key: '8',
            render: (i, record) => (
                record.forAccounts[0] ? record.forAccounts[0].workshopCharges : 0
            ),
        },
        {
            title: 'Machinery Rent',
            label: 'Machinery Rent',
            dataIndex: 'address',
            key: '8',
            render: (i, record) => (
                record.forAccounts[0] ? record.forAccounts[0].machineryRent : 0
            ),
        },
        {
            title: 'Payment mode',
            label: 'Payment mode',
            dataIndex: 'address',
            key: '8',
            render: (i, record) => (
                record.forAccounts[0] ? record.forAccounts[0].paymentMode : 0
            ),
        },
        {
            title: 'Status',
            label: 'Status',
            dataIndex: 'status',
            key: '8',
        }
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

            let dataForCsv = []
            for (let i = 0; i < jbs.length; i++) {
                let obj = { ...jbs[i] }
                obj.paymentReceived = obj.forAccounts[0] ? obj.forAccounts[0].paymentReceived : 0
                obj.material = obj.forAccounts[0] ? obj.forAccounts[0].material : 0
                obj.outsourcePaid = obj.forAccounts[0] ? obj.forAccounts[0].outsourcePaid : 0
                obj.fuelTransportation = obj.forAccounts[0] ? obj.forAccounts[0].fuelTransportation : 0
                obj.cardRepair = obj.forAccounts[0] ? obj.forAccounts[0].cardRepair : 0
                obj.gasRefill = obj.forAccounts[0] ? obj.forAccounts[0].gasRefill : 0
                obj.workshopCharges = obj.forAccounts[0] ? obj.forAccounts[0].workshopCharges : 0
                obj.machineryRent = obj.forAccounts[0] ? obj.forAccounts[0].machineryRent : 0
                obj.paymentMode = obj.forAccounts[0] ? obj.forAccounts[0].paymentMode : 0
                dataForCsv.push(obj)
            }
            setDataForCsv(dataForCsv)

            setFilteredJobs(jbs)
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
            <div className='row justiy-content-between align-items-center'>
                <div className='col-6'>
                    <h6>Filters</h6>
                </div>
                <div className='col-6 text-right'>
                    <CSVLink filename={props.name.split("-").join(" ")} className='csvLink' data={dataForCsv} headers={columns}>Export to CSV</CSVLink>
                </div>
            </div>
            <div className='filterDiv card p-3'>
                <h6>Filters</h6>
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
                    x: 3000,
                }}
            />
        </div>
    );
}

export default ExpenseReportsDetails;