import { io } from 'socket.io-client'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { DatePicker, Select, Table } from 'antd';

const { RangePicker } = DatePicker;

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

function CallReports(props) {

    const columns = [
        {
            title: 'Lead No',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Job Id',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Customer Name',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Customer Number',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Form Name',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Date Created',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Status',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Source',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Service',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Amount',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Description',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'City',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Residence Type',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Nearest Landmark',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Zone',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Schedule Date',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Schedule To',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Assign Worker',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Helpers',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Slots',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'CRM user notes',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Worker notes',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Checked In Date',
            dataIndex: 'address',
            key: '8',
        },
        {
            title: 'Checked Out Date',
            dataIndex: 'address',
            key: '8',
        }
    ];
    const data = [
        {
            key: '1',
            name: 500,
            age: 1000,
            address: 300000000,
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

export default CallReports;