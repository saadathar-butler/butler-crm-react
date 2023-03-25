import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';

export default function Services() {
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
      title: 'Serial No.',
      dataIndex: 'id',
      key: 'id',
      width: '10%',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
      render: (_, record, i) => (
        i + 1
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ...getColumnSearchProps('description'),
      width: '30%',
    },
    {
      title: 'Service Icon',
      key: 'description',
      width: '10%',
      render: (_, record) => (
        <img width="50%" src={`${process.env.REACT_APP_BACKEND_URL}/${record.webImage}`} />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        activeUser && activeUser.permissions[0].serviceEdit &&
        <Space size="middle">
          <i onClick={() => showModal(record)} style={{ fontSize: 20, cursor: "pointer" }} class="fa fa-pencil" aria-hidden="true"></i>
        </Space>
      ),
    },
  ];

  let [name, setName] = useState("")
  let [description, setDescription] = useState("")
  let [isActive, setIsActive] = useState(true)
  let [webIcon, setWebIcon] = useState("")
  let [mobileIcon, setMobileIcon] = useState("")

  let [activeUser, setActiveUser] = useState("")

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"))
    setActiveUser(user)
  }, [])

  const addService = () => {
    if (webIcon && mobileIcon) {

      let images = new FormData()

      images.append("files", webIcon)
      images.append("files", mobileIcon)

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
            mobileImage: response.data[1],
            webImage: response.data[0]
          }
          var config2 = {
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/service`,
            // url: 'http://localhost:5000/api/service',
            data: obj
          };
          axios(config2)
            .then((res) => {
              getServices()
              setIsModalOpen(false)
              setWebIcon("")
              setMobileIcon("")
            })
        })
        .catch((error) => {
          // console.log(error);
        });
    } else if (webIcon) {

      let images = new FormData()

      images.append("files", webIcon)

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
            webImage: response.data[0]
          }
          var config2 = {
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/service`,
            // url: 'http://localhost:5000/api/service',
            data: obj
          };
          axios(config2)
            .then((res) => {
              getServices()
              setIsModalOpen(false)
              setWebIcon("")
              setMobileIcon("")
            })
        })
        .catch((error) => {
          // console.log(error);
        });
    } else if (mobileIcon) {

      let images = new FormData()

      images.append("files", mobileIcon)

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
            mobileImage: response.data[1],
          }
          var config2 = {
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/service`,
            // url: 'http://localhost:5000/api/service',
            data: obj
          };
          axios(config2)
            .then((res) => {
              getServices()
              setIsModalOpen(false)
              setWebIcon("")
              setMobileIcon("")
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
      }
      var config2 = {
        method: 'post',
        url: `${process.env.REACT_APP_BACKEND_URL}/api/service`,
        // url: 'http://localhost:5000/api/service',
        data: obj
      };
      axios(config2)
        .then((res) => {
          getServices()
          setIsModalOpen(false)
          setWebIcon("")
          setMobileIcon("")
        })
    }
  }

  const updateService = () => {
    if (webIcon && mobileIcon) {
      let images = new FormData()

      images.append("files", webIcon)
      images.append("files", mobileIcon)

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
            mobileImage: response.data[1],
            webImage: response.data[0],
          }
          var config2 = {
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/service/${editObj._id}`,
            // url: `http://localhost:5000/api/service/${editObj._id}`,
            data: obj
          };
          axios(config2)
            .then((res) => {
              getServices()
              setIsModalOpen(false)
              setWebIcon("")
              setMobileIcon("")
            })
        })
        .catch((error) => {
          // console.log(error);
        });
    }
    else if (webIcon) {
      let images = new FormData()

      images.append("files", webIcon)

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
            webImage: response.data[0],
          }
          var config2 = {
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/service/${editObj._id}`,
            // url: `http://localhost:5000/api/service/${editObj._id}`,
            data: obj
          };
          axios(config2)
            .then((res) => {
              getServices()
              setIsModalOpen(false)
              setWebIcon("")
              setMobileIcon("")
            })
        })
        .catch((error) => {
          // console.log(error);
        });
    } else if (mobileIcon) {
      let images = new FormData()

      images.append("files", mobileIcon)

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
            mobileImage: response.data[1],
          }
          var config2 = {
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/service/${editObj._id}`,
            // url: `http://localhost:5000/api/service/${editObj._id}`,
            data: obj
          };
          axios(config2)
            .then((res) => {
              getServices()
              setIsModalOpen(false)
              setWebIcon("")
              setMobileIcon("")
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
      }
      var config2 = {
        method: 'put',
        url: `${process.env.REACT_APP_BACKEND_URL}/api/service/${editObj._id}`,
        // url: `http://localhost:5000/api/service/${editObj._id}`,
        data: obj
      };
      axios(config2)
        .then((res) => {
          getServices()
          setIsModalOpen(false)
          setWebIcon("")
          setMobileIcon("")
        })
    }
  }

  let [services, setServices] = useState([])

  useEffect(() => {
    getServices()
  }, [])

  const getServices = () => {
    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/service`,
      // url: 'http://localhost:5000/api/service',
    };

    axios(config)
      .then((res) => {
        let sortedData = res.data.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        setServices(sortedData)
      })
  }

  let [editObj, setEditObj] = useState('')

  const [isModalOpen, setIsModalOpen] = useState(false);

  let [base1, setBase1] = useState("")
  let [base2, setBase2] = useState("")

  const showModal = (record) => {
    if (record.name) {
      setIsModalOpen(true);
      setEditObj(record)
      setName(record.name)
      setDescription(record.description)
      setIsActive(record.isActive)
      setBase1(`${process.env.REACT_APP_BACKEND_URL}/${record.webImage}`)
      setBase2(`${process.env.REACT_APP_BACKEND_URL}/${record.mobileImage}`)
    } else {
      setIsModalOpen(true);
      setEditObj("")
      setName("")
      setDescription("")
      setIsActive(true)
      setBase1("")
      setBase2("")
    }
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  function getBase64(file, name) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (name === "base1") {
        setBase1(reader.result)
      } else {
        setBase2(reader.result)
      }
    };
    reader.onerror = (error) => {
    };
  }


  return (
    <>
      <div className='d-flex justify-content-between w-100'>
        <h3>Services</h3>
        {activeUser && activeUser.permissions[0].serviceAdd &&
          <Button onClick={showModal} type="primary" >Add Service</Button>
        }
      </div>
      <Table pagination={{ pageSize: 5 }} columns={columns} dataSource={services} />

      <Modal
        title={editObj ? `Edit ${editObj.name}` : "Add Service"}
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
              <label style={{ fontWeight: "bold", margin: 0 }}>Service Name</label>
              <input onChange={(e) => setName(e.target.value)} value={name} type="text" class="form-control" placeholder="Service Name" />
            </div>
            <div class="col">
              <label style={{ fontWeight: "bold", margin: 0 }}>Description</label>
              <input onChange={(e) => setDescription(e.target.value)} value={description} type="text" class="form-control" placeholder="Description" />
            </div>
          </div>
          <div class="form-check form-switch">
            <input onChange={(e) => setIsActive(e.target.value)} checked={isActive} class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
            <label class="form-check-label" for="flexSwitchCheckDefault">Is Active</label>
          </div>
        </form>
        <hr />
        <div className='icons'>
          <h6>Web Icon</h6>
          <div className='d-flex'>
            <input onChange={(e) => {
              getBase64(e.target.files[0], "base1")
              setWebIcon(e.target.files[0])
            }
            } type="file" />
            <img className='mt-1 mr-1' width={100} src={base1} />
          </div>
        </div>
        <hr />
        <div className='icons'>
          <h6>Mobile Icon</h6>
          <div className='d-flex'>
            <input onChange={(e) => {
              getBase64(e.target.files[0], "base2")
              setMobileIcon(e.target.files[0])
            }
            } type="file" />
            <img className='mt-1 mr-1' width={100} src={base2} />
          </div>
        </div>
      </Modal>
    </>
  );
};