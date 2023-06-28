import { io } from 'socket.io-client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DatePicker, Select, Table } from 'antd';

const { RangePicker } = DatePicker;

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

function SalesSummarySubCatWise(props) {

  
    let [services, setServices] = useState([])
    let [date1, setDate1] = useState(new Date())
    let [date2, setDate2] = useState(new Date())

    let [jobs, setJobs] = useState([])
    let [filteredJobs, setFilteredJobs] = useState([])

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
            url: `${process.env.REACT_APP_BACKEND_URL}/api/subservice`,
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
            console.log(filteredJobs)
            setFilteredJobs(jbs)
        }
    }, [date1, date2])

    function generateDateArray(startDate, endDate) {
        var dateArray = [];
        var currentDate = new Date(startDate);

        while (currentDate <= new Date(endDate)) {
            dateArray.push(currentDate.toISOString().slice(0, 10));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    }

    const calc = (a, name) => {
        let jbs = [...filteredJobs]
        let obj = {
            total: 0,
            amount: 0,
            discount: 0,
            outsource: 0,
            net: 0,
            material: 0,
            fuel: 0,
            card: 0,
            gas: 0,
            workshop: 0,
            machinery: 0
        }
        for (let i = 0; i < jbs.length; i++) {
            if (jbs[i].subServiceId === a._id) {
                obj.total += 1
                obj.amount += Number(jbs[i].amount)
                obj.discount += Number(jbs[i].discount) ? Number(jbs[i].discount) : 0
                obj.outsource += jbs[i].forAccounts[0] && Number(jbs[i].forAccounts[0].outsourcePaid) ? Number(jbs[i].forAccounts[0].outsourcePaid) : 0
                obj.material += jbs[i].forAccounts[0] && Number(jbs[i].forAccounts[0].material) ? Number(jbs[i].forAccounts[0].material) : 0
                obj.fuel += jbs[i].forAccounts[0] && Number(jbs[i].forAccounts[0].fuelTransportation) ? Number(jbs[i].forAccounts[0].fuelTransportation) : 0
                obj.card += jbs[i].forAccounts[0] && Number(jbs[i].forAccounts[0].cardRepair) ? Number(jbs[i].forAccounts[0].cardRepair) : 0
                obj.gas += jbs[i].forAccounts[0] && Number(jbs[i].forAccounts[0].gasRefill) ? Number(jbs[i].forAccounts[0].gasRefill) : 0
                obj.workshop += jbs[i].forAccounts[0] && Number(jbs[i].forAccounts[0].workshopCharges) ? Number(jbs[i].forAccounts[0].workshopCharges) : 0
                obj.machinery += jbs[i].forAccounts[0] && Number(jbs[i].forAccounts[0].machineryRent) ? Number(jbs[i].forAccounts[0].machineryRent) : 0
            }
        }
        return obj
    }

    return (
        <div className='reportInner p-3'>
            <h2>{props.name.split("-").join(" ")}</h2>
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
                </div>
            </div>

            <div className='catWiseDiv'>
                <table className='catWiseTable'>
                    <tr className="heads">
                        <th>Sub Services </th>
                        <th>Total Jobs</th>
                        <th>Amount</th>
                        <th>Discount</th>
                        <th>Outsources</th>
                        <th>Net sales</th>
                        <th>Material Cost</th>
                        <th>Fuel Transportation</th>
                        <th>Card Repair</th>
                        <th>Gas Refill</th>
                        <th>Workshop Charges</th>
                        <th>Machinery Rent</th>
                    </tr>
                    {services.length && services.map((a, i) => {
                        return (
                            <tr key={i}>
                                <th>{a.name}</th>
                                <td>{calc(a).total}</td>
                                <td>{calc(a).amount}</td>
                                <td>{calc(a).discount}</td>
                                <td>{calc(a).outsource}</td>
                                <td>{calc(a).amount - calc(a).outsource}</td>
                                <td>{calc(a).material}</td>
                                <td>{calc(a).fuel}</td>
                                <td>{calc(a).card}</td>
                                <td>{calc(a).gas}</td>
                                <td>{calc(a).workshop}</td>
                                <td>{calc(a).machinery}</td>
                            </tr>
                        )
                    })}
                </table>
            </div>
        </div>
    );
}

export default SalesSummarySubCatWise;