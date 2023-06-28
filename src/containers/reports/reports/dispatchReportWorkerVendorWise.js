import { io } from 'socket.io-client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DatePicker, Select, Table } from 'antd';

const { RangePicker } = DatePicker;

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

function DispatchReportsWorkerVendorWise(props) {

    return (
        <div className='reportInner p-3'>
            <h2>{props.name.split("-").join(" ")}</h2>
            <div className='filterDiv card p-3'>
                <h6>Filters</h6>
                <div className='row'>
                    <div className='col-3 flex-direction-column'>
                        <label>Select Date</label>
                        <RangePicker />
                    </div>
                    <div className='col-3 d-flex flex-column'>
                        <label>Worker / Vendor</label>
                        <Select
                            size="middle"
                            defaultValue="a1"
                            style={{ width: "100%" }}
                        >
                            <option>abc</option>
                            <option>abc</option>
                            <option>abc</option>
                            <option>abc</option>
                        </Select>
                    </div>
                </div>
            </div>

            <div className='catWiseDiv'>
                <table className='catWiseTable sumWorker'>
                    <tr className="heads">
                        <th style={{width: "40%"}}>Date (day) </th>
                        <th>Slots</th>
                    </tr>
                    <tr>
                        <th>Day 1</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Day 2</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Day 3</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Day 4</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Day 5</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Day 6</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Day 7</th>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Day 8</th>
                        <td></td>
                    </tr>
                </table>
            </div>

        </div>
    );
}

export default DispatchReportsWorkerVendorWise;