import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
const data = [
    {
        id: '1',
        name: 'John Brown',
        contact: '03102812051',
        email: "alisheeraz0007@gmail.com",
        type: "Admin",
        cost: 3500,
    },
    {
        id: '2',
        name: 'Joe Black',
        contact: '03102812051',
        email: "alisheeraz0007@gmail.com",
        type: "Operation Depart",
        cost: 3500,
    },
    {
        id: '3',
        name: 'Jim Green',
        contact: '03102812051',
        email: "alisheeraz0007@gmail.com",
        type: "Call Center",
        cost: 3500,
    },
    {
        id: '4',
        name: 'Jim Red',
        contact: '03102812051',
        email: "alisheeraz0007@gmail.com",
        type: "Finance",
        cost: 3500,
    },
    {
        id: '1',
        name: 'John Brown',
        contact: '03102812051',
        email: "alisheeraz0007@gmail.com",
        type: "Operation Depart",
        cost: 3500,
    },

];

export default function Vendors() {
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

    let [vendors, setVendors] = useState([])

    const getVendors = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/vendor`,
            // url: 'http://localhost:5000/api/jobs'
        };

        axios(config)
            .then((res) => {
                console.log(res)
                setVendors(res.data)
            })
    }

    useEffect(() => {
        getVendors()
    }, [])

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const showModal = (record) => {
        if (record.name) {
            setIsModalOpen(true);
        } else {
            setIsModalOpen(true);
        }
    };

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
            title: 'Id',
            dataIndex: 'id',
            key: 'id',
            width: '8%',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Vendor Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Contact',
            dataIndex: 'contact',
            key: 'contact',
            width: '15%',
            ...getColumnSearchProps('contact'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Vendor Type',
            dataIndex: 'type',
            key: 'type',
            width: '20%',
            sorter: (a, b) => a.type.localeCompare(b.type),
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (_, record) => (
                <Space size="middle">
                    <i style={{ fontSize: 20, cursor: "pointer" }} class="fa fa-pencil" aria-hidden="true"></i>
                </Space>
            ),
        },
    ];
    return (
        <>
            <div className='d-flex justify-content-between w-100'>
                <h3>Vendors</h3>
                <Button type="primary">Add Vendors</Button>
            </div>
            <Table pagination={{ pageSize: 5 }} columns={columns} dataSource={vendors} />
        </>
    );
};