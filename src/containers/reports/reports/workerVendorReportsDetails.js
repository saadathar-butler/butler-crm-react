import { io } from 'socket.io-client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DatePicker, Select, Table } from 'antd';

const { RangePicker } = DatePicker;

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

function WorkerVendorReportsDetail(props) {

    const columns = [
        {
            title: 'Serial no.',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Date',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Lead no',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Client name',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Category',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Description',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Helper name',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Time Slot',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Checkin Date and time ',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Checkout date and time',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Job Duration',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'worker/vendor user note',
            dataIndex: 'address',
            key: '8',
        }
    ];
    const data = [
        {
            key: '1',
            name: 500,
            age: 1000,
            address: 3000,
        },
    ];

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

            <Table
                columns={columns}
                dataSource={data}
                scroll={{
                    x: 1300,
                }}
            />
        </div>
    );
}

export default WorkerVendorReportsDetail;