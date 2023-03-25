import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
const data = [
  {
    id: '1',
    name: 'John Brown',
    cost: 3500,
  },
  {
    id: '2',
    name: 'Joe Black',
    cost: 3500,
  },
  {
    id: '3',
    name: 'Jim Green',
    cost: 3500,
  },
  {
    id: '4',
    name: 'Jim Red',
    cost: 3500,
  },
  {
    id: '1',
    name: 'John Brown',
    cost: 3500,
  },

];

export default function SubServices() {
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
      record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
      title: 'Serial No.',
      dataIndex: 'id',
      key: 'id',
      width: '15%',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
      render: (_, record, index) => (
        index + 1
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Icon',
      key: 'description',
      width: '10%',
      render: (_, record) => (
        <img width="100%" src={`${process.env.REACT_APP_BACKEND_URL}/${record.icon}`} />
      ),
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      ...getColumnSearchProps('description'),
      sorter: (a, b) => a.cost - b.cost,
      width: '10%',
    },
    {
      title: 'Category Name',
      key: 'service',
      dataIndex: 'service',
      ...getColumnSearchProps('service'),
      width: '20%',
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        activeUser && activeUser.permissions[0].subServiceEdit &&
        <Space size="middle">
          <i onClick={() => showModal(record)} style={{ fontSize: 20, cursor: "pointer" }} class="fa fa-pencil" aria-hidden="true"></i>
        </Space>
      ),
    },
  ];

  let [editObj, setEditObj] = useState('')
  let [selectedService, setSelectedService] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false);

  let [base, setBase] = useState("")

  let [name, setName] = useState("")
  let [description, setDescription] = useState("")
  let [amount, setAmount] = useState("")
  let [isActive, setIsActive] = useState(true)
  let [icon, setIcon] = useState("")

  let [subServices, setSubServices] = useState([])
  let [services, setServices] = useState([])


  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function getBase64(file) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setBase(reader.result)
    };
    reader.onerror = (error) => {
    };
  }

  const showModal = (record) => {
    if (record.name) {
      setIsModalOpen(true);
      setEditObj(record)
      setName(record.name)
      setAmount(record.cost)
      setDescription(record.description)
      setIsActive(record.isActive)
      setBase(`${process.env.REACT_APP_BACKEND_URL}/${record.icon}`)
    } else {
      setIsModalOpen(true);
      setEditObj("")
      setName("")
      setAmount("")
      setDescription("")
      setIsActive(true)
      setBase("")
    }
  };

  let [activeUser, setActiveUser] = useState("")

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"))
    setActiveUser(user)
  }, [])

  const addService = () => {
    if (icon) {

      let images = new FormData()

      images.append("files", icon)

      var config = {
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/uploadMultiple`,
        // url: 'http://localhost:5000/uploadMultiple',
        data: images
      };


      axios(config)
        .then((response) => {
          let obj = {
            name: name,
            addedBy: activeUser.username,
            addedById: activeUser._id,
            description: description,
            isActive: isActive,
            service: selectedService.name,
            serviceId: selectedService._id,
            cost: amount,
            icon: response.data[0],
          }
          var config2 = {
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/subService`,
            // url: 'http://localhost:5000/api/subService',
            data: obj
          };
          axios(config2)
            .then((res) => {
              getSubServices()
              setIsModalOpen(false)
              setIcon("")
            })
        })
        .catch((error) => {
          // console.log(error);
        });
    } else {

      let obj = {
        name: name,
        addedBy: activeUser.username,
        addedById: activeUser._id,
        description: description,
        isActive: isActive,
        service: selectedService.name,
        serviceId: selectedService._id,
        cost: amount,
      }
      var config2 = {
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/api/subService`,
        // url: 'http://localhost:5000/api/subService',
        data: obj
      };
      axios(config2)
        .then((res) => {
          getSubServices()
          setIsModalOpen(false)
          setIcon("")
        })
    }
  }

  const updateService = () => {
    if (icon) {
      let images = new FormData()

      images.append("files", icon)

      var config = {
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/uploadMultiple`,
        // url: 'http://localhost:5000/uploadMultiple',
        data: images
      };


      axios(config)
        .then((response) => {
          let obj = {
            name: name,
            addedBy: activeUser.username,
            addedById: activeUser._id,
            description: description,
            isActive: isActive,
            service: selectedService.name,
            serviceId: selectedService._id,
            cost: amount,
            icon: response.data[0],
          }
          var config2 = {
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/subService/${editObj._id}`,
            // url: `http://localhost:5000/api/subService/${editObj._id}`,
            data: obj
          };
          axios(config2)
            .then((res) => {
              getSubServices()
              setIsModalOpen(false)
              setIcon("")
            })
        })
        .catch((error) => {
          // console.log(error);
        });
    }
    else {
      let obj = {
        name: name,
        addedBy: activeUser.username,
        addedById: activeUser._id,
        description: description,
        isActive: isActive,
        service: selectedService.name,
        serviceId: selectedService._id,
        cost: amount,
      }
      var config2 = {
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_URL}/api/subService/${editObj._id}`,
        // url: `http://localhost:5000/api/subService/${editObj._id}`,
        data: obj
      };
      axios(config2)
        .then((res) => {
          getSubServices()
          setIsModalOpen(false)
          setIcon("")
        })
    }
  }

  useEffect(() => {
    getSubServices()
    getServices()
  }, [])

  const getSubServices = () => {
    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/subService`,
      // url: 'http://localhost:5000/api/subService',
    };

    axios(config)
      .then((res) => {
        let sortedData = res.data.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        setSubServices(sortedData)
      })
  }

  const getServices = () => {
    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/service`,
      // url: 'http://localhost:5000/api/service',
    };

    axios(config)
      .then((res) => {
        setServices(res.data)
        setSelectedService(res.data[0])
      })
  }

  return (
    <>
      <div className='d-flex justify-content-between w-100'>
        <h3>Sub Services</h3>
        {activeUser && activeUser.permissions[0].subServiceAdd &&
          <Button type="primary" onClick={showModal}>Add Sub Service</Button>
        }
      </div>
      <Table pagination={{ pageSize: 5 }} columns={columns} dataSource={subServices} />

      <Modal
        title={editObj ? `Edit ${editObj.name}` : "Add Sub Service"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={editObj ? updateService : addService}>
            {editObj ? "Update" : "Add"}
          </Button>
        ]}

      >
        <form>
          <div class="row" style={{ marginBottom: 15 }}>
            <div class="col">
              <label style={{ fontWeight: "bold", margin: 0 }}>Sub Service Name</label>
              <input onChange={(e) => setName(e.target.value)} value={name} type="text" class="form-control" placeholder="Service Name" />
            </div>
            <div class="col">
              <label style={{ fontWeight: "bold", margin: 0 }}>Description</label>
              <input onChange={(e) => setDescription(e.target.value)} value={description} type="text" class="form-control" placeholder="Description" />
            </div>
          </div>
          <div class="row" style={{ marginBottom: 15 }}>
            <div class="col">
              <label style={{ fontWeight: "bold", margin: 0 }}>Service</label>
              <select onChange={(e) => setSelectedService(JSON.parse(e.target.value))} type="text" class="form-control" placeholder="Service" >
                {services.map((a, i) => {
                  return (
                    <option value={JSON.stringify(a)} key={i}>{a.name}</option>
                  )
                })}
              </select>
            </div>
            <div class="col">
              <label style={{ fontWeight: "bold", margin: 0 }}>Amount</label>
              <input onChange={(e) => setAmount(e.target.value)} value={amount} type="number" class="form-control" placeholder="Amount" />
            </div>
          </div>
          <div class="form-check form-switch">
            <input onChange={(e) => setIsActive(e.target.value)} checked={isActive} class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
            <label class="form-check-label" for="flexSwitchCheckDefault">Is Active</label>
          </div>
        </form>
        <hr />
        <div className='icons'>
          <h6>Icon</h6>
          <div className='d-flex'>
            <input onChange={(e) => {
              getBase64(e.target.files[0])
              setIcon(e.target.files[0])
            }
            } type="file" />
            <img className='mt-1 mr-1' width={100} src={base} />
          </div>
        </div>
      </Modal>
    </>
  );
};