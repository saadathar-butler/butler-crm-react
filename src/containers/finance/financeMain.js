import React, { useEffect, useRef, useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Radio, Space, Switch, Table } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import Calls from '../calls/calls';
import axios from 'axios';

import { io } from 'socket.io-client'

// const socket = io('http://localhost:5000')
const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)


const data = [];

for (let i = 1; i <= 10; i++) {
    data.push({
        key: i,
        name: 'John Brown',
        age: Number(`${i}2`),
        address: `New York No. ${i} Lake Park`,
        description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
    });
}

const defaultExpandable = {
    expandedRowRender: (record) => <p>{record.description}</p>,
};
const defaultTitle = () => 'Here is title';
const defaultFooter = () => 'Here is footer';


export default function Finance() {
    const [bordered, setBordered] = useState(true);
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState('small');
    const [expandable, setExpandable] = useState(defaultExpandable);
    const [showTitle, setShowTitle] = useState(false);
    const [showHeader, setShowHeader] = useState(true);
    const [showfooter, setShowFooter] = useState(true);
    const [rowSelection, setRowSelection] = useState({});
    const [hasData, setHasData] = useState(true);
    const [tableLayout, setTableLayout] = useState(undefined);
    const [top, setTop] = useState('none');
    const [bottom, setBottom] = useState('bottomRight');
    const [ellipsis, setEllipsis] = useState(false);
    const [yScroll, setYScroll] = useState(false);
    const [xScroll, setXScroll] = useState(true);
    const handleBorderChange = (enable) => {
        setBordered(enable);
    };
    const handleLoadingChange = (enable) => {
        setLoading(enable);
    };
    const handleSizeChange = (e) => {
        setSize(e.target.value);
    };
    const handleTableLayoutChange = (e) => {
        setTableLayout(e.target.value);
    };
    const handleExpandChange = (enable) => {
        setExpandable(enable ? defaultExpandable : undefined);
    };
    const handleEllipsisChange = (enable) => {
        setEllipsis(enable);
    };
    const handleTitleChange = (enable) => {
        setShowTitle(enable);
    };
    const handleHeaderChange = (enable) => {
        setShowHeader(enable);
    };
    const handleFooterChange = (enable) => {
        setShowFooter(enable);
    };
    const handleRowSelectionChange = (enable) => {
        setRowSelection(enable ? {} : undefined);
    };
    const handleYScrollChange = (enable) => {
        setYScroll(enable);
    };
    const handleXScrollChange = (e) => {
        setXScroll(e.target.value);
    };
    const handleDataChange = (newHasData) => {
        setHasData(newHasData);
    };
    const scroll = {};
    if (yScroll) {
        scroll.y = 240;
    }
    if (xScroll) {
        scroll.x = '130vw';
    }

    if (xScroll === 'fixed') {
        tableColumns[0].fixed = true;
        tableColumns[tableColumns.length - 1].fixed = 'right';
    }
    const tableProps = {
        bordered,
        loading,
        size,
        scroll,
    };

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    let [activeUser, setActiveUser] = useState("")

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        setActiveUser(user)
    }, [])

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns = [
        {
            title: 'Lead No.',
            dataIndex: 'leadNo',
            width: "100px",
            ...getColumnSearchProps('leadNo'),
        },
        {
            title: 'Job Id.',
            dataIndex: 'jobId',
            width: "100px",
            ...getColumnSearchProps('jobId'),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            filters: [
                {
                    text: 'New',
                    value: 'New',
                },
                {
                    text: 'Not Responded',
                    value: 'Not Responded',
                },
                {
                    text: 'Only Info',
                    value: 'Only Info',
                },
                {
                    text: 'Scheduled',
                    value: 'Scheduled',
                },
                {
                    text: 'In Progress',
                    value: 'In Progress',
                },
                {
                    text: 'Cancelled',
                    value: 'Cancelled',
                },
                {
                    text: 'Rejected',
                    value: 'Rejected',
                },
                {
                    text: 'Fake',
                    value: 'Fake',
                },
            ],
            onFilter: (value, record) => record.status.indexOf(value) === 0,
            width: "100px",
        },
        {
            title: 'Customer Name',
            dataIndex: 'customerName',
            width: "150px",
            ...getColumnSearchProps('customerName'),
        },
        {
            title: 'Customer Phone',
            dataIndex: 'customerPhone',
            width: "150px",
            ...getColumnSearchProps('customerPhone'),
        },
        {
            title: 'Service',
            dataIndex: 'service',
            width: "200px",
            ...getColumnSearchProps('service'),
            render: (i, record) => (
                record.service
            ),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            width: "200px",
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Date created',
            dataIndex: 'dateCreated',
            width: "200px",
            ...getColumnSearchProps('dateCreated'),
            render: (i, record) => (
                `${new Date(record.dateCreated).getDate()}-${new Date(record.dateCreated).getMonth() + 1}-${new Date(record.dateCreated).getFullYear()} | ${new Date(record.dateCreated).getHours()}:${new Date(record.dateCreated).getMinutes()}:${new Date(record.dateCreated).getSeconds()}`
            ),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            width: "200px",
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            width: "100px",
            ...getColumnSearchProps('amount'),
        },
        {
            title: 'Nearest Landmark',
            dataIndex: 'nearestLandmark',
            width: "150px",
        },
        {
            title: 'Action',
            key: 'action',
            sorter: true,
            width: "50px",
            fixed: 'right',
            render: (record) => (
                activeUser && activeUser.permissions[0].financeEdit &&
                <Space style={{ width: "100%", textAlign: "center", display: "flex", justifyContent: "center" }} size="middle">
                    <i onClick={() => showModal(record)} style={{ fontSize: 20, cursor: "pointer" }} class="fa fa-pencil" aria-hidden="true"></i>
                </Space>
            ),
        },
    ];

    const tableColumns = columns.map((item) => ({
        ...item,
        ellipsis,
    }));

    let [jobs, setJobs] = useState([])
    let [completedJobs, setCompletedJobs] = useState([])
    let [editObj, setEditObj] = useState("")

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModal = (record) => {
        if (record.jobId) {
            setEditObj(record)
            setIsModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

    useEffect(() => {
        getJobs()
    }, [])

    const getJobs = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/jobs`,
            // url: 'http://localhost:5000/api/jobs',
        };

        axios(config)
            .then((res) => {
                let dataa = res.data.filter((a) => a.checkedOut)
                let sortedData = dataa.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())
                let arr = sortedData.filter(a => !a.completed)
                let arr2 = sortedData.filter(a => a.completed)
                setJobs(arr)
                setCompletedJobs(arr2)
            })
    }

    useEffect(() => {
        joinRoom({ roomname: "abc" })
    }, [])

    const joinRoom = (id) => {
        socket.emit("join_room", id);
    };

    useEffect(() => {
        socket.on("getLatest", (data) => {
            // console.log(data)
            getJobs()
        });
    }, [socket]);

    let [selectedTab, setSelectedTab] = useState("Receivables")


    return (
        <div className='mt-3 p-3'>
            <div className='w-100'>
                <h3 className='mb-4'>All {selectedTab} Jobs</h3>
                <ul class="nav nav-tabs">
                    <li onClick={() => setSelectedTab("Receivables")} style={{ cursor: "pointer" }} class="nav-item">
                        <a class={`nav-link ${selectedTab === "Receivables" && "active"}`}>Receivables</a>
                    </li>
                    <li onClick={() => setSelectedTab("Completed")} style={{ cursor: "pointer" }} class="nav-item">
                        <a class={`nav-link ${selectedTab === "Completed" && "active"}`}>Completed</a>
                    </li>
                </ul>
            </div>
            <Table
                {...tableProps}
                pagination={{
                    position: [top, bottom],
                }}
                columns={tableColumns}
                dataSource={selectedTab === "Receivables" ? jobs : completedJobs}
                scroll={scroll}
            />

            <Modal
                style={{ top: 20 }}
                width={"100%"}
                title={"Add New Lead"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[

                ]}
            >

                <Calls fromFinance={true} setEditObj={setEditObj} getJobs={getJobs} editObj={editObj} handleCancel={handleCancel} fromLeads={true} />

            </Modal>

        </div>
    );
};