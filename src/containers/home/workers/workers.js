import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
const data = [
    {
        _id: '63bd4f948d964024737270cb',
        name: 'John Brown',
        workers: "Danish, Ali, Raheel, Qasim",
        cost: 3500,
    },
    {
        id: '2',
        name: 'Joe Black',
        workers: "Danish, Ali, Raheel, Qasim",
        cost: 3500,
    },
    {
        id: '3',
        name: 'Jim Green',
        workers: "Danish, Ali, Raheel, Qasim",
        cost: 3500,
    },
    {
        id: '4',
        name: 'Jim Red',
        workers: "Danish, Ali, Raheel, Qasim",
        cost: 3500,
    },
    {
        id: '1',
        name: 'John Brown',
        workers: "Danish, Ali, Raheel, Qasim",
        cost: 3500,
    },

];

export default function Workers() {
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
            title: 'S. No',
            dataIndex: '_id',
            key: '_id',
            // width: '15%',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            render: (_, record, i) => (
                i + 1
            )
        },
        {
            title: 'Worker Name',
            dataIndex: 'name',
            key: 'name',
            width: '15%',
            ...getColumnSearchProps('name'),
        },
        {
            title: 'Worker Image',
            key: 'name',
            width: '15%',
            render: (_, record) => (
                record.profileImage ?
                    <img width="50%" src={`${process.env.REACT_APP_BACKEND_URL}/${record.profileImage}`} />
                    :
                    "No Image"
            ),
        },
        {
            title: 'CNIC',
            dataIndex: 'cnicNumber',
            key: 'cnicNumber',
            width: '20%',
            ...getColumnSearchProps('cnicNumber'),
        },
        {
            title: 'Is Active',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '10%',
            render: (_, record) => (
                record.isActive ? "Active" : "Disabled"
            ),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            width: '20%',
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Action',
            key: 'action',
            width: '5%',
            render: (_, record) => (
                activeUser && activeUser.permissions[0].workerEdit &&
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
        setIsModalOpen(false);
    };

    const showModal = (record) => {
        if (record.name) {
            setEditObj(record)
            setName(record.name)
            setAddress(record.address)
            setBase1(`${process.env.REACT_APP_BACKEND_URL}/${record.profileImage}`)
            setBase2(`${process.env.REACT_APP_BACKEND_URL}/${record.cnicFrontImage}`)
            setBase3(`${process.env.REACT_APP_BACKEND_URL}/${record.cnicBackImage}`)
            setUrl1(record.profileImage)
            setUrl2(record.cnicFrontImage)
            setUrl3(record.cnicBackImage)
            setEmail(record.email)
            setIsActive(record.isActive)
            setPhone(record.phone)
            setCnicNumber(record.cnicNumber)
            setPassword(record.password)
            setIsModalOpen(true);
        } else {
            setIsModalOpen(true);
            setEditObj("")
            setName("")
            setAddress("")
            setBase1("")
            setBase2("")
            setBase3("")
            setUrl1("")
            setUrl2("")
            setUrl3("")
            setEmail("")
            setIsActive(true)
            setPhone("")
            setCnicNumber("")
            setPassword("")
            setConfirmPassword("")
        }
    };

    function getBase64(file, name) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (name === "base1") {
                setBase1(reader.result)
            } else if (name === "base2") {
                setBase2(reader.result)
            } else {
                setBase3(reader.result)
            }
        };
        reader.onerror = (error) => {
        };
    }

    let [name, setName] = useState("")
    let [phone, setPhone] = useState("")
    let [cnicNumber, setCnicNumber] = useState("")
    let [email, setEmail] = useState("")
    let [address, setAddress] = useState("")
    let [isActive, setIsActive] = useState(true)
    let [password, setPassword] = useState("")
    let [confirmPassword, setConfirmPassword] = useState("")

    let [base1, setBase1] = useState("")
    let [base2, setBase2] = useState("")
    let [base3, setBase3] = useState("")

    let [profileImage, setProfileImage] = useState("")
    let [cnicFront, setCnicFront] = useState("")
    let [cnicBack, setCnicBack] = useState("")

    let [url1, setUrl1] = useState("")
    let [url2, setUrl2] = useState("")
    let [url3, setUrl3] = useState("")

    let [editObj, setEditObj] = useState('')

    let [activeUser, setActiveUser] = useState("")

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        setActiveUser(user)
    }, [])

    const addWorker = () => {

        let wor = workers.filter((a) => a.phone === phone)

        if (wor.length) {
            alert("Already added worker with this number..")
        } else if (password !== confirmPassword) {
            alert("Password does not match")
        } else {
            let obj = {
                name: name,
                addedBy: activeUser.username,
                addedById: activeUser._id,
                profileImage: url1,
                cnicFrontImage: url2,
                cnicBackImage: url3,
                cnicNumber: cnicNumber,
                phone: phone,
                email: email,
                address: address,
                password: password,
                isActive: isActive
            }
            var config2 = {
                method: 'post',
                url: `${process.env.REACT_APP_BACKEND_URL}/api/worker`,
                // url: 'http://localhost:5000/api/worker',
                data: obj
            };
            axios(config2)
                .then((res) => {
                    setIsModalOpen(false)
                    getWorkers()
                    setEditObj("")
                    setName("")
                    setAddress("")
                    setBase1("")
                    setBase2("")
                    setBase3("")
                    setEmail("")
                    setIsActive(true)
                    setPhone("")
                    setCnicNumber("")
                    setPassword("")
                    setConfirmPassword("")
                })
        }
    }

    const updateWorker = () => {

        let obj = {
            name: name,
            addedBy: activeUser.username,
            addedById: activeUser._id,
            profileImage: url1,
            cnicFrontImage: url2,
            cnicBackImage: url3,
            cnicNumber: cnicNumber,
            phone: phone,
            email: email,
            address: address,
            password: password,
            isActive: isActive
        }
        var config2 = {
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/worker/${editObj._id}`,
            // url: `http://localhost:5000/api/worker/${editObj._id}`,
            data: obj
        };
        axios(config2)
            .then((res) => {
                setIsModalOpen(false)
                getWorkers()
                setEditObj("")
                setName("")
                setAddress("")
                setBase1("")
                setBase2("")
                setBase3("")
                setEmail("")
                setIsActive(true)
                setPhone("")
                setCnicNumber("")
                setPassword("")
                setConfirmPassword("")
            })
    }

    let [workers, setWorkers] = useState([])

    useEffect(() => {
        getWorkers()
    }, [])

    const getWorkers = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/worker`,
            // url: 'http://localhost:5000/api/worker',
        };

        axios(config)
            .then((res) => {
                let sortedData = res.data.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
                setWorkers(sortedData)
            })
    }

    return (
        <>
            <div className='d-flex justify-content-between w-100'>
                <h3>Workers</h3>
                {activeUser && activeUser.permissions[0].workerAdd &&
                    <Button onClick={showModal} type="primary">Add Worker</Button>
                }
            </div>
            <Table pagination={{ pageSize: 5 }} columns={columns} dataSource={workers} />

            <Modal
                style={{ top: 20 }}
                title={editObj ? "Update Worker" : "Add New Worker"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="submit" type="primary" onClick={handleCancel}>
                        Close
                    </Button>,
                    <Button key="submit" type="primary" onClick={editObj ? updateWorker : addWorker}>
                        {editObj ? "Update" : "Add"}
                    </Button>
                ]}
            >

                <form>
                    <div class="row" style={{ marginBottom: 15 }}>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>Worker Name</label>
                            <input onChange={(e) => setName(e.target.value)} value={name} type="text" class="form-control" placeholder="Worker Name" />
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
                            <label style={{ fontWeight: "bold", margin: 0 }}>CNIC Number</label>
                            <input onChange={(e) => setCnicNumber(e.target.value)} value={cnicNumber} type="text" class="form-control" placeholder="CNIC Number" />
                        </div>
                    </div>

                    {editObj ?
                        <div class="row" style={{ marginBottom: 15 }}>
                            <div class="col">
                                <label style={{ fontWeight: "bold", margin: 0 }}>Password</label>
                                <input onChange={(e) => setPassword(e.target.value)} value={password} type="text" class="form-control" placeholder="Password" />
                            </div>
                        </div>
                        :
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
                    }

                    <div class="row" style={{ marginBottom: 15 }}>
                        <div class="col">
                            <label style={{ fontWeight: "bold", margin: 0 }}>Address</label>
                            <textarea onChange={(e) => setAddress(e.target.value)} value={address} type="text" class="form-control" placeholder="Address" />
                        </div>
                    </div>
                    <div class="form-check form-switch">
                        <input onChange={(e) => setIsActive(e.target.checked)} checked={isActive} class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                        <label class="form-check-label" for="flexSwitchCheckDefault">Is Active</label>
                    </div>
                </form>
                <hr />
                <div className='icons'>
                    <h6>Profile Image</h6>
                    <div className='d-flex'>
                        <input onChange={(e) => {
                            getBase64(e.target.files[0], "base1")
                            setProfileImage(e.target.files[0])
                            let images = new FormData()
                            images.append("files", e.target.files[0])
                            var config = {
                                method: 'post',
                                url: `${process.env.REACT_APP_BACKEND_URL}/uploadMultiple`,
                                // url: 'http://localhost:5000/uploadMultiple',
                                data: images
                            };
                            axios(config)
                                .then((response) => {
                                    setUrl1(response.data[0])
                                })
                                .catch((error) => {
                                    // console.log(error);
                                });
                        }
                        } type="file" />
                        <img className='mt-1 mr-1' width={100} src={base1} />
                    </div>
                </div>
                <hr />
                <div className='icons'>
                    <div className='row'>
                        <div className='col-6'>
                            <h6>CNIC Front</h6>
                            <div className='d-flex flex-column'>
                                <input onChange={(e) => {
                                    getBase64(e.target.files[0], "base2")
                                    setCnicFront(e.target.files[0])
                                    let images = new FormData()
                                    images.append("files", e.target.files[0])
                                    var config = {
                                        method: 'post',
                                        url: `${process.env.REACT_APP_BACKEND_URL}/uploadMultiple`,
                                        // url: 'http://localhost:5000/uploadMultiple',
                                        data: images
                                    };
                                    axios(config)
                                        .then((response) => {
                                            setUrl2(response.data[0])
                                        })
                                        .catch((error) => {
                                            // console.log(error);
                                        });
                                }
                                } type="file" />
                                <div>
                                    <img className='mt-1 mr-1' width={100} src={base2} />
                                </div>
                            </div>
                        </div>
                        <div className='col-6'>
                            <h6>CNIC Back</h6>
                            <div className='d-flex flex-column'>
                                <input onChange={(e) => {
                                    getBase64(e.target.files[0], "base3")
                                    setCnicBack(e.target.files[0])
                                    let images = new FormData()
                                    images.append("files", e.target.files[0])
                                    var config = {
                                        method: 'post',
                                        url: `${process.env.REACT_APP_BACKEND_URL}/uploadMultiple`,
                                        // url: 'http://localhost:5000/uploadMultiple',
                                        data: images
                                    };
                                    axios(config)
                                        .then((response) => {
                                            setUrl3(response.data[0])
                                        })
                                        .catch((error) => {
                                            // console.log(error);
                                        });
                                }
                                } type="file" />
                                <div>
                                    <img className='mt-1 mr-1' width={100} src={base3} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </Modal>
        </>
    );
};