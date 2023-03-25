import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
const data = [
    {
        id: '1',
        name: 'John Brown',
        contact: '03102812051',
        email: "alisheeraz0007@gmail.com",
        address: "A-202 SALMA RESIDENCY DEFENCE VIEW PHASE 2",
        cost: 3500,
    },
    {
        id: '2',
        name: 'Joe Black',
        contact: '03102812051',
        email: "alisheeraz0007@gmail.com",
        address: "A-202 SALMA RESIDENCY DEFENCE VIEW PHASE 2",
        cost: 3500,
    },
    {
        id: '3',
        name: 'Jim Green',
        contact: '03102812051',
        email: "alisheeraz0007@gmail.com",
        address: "A-202 SALMA RESIDENCY DEFENCE VIEW PHASE 2",
        cost: 3500,
    },
    {
        id: '4',
        name: 'Jim Red',
        contact: '03102812051',
        email: "alisheeraz0007@gmail.com",
        address: "A-202 SALMA RESIDENCY DEFENCE VIEW PHASE 2",
        cost: 3500,
    },
    {
        id: '1',
        name: 'John Brown',
        contact: '03102812051',
        email: "alisheeraz0007@gmail.com",
        address: "A-202 SALMA RESIDENCY DEFENCE VIEW PHASE 2",
        cost: 3500,
    },

];

export default function Customers() {
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Contact',
            dataIndex: 'phone',
            key: 'phone',
            width: '15%',
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: '25%',
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Action',
            key: 'action',
            width: '10%',
            render: (_, record) => (
                activeUser && activeUser.permissions[0].customerEdit &&
                <Space size="middle">
                    <i onClick={() => showModal(record)} style={{ fontSize: 20, cursor: "pointer" }} class="fa fa-pencil" aria-hidden="true"></i>
                </Space>
            ),
        },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setName("")
        setEmail("")
        setId(`C-${generateUID()}`)
        setPhone("")
        setAddress("")
        setIsActive(true)
        setIsModalOpen(false)
        setIsModalOpen(false);
    };

    let [activeUser, setActiveUser] = useState("")

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        setActiveUser(user)
    }, [])

    const addcustomer = () => {
        let obj = {
            addedBy: activeUser.username,
            addedById: activeUser._id,
            name: name,
            id: id,
            email: email,
            phone: phone,
            address: address,
            isActive: isActive
        }

        var config = {
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/customer`,
            // url: 'http://localhost:5000/api/customer',
            data: obj
        };
        axios(config)
            .then((res) => {
                getCustomers()
                setName("")
                setEmail("")
                setId(`C-${generateUID()}`)
                setPhone("")
                setAddress("")
                setIsActive(true)
                setIsModalOpen(false)
            })
    }

    const updatecustomer = () => {
        let obj = {
            addedBy: activeUser.username,
            addedById: activeUser._id,
            name: name,
            email: email,
            phone: phone,
            address: address,
            isActive: isActive
        }

        var config = {
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/customer/${editObj._id}`,
            // url: `http://localhost:5000/api/customer/${editObj._id}`,
            data: obj
        };
        axios(config)
            .then((res) => {
                getCustomers()
                setName("")
                setEmail("")
                setId(`C-${generateUID()}`)
                setPhone("")
                setAddress("")
                setIsActive(true)
                setIsModalOpen(false)
            })
    }

    let [editObj, setEditObj] = useState("")

    const showModal = (record) => {
        if (record.name) {
            setIsModalOpen(true);
            setEditObj(record)
            setName(record.name)
            setEmail(record.email)
            setPhone(record.phone)
            setAddress(record.address)
            setIsActive(record.isActive)
        } else {
            setIsModalOpen(true);
        }
    };

    let [customers, setCustomers] = useState([])

    let [id, setId] = useState("")
    let [name, setName] = useState("")
    let [phone, setPhone] = useState("")
    let [email, setEmail] = useState("")
    let [address, setAddress] = useState("")
    let [isActive, setIsActive] = useState(true)

    function generateUID() {
        // I generate the UID from two parts here 
        // to ensure the random number provide enough bits.
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }

    const getCustomers = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/customer`,
            // url: 'http://localhost:5000/api/customer',
        };

        axios(config)
            .then((res) => {
                let sortedData = res.data.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
                setCustomers(sortedData)
            })
    }

    useEffect(() => {
        getCustomers()
        setId(`C-${generateUID()}`)
    }, [])

    return (
        <>
            <div className='d-flex justify-content-between w-100'>
                <h3>Customers</h3>
                {activeUser && activeUser.permissions[0].customerAdd &&
                    <Button onClick={showModal} type="primary">Add Customer</Button>
                }
            </div>
            <Table pagination={{ pageSize: 5 }} columns={columns} dataSource={customers} />

            <Modal
                style={{ top: 20 }}
                title={editObj.name ? "Update Customer" : "Add New Customer"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="submit" type="primary" onClick={handleCancel}>
                        Close
                    </Button>,
                    <Button key="submit" type="primary" onClick={editObj.name ? updatecustomer : addcustomer}>
                        {editObj.name ? "Update" : "Add"}
                    </Button>
                ]}
            >

                <form>
                    <div class="row" style={{ marginBottom: 15 }}>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>Customer Name</label>
                            <input onChange={(e) => setName(e.target.value)} value={name} type="text" class="form-control" placeholder="Customer Name" />
                        </div>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>Phone</label>
                            <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" class="form-control" placeholder="Phone" />
                        </div>
                    </div>
                    <div class="row" style={{ marginBottom: 15 }}>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" class="form-control" placeholder="Email" />
                        </div>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>Address</label>
                            <textarea onChange={(e) => setAddress(e.target.value)} value={address} type="text" class="form-control" placeholder="Address" />
                        </div>
                    </div>
                    <div class="form-check form-switch">
                        <input onChange={(e) => setIsActive(e.target.value)} checked={isActive} class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                        <label class="form-check-label" for="flexSwitchCheckDefault">Is Active</label>
                    </div>
                </form>

            </Modal>
        </>
    );
};