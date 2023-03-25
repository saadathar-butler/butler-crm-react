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

export default function CrmUsers() {
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
            width: '10%',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
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
            title: 'Type',
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
                activeUser && activeUser.permissions[0].crmUserEdit &&
                <Space size="middle">
                    <i onClick={() => showModal(record)} style={{ fontSize: 20, cursor: "pointer" }} class="fa fa-pencil" aria-hidden="true"></i>
                </Space>
            ),
        },
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOk = () => {
        setIsModalOpen(false);
        setEditObj("")
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setEditObj("")
        setName("")
        setPhone("")
        setConfirmPassword("")
        setPassword("")
        setEmail("")
        setType("Operation")
        setUsername("")
        setId(`U-${generateUID()}`)
    };

    const showModal = (record) => {
        if (record.name) {
            setIsModalOpen(true);
            setName(record.name)
            setPhone(record.phone)
            setEmail(record.email)
            setType(record.type)
            setUsername(record.username)
            setId(record.id)
            setPassword(record.password)
            setEditObj(record)
            if (record.permissions && record.permissions.length) {
                if (record.type === "Admin") {
                    setPermissionsAdmin(record.permissions[0])
                }
                if (record.type === "Operation") {
                    setPermissionsOperation(record.permissions[0])
                }
                if (record.type === "Call Center") {
                    setPermissionsCallCenter(record.permissions[0])
                }
                if (record.type === "Finance") {
                    setPermissionsFinance(record.permissions[0])
                }
            }

        } else {
            setIsModalOpen(true);
        }
    };

    let [name, setName] = useState("")
    let [id, setId] = useState("")
    let [email, setEmail] = useState("")
    let [phone, setPhone] = useState("")
    let [type, setType] = useState("Operation")
    let [username, setUsername] = useState("")
    let [password, setPassword] = useState("")
    let [confirmPassword, setConfirmPassword] = useState("")

    function generateUID() {
        // I generate the UID from two parts here 
        // to ensure the random number provide enough bits.
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }

    useEffect(() => {
        setId(`U-${generateUID()}`)
    }, [])

    let [activeUser, setActiveUser] = useState("")

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        setActiveUser(user)
    }, [])

    const addCrmUser = () => {
        if (password !== confirmPassword) {
            alert("Password does not match")
        } else {
            let obj = {
                name: name,
                addedBy: activeUser.username,
                addedById: activeUser._id,
                id: id,
                email: email,
                phone: phone,
                type: type,
                username: username,
                password: password
            }

            if (type === "Admin") {
                obj.permissions = [permissionsAdmin]
            }
            if (type === "Operation") {
                obj.permissions = [permissionsOperation]
            }
            if (type === "Call Center") {
                obj.permissions = [permissionsCallCenter]
            }
            if (type === "Finance") {
                obj.permissions = [permissionsFinance]
            }

            var config2 = {
                method: 'post',
                url: `${process.env.REACT_APP_BACKEND_URL}/api/crmUser`,
                // url: 'http://localhost:5000/api/crmUser',
                data: obj
            };
            axios(config2)
                .then((res) => {
                    setIsModalOpen(false)
                    setName("")
                    setPhone("")
                    setConfirmPassword("")
                    setPassword("")
                    setEmail("")
                    setType("Operation")
                    setUsername("")
                    setId(`U-${generateUID()}`)
                    setEditObj("")
                    getCrmUsers()
                    setPermissionsAdmin({
                        serviceView: true,
                        serviceAdd: true,
                        serviceEdit: true,
                        serviceDelete: true,
                        subServiceView: true,
                        subServiceAdd: true,
                        subServiceEdit: true,
                        subServiceDelete: true,
                        workerView: true,
                        workerAdd: true,
                        workerEdit: true,
                        workerDelete: true,
                        customerView: true,
                        customerAdd: true,
                        customerEdit: true,
                        customerDelete: true,
                        crmUserView: true,
                        crmUserAdd: true,
                        crmUserEdit: true,
                        crmUserDelete: true,
                        leadsView: true,
                        leadsAdd: true,
                        leadsEdit: true,
                        leadsDelete: true,
                        callsView: true,
                        callsAdd: true,
                        callsEdit: true,
                        callsDelete: true,
                        financeView: true,
                        financeAdd: true,
                        financeEdit: true,
                        financeDelete: true,
                        dispatchView: true,
                        reportsView: true,
                        discountAuthority: true,
                        discountLimitPercent: 100,
                        closeJobAuthority: true
                    })
                    setPermissionsOperation({
                        serviceView: true,
                        serviceAdd: true,
                        serviceEdit: true,
                        serviceDelete: false,
                        subServiceView: true,
                        subServiceAdd: true,
                        subServiceEdit: true,
                        subServiceDelete: false,
                        workerView: true,
                        workerAdd: true,
                        workerEdit: true,
                        workerDelete: false,
                        customerView: true,
                        customerAdd: true,
                        customerEdit: true,
                        customerDelete: false,
                        crmUserView: false,
                        crmUserAdd: false,
                        crmUserEdit: false,
                        crmUserDelete: false,
                        leadsView: true,
                        leadsAdd: true,
                        leadsEdit: true,
                        leadsDelete: false,
                        callsView: true,
                        callsAdd: true,
                        callsEdit: true,
                        callsDelete: false,
                        financeView: false,
                        financeAdd: false,
                        financeEdit: false,
                        financeDelete: false,
                        dispatchView: true,
                        reportsView: false,
                        discountAuthority: true,
                        discountLimitPercent: 0,
                        closeJobAuthority: false
                    })
                    setPermissionsCallCenter({
                        serviceView: false,
                        serviceAdd: false,
                        serviceEdit: false,
                        serviceDelete: false,
                        subServiceView: false,
                        subServiceAdd: false,
                        subServiceEdit: false,
                        subServiceDelete: false,
                        workerView: false,
                        workerAdd: false,
                        workerEdit: false,
                        workerDelete: false,
                        customerView: false,
                        customerAdd: false,
                        customerEdit: false,
                        customerDelete: false,
                        crmUserView: false,
                        crmUserAdd: false,
                        crmUserEdit: false,
                        crmUserDelete: false,
                        leadsView: false,
                        leadsAdd: false,
                        leadsEdit: false,
                        leadsDelete: false,
                        callsView: true,
                        callsAdd: true,
                        callsEdit: true,
                        callsDelete: false,
                        financeView: false,
                        financeAdd: false,
                        financeEdit: false,
                        financeDelete: false,
                        dispatchView: true,
                        reportsView: false,
                        discountAuthority: false,
                        discountLimitPercent: 0,
                        closeJobAuthority: false
                    })
                    setPermissionsFinance({
                        serviceView: false,
                        serviceAdd: false,
                        serviceEdit: false,
                        serviceDelete: false,
                        subServiceView: false,
                        subServiceAdd: false,
                        subServiceEdit: false,
                        subServiceDelete: false,
                        workerView: false,
                        workerAdd: false,
                        workerEdit: false,
                        workerDelete: false,
                        customerView: false,
                        customerAdd: false,
                        customerEdit: false,
                        customerDelete: false,
                        crmUserView: false,
                        crmUserAdd: false,
                        crmUserEdit: false,
                        crmUserDelete: false,
                        leadsView: true,
                        leadsAdd: false,
                        leadsEdit: true,
                        leadsDelete: false,
                        callsView: false,
                        callsAdd: false,
                        callsEdit: false,
                        callsDelete: false,
                        financeView: true,
                        financeAdd: true,
                        financeEdit: true,
                        financeDelete: true,
                        dispatchView: true,
                        reportsView: false,
                        discountAuthority: false,
                        discountLimitPercent: 0,
                        closeJobAuthority: true
                    })
                })
        }
    }

    const updateCrmUser = () => {
        let obj = {
            name: name,
            addedBy: activeUser.username,
            addedById: activeUser._id,
            id: id,
            email: email,
            phone: phone,
            type: type,
            username: username,
            password: password
        }
        if (type === "Admin") {
            obj.permissions = [permissionsAdmin]
        }
        if (type === "Operation") {
            obj.permissions = [permissionsOperation]
        }
        if (type === "Call Center") {
            obj.permissions = [permissionsCallCenter]
        }
        if (type === "Finance") {
            obj.permissions = [permissionsFinance]
        }

        var config2 = {
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/crmUser/${editObj._id}`,
            // url: `http://localhost:5000/api/crmUser/${editObj._id}`,
            data: obj
        };
        axios(config2)
            .then((res) => {
                setIsModalOpen(false)
                setName("")
                setPhone("")
                setConfirmPassword("")
                setPassword("")
                setEmail("")
                setType("")
                setUsername("")
                setId(`U-${generateUID()}`)
                setEditObj("")
                getCrmUsers()
                setPermissionsAdmin({
                    serviceView: true,
                    serviceAdd: true,
                    serviceEdit: true,
                    serviceDelete: true,
                    subServiceView: true,
                    subServiceAdd: true,
                    subServiceEdit: true,
                    subServiceDelete: true,
                    workerView: true,
                    workerAdd: true,
                    workerEdit: true,
                    workerDelete: true,
                    customerView: true,
                    customerAdd: true,
                    customerEdit: true,
                    customerDelete: true,
                    crmUserView: true,
                    crmUserAdd: true,
                    crmUserEdit: true,
                    crmUserDelete: true,
                    leadsView: true,
                    leadsAdd: true,
                    leadsEdit: true,
                    leadsDelete: true,
                    callsView: true,
                    callsAdd: true,
                    callsEdit: true,
                    callsDelete: true,
                    financeView: true,
                    financeAdd: true,
                    financeEdit: true,
                    financeDelete: true,
                    dispatchView: true,
                    reportsView: true,
                    discountAuthority: true,
                    discountLimitPercent: 100,
                    closeJobAuthority: true
                })
                setPermissionsOperation({
                    serviceView: true,
                    serviceAdd: true,
                    serviceEdit: true,
                    serviceDelete: false,
                    subServiceView: true,
                    subServiceAdd: true,
                    subServiceEdit: true,
                    subServiceDelete: false,
                    workerView: true,
                    workerAdd: true,
                    workerEdit: true,
                    workerDelete: false,
                    customerView: true,
                    customerAdd: true,
                    customerEdit: true,
                    customerDelete: false,
                    crmUserView: false,
                    crmUserAdd: false,
                    crmUserEdit: false,
                    crmUserDelete: false,
                    leadsView: true,
                    leadsAdd: true,
                    leadsEdit: true,
                    leadsDelete: false,
                    callsView: true,
                    callsAdd: true,
                    callsEdit: true,
                    callsDelete: false,
                    financeView: false,
                    financeAdd: false,
                    financeEdit: false,
                    financeDelete: false,
                    dispatchView: true,
                    reportsView: false,
                    discountAuthority: true,
                    discountLimitPercent: 0,
                    closeJobAuthority: false
                })
                setPermissionsCallCenter({
                    serviceView: false,
                    serviceAdd: false,
                    serviceEdit: false,
                    serviceDelete: false,
                    subServiceView: false,
                    subServiceAdd: false,
                    subServiceEdit: false,
                    subServiceDelete: false,
                    workerView: false,
                    workerAdd: false,
                    workerEdit: false,
                    workerDelete: false,
                    customerView: false,
                    customerAdd: false,
                    customerEdit: false,
                    customerDelete: false,
                    crmUserView: false,
                    crmUserAdd: false,
                    crmUserEdit: false,
                    crmUserDelete: false,
                    leadsView: false,
                    leadsAdd: false,
                    leadsEdit: false,
                    leadsDelete: false,
                    callsView: true,
                    callsAdd: true,
                    callsEdit: true,
                    callsDelete: false,
                    financeView: false,
                    financeAdd: false,
                    financeEdit: false,
                    financeDelete: false,
                    dispatchView: true,
                    reportsView: false,
                    discountAuthority: false,
                    discountLimitPercent: 0,
                    closeJobAuthority: false
                })
                setPermissionsFinance({
                    serviceView: false,
                    serviceAdd: false,
                    serviceEdit: false,
                    serviceDelete: false,
                    subServiceView: false,
                    subServiceAdd: false,
                    subServiceEdit: false,
                    subServiceDelete: false,
                    workerView: false,
                    workerAdd: false,
                    workerEdit: false,
                    workerDelete: false,
                    customerView: false,
                    customerAdd: false,
                    customerEdit: false,
                    customerDelete: false,
                    crmUserView: false,
                    crmUserAdd: false,
                    crmUserEdit: false,
                    crmUserDelete: false,
                    leadsView: true,
                    leadsAdd: false,
                    leadsEdit: true,
                    leadsDelete: false,
                    callsView: false,
                    callsAdd: false,
                    callsEdit: false,
                    callsDelete: false,
                    financeView: true,
                    financeAdd: true,
                    financeEdit: true,
                    financeDelete: true,
                    dispatchView: true,
                    reportsView: false,
                    discountAuthority: false,
                    discountLimitPercent: 0,
                    closeJobAuthority: true
                })
            })
    }

    let [crmUsers, setCrmUsers] = useState([])

    useEffect(() => {
        getCrmUsers()
    }, [])

    const getCrmUsers = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/crmUser`,
            // url: 'http://localhost:5000/api/crmUser',
        };

        axios(config)
            .then((res) => {
                let sortedData = res.data.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
                setCrmUsers(sortedData)
            })
    }

    let [editObj, setEditObj] = useState("")

    const [isModalOpen2, setIsModalOpen2] = useState(false);

    const [permissionsAdmin, setPermissionsAdmin] = useState({
        serviceView: true,
        serviceAdd: true,
        serviceEdit: true,
        serviceDelete: true,
        subServiceView: true,
        subServiceAdd: true,
        subServiceEdit: true,
        subServiceDelete: true,
        workerView: true,
        workerAdd: true,
        workerEdit: true,
        workerDelete: true,
        customerView: true,
        customerAdd: true,
        customerEdit: true,
        customerDelete: true,
        crmUserView: true,
        crmUserAdd: true,
        crmUserEdit: true,
        crmUserDelete: true,
        leadsView: true,
        leadsAdd: true,
        leadsEdit: true,
        leadsDelete: true,
        callsView: true,
        callsAdd: true,
        callsEdit: true,
        callsDelete: true,
        financeView: true,
        financeAdd: true,
        financeEdit: true,
        financeDelete: true,
        dispatchView: true,
        reportsView: true,
        discountAuthority: true,
        discountLimitPercent: 100,
        closeJobAuthority: true
    });

    const [permissionsOperation, setPermissionsOperation] = useState({
        serviceView: true,
        serviceAdd: true,
        serviceEdit: true,
        serviceDelete: false,
        subServiceView: true,
        subServiceAdd: true,
        subServiceEdit: true,
        subServiceDelete: false,
        workerView: true,
        workerAdd: true,
        workerEdit: true,
        workerDelete: false,
        customerView: true,
        customerAdd: true,
        customerEdit: true,
        customerDelete: false,
        crmUserView: false,
        crmUserAdd: false,
        crmUserEdit: false,
        crmUserDelete: false,
        leadsView: true,
        leadsAdd: true,
        leadsEdit: true,
        leadsDelete: false,
        callsView: true,
        callsAdd: true,
        callsEdit: true,
        callsDelete: false,
        financeView: false,
        financeAdd: false,
        financeEdit: false,
        financeDelete: false,
        dispatchView: true,
        reportsView: false,
        discountAuthority: true,
        discountLimitPercent: 0,
        closeJobAuthority: false
    });

    const [permissionsCallCenter, setPermissionsCallCenter] = useState({
        serviceView: false,
        serviceAdd: false,
        serviceEdit: false,
        serviceDelete: false,
        subServiceView: false,
        subServiceAdd: false,
        subServiceEdit: false,
        subServiceDelete: false,
        workerView: false,
        workerAdd: false,
        workerEdit: false,
        workerDelete: false,
        customerView: false,
        customerAdd: false,
        customerEdit: false,
        customerDelete: false,
        crmUserView: false,
        crmUserAdd: false,
        crmUserEdit: false,
        crmUserDelete: false,
        leadsView: false,
        leadsAdd: false,
        leadsEdit: false,
        leadsDelete: false,
        callsView: true,
        callsAdd: true,
        callsEdit: true,
        callsDelete: false,
        financeView: false,
        financeAdd: false,
        financeEdit: false,
        financeDelete: false,
        dispatchView: true,
        reportsView: false,
        discountAuthority: false,
        discountLimitPercent: 0,
        closeJobAuthority: false
    });

    const [permissionsFinance, setPermissionsFinance] = useState({
        serviceView: false,
        serviceAdd: false,
        serviceEdit: false,
        serviceDelete: false,
        subServiceView: false,
        subServiceAdd: false,
        subServiceEdit: false,
        subServiceDelete: false,
        workerView: false,
        workerAdd: false,
        workerEdit: false,
        workerDelete: false,
        customerView: false,
        customerAdd: false,
        customerEdit: false,
        customerDelete: false,
        crmUserView: false,
        crmUserAdd: false,
        crmUserEdit: false,
        crmUserDelete: false,
        leadsView: true,
        leadsAdd: false,
        leadsEdit: true,
        leadsDelete: false,
        callsView: false,
        callsAdd: false,
        callsEdit: false,
        callsDelete: false,
        financeView: true,
        financeAdd: true,
        financeEdit: true,
        financeDelete: true,
        dispatchView: true,
        reportsView: false,
        discountAuthority: false,
        discountLimitPercent: 0,
        closeJobAuthority: true
    });

    return (
        <>
            <div className='d-flex justify-content-between w-100'>
                <h3>CRM Users</h3>
                {activeUser && activeUser.permissions[0].crmUserAdd &&
                    <Button type="primary" onClick={showModal}>Add CRM Users</Button>
                }
            </div>
            <Table pagination={{ pageSize: 5 }} columns={columns} dataSource={crmUsers} />

            <Modal
                title={editObj.name ? "Update Crm User" : "Add CRM Users"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="submit" type="primary" onClick={handleCancel}>
                        Close
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => setIsModalOpen2(true)}>
                        Permissions
                    </Button>,
                    <Button key="submit" type="primary" onClick={editObj.name ? updateCrmUser : addCrmUser}>
                        {editObj.name ? "Update" : "Add"}
                    </Button>
                ]}
            >
                <form>
                    <div class="row" style={{ marginBottom: 15 }}>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>Id</label>
                            <input value={id} disabled type="text" class="form-control" placeholder="Id" />
                        </div>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>Name</label>
                            <input onChange={(e) => setName(e.target.value)} value={name} type="text" class="form-control" placeholder="Name" />
                        </div>
                    </div>

                    <div class="row" style={{ marginBottom: 15 }}>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>Email</label>
                            <input onChange={(e) => setEmail(e.target.value)} value={email} type="text" class="form-control" placeholder="Email" />
                        </div>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>Phone</label>
                            <input onChange={(e) => setPhone(e.target.value)} value={phone} type="text" class="form-control" placeholder="Phone" />
                        </div>
                    </div>

                    <div class="row" style={{ marginBottom: 15 }}>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>Type</label>
                            <select value={type} onChange={(e) => setType(e.target.value)} type="text" class="form-control" placeholder="Type" >
                                {["Operation", "Admin", "Call Center", "Finance"].map((a, i) => {
                                    return (
                                        <option value={a} key={i}>{a}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>User Name</label>
                            <input onChange={(e) => setUsername(e.target.value)} value={username} type="text" class="form-control" placeholder="User Name" />
                        </div>
                    </div>

                    {!editObj.name ?
                        <div class="row" style={{ marginBottom: 15 }}>
                            <div class="col">
                                <label style={{ fontWeight: "bold", margin: 0 }}>Password</label>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" class="form-control" placeholder="Password" />
                            </div>
                            <div class="col">
                                <label style={{ fontWeight: "bold", margin: 0 }}>Confirm Password</label>
                                <input onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} type="password" class="form-control" placeholder="Confirm Password" />
                            </div>
                        </div>
                        :
                        <div class="row" style={{ marginBottom: 15 }}>
                            <div class="col">
                                <label style={{ fontWeight: "bold", margin: 0 }}>Password</label>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} type="text" class="form-control" placeholder="Password" />
                            </div>
                        </div>
                    }
                </form>
            </Modal>


            <Modal
                title={editObj.name ? "Update Permissions" : "Add Permissions"}
                open={isModalOpen2}
                onOk={() => setIsModalOpen2(false)}
                onCancel={() => setIsModalOpen2(false)}
                footer={[
                    <Button key="submit" type="primary" onClick={() => setIsModalOpen2(false)}>
                        Close
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => setIsModalOpen2(false)}>
                        Done
                    </Button>
                ]}
            >
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                    {
                        type === "Admin" ?
                            Object.keys(permissionsAdmin).map((a, i) => {
                                return (
                                    a !== "discountLimitPercent" && a !== "_id" &&
                                    <div key={i} class="form-check" style={{ width: "28%", marginRight: 10, marginBottom: 5 }}>
                                        <input onChange={(e) => {
                                            let obj = { ...permissionsAdmin }
                                            obj[a] = e.target.checked
                                            console.log(obj[a])
                                            setPermissionsAdmin(obj)
                                        }} type="checkbox" checked={permissionsAdmin[a]} class="form-check-input" id={a} />
                                        <label class="form-check-label" for={a}>
                                            {a}
                                        </label>
                                    </div>
                                )
                            })
                            :
                            type === "Operation" ?
                                Object.keys(permissionsOperation).map((a, i) => {
                                    return (
                                        a !== "discountLimitPercent" && a !== "_id" &&
                                        <div key={i} class="form-check" style={{ width: "28%", marginRight: 10, marginBottom: 5 }}>
                                            <input onChange={(e) => {
                                                let obj = { ...permissionsOperation }
                                                obj[a] = e.target.checked
                                                console.log(obj[a])
                                                setPermissionsOperation(obj)
                                            }} type="checkbox" checked={permissionsOperation[a]} class="form-check-input" id={a} />
                                            <label class="form-check-label" for={a}>
                                                {a}
                                            </label>
                                        </div>
                                    )
                                })
                                :
                                type === "Call Center" ?
                                    Object.keys(permissionsCallCenter).map((a, i) => {
                                        return (
                                            a !== "discountLimitPercent" && a !== "_id" &&
                                            <div key={i} class="form-check" style={{ width: "28%", marginRight: 10, marginBottom: 5 }}>
                                                <input onChange={(e) => {
                                                    let obj = { ...permissionsCallCenter }
                                                    obj[a] = e.target.checked
                                                    console.log(obj[a])
                                                    setPermissionsCallCenter(obj)
                                                }} type="checkbox" checked={permissionsCallCenter[a]} class="form-check-input" id={a} />
                                                <label class="form-check-label" for={a}>
                                                    {a}
                                                </label>
                                            </div>
                                        )
                                    })
                                    :
                                    type === "Finance" ?
                                        Object.keys(permissionsFinance).map((a, i) => {
                                            return (
                                                a !== "discountLimitPercent" && a !== "_id" &&
                                                <div key={i} class="form-check" style={{ width: "28%", marginRight: 10, marginBottom: 5 }}>
                                                    <input onChange={(e) => {
                                                        let obj = { ...permissionsFinance }
                                                        obj[a] = e.target.checked
                                                        console.log(obj[a])
                                                        setPermissionsFinance(obj)
                                                    }} type="checkbox" checked={permissionsFinance[a]} class="form-check-input" id={a} />
                                                    <label class="form-check-label" for={a}>
                                                        {a}
                                                    </label>
                                                </div>
                                            )
                                        })
                                        :
                                        null
                    }
                </div>
            </Modal>

        </>
    );
};