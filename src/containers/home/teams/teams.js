import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Modal, Select, Space, Table } from 'antd';
import Highlighter from 'react-highlight-words';
import axios from 'axios';
const data = [
  {
    id: '1',
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

export default function Teams() {
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
      dataIndex: '_id',
      key: '_id',
      width: '10%',
      sorter: (a, b) => a.id - b.id,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Team Name',
      dataIndex: 'teamName',
      key: 'teamName',
      width: '40%',
      ...getColumnSearchProps('teamName'),
    },
    {
      title: 'Workers',
      dataIndex: 'workers',
      key: 'workers',
      width: '40%',
      ...getColumnSearchProps('workers'),
    },
    {
      title: 'Action',
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <Space size="middle">
          <i onClick={() => showModal(record)} style={{ fontSize: 20, cursor: "pointer" }} class="fa fa-pencil" aria-hidden="true"></i>
        </Space>
      ),
    },
  ];

  let [workers, setWorkers] = useState([])

  let [teamName, setTeamName] = useState("")
  let [workerIds, setWorkerIds] = useState([])
  let [workersArr, setWorkersArr] = useState([])

  let [editObj, setEditObj] = useState("")

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal = (record) => {
    if (record.teamName) {
      setIsModalOpen(true);
      setTeamName(record.teamName)
      setWorkersArr(record.workers.split(", "))
      setEditObj(record)
    } else {
      setIsModalOpen(true);
    }
  };

  let [activeUser, setActiveUser] = useState("")

  useEffect(() => {
      let user = JSON.parse(localStorage.getItem("user"))
      setActiveUser(user)
  }, [])

  const addTeam = () => {
    let obj = {
      addedBy: activeUser.username,
      addedById: activeUser._id,
      teamName: teamName,
      workers: workersArr.join(", ")
    }

    var config = {
      method: 'post',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/team`,
      // url: 'http://localhost:5000/api/team',
      data: obj
    };
    axios(config)
      .then((res) => {
        getTeams()
        setTeamName("")
        setWorkerIds([])
        setWorkersArr([])
        setIsModalOpen(false)
      })
  }

  const updateTeam = () => {
    let obj = {
      addedBy: activeUser.username,
      addedById: activeUser._id,
      teamName: teamName,
      workers: workersArr.join(", ")
    }

    var config = {
      method: 'put',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/team/${editObj._id}`,
      // url: `http://localhost:5000/api/team/${editObj._id}`,
      data: obj
    };
    axios(config)
      .then((res) => {
        getTeams()
        setTeamName("")
        setWorkerIds([])
        setWorkersArr([])
        setIsModalOpen(false)
      })
  }

  useEffect(() => {
    getWorkers()
    getTeams()
  }, [])

  const getWorkers = () => {
    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/worker`,
      // url: 'http://localhost:5000/api/worker',
    };

    axios(config)
      .then((res) => {
        setWorkers(res.data)
      })
  }

  let [teams, setTeams] = useState([])

  const getTeams = () => {
    var config = {
      method: 'get',
      url: `${process.env.REACT_APP_BACKEND_URL}/api/team`,
      // url: 'http://localhost:5000/api/team',
    };

    axios(config)
      .then((res) => {
        let sortedData = res.data.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
        setTeams(sortedData)
      })
  }

  return (
    <>
      <div className='d-flex justify-content-between w-100'>
        <h3>Teams</h3>
        <Button onClick={showModal} type="primary">Add Team</Button>
      </div>
      <Table pagination={{ pageSize: 5 }} columns={columns} dataSource={teams} />

      <Modal
        style={{ top: 20 }}
        title={editObj ? "Update Team" : "Add New Team"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="submit" type="primary" onClick={handleCancel}>
            Close
          </Button>,
          <Button key="submit" type="primary" onClick={editObj ? updateTeam : addTeam}>
            {editObj ? "update" : "Add"}
          </Button>
        ]}
      >
        <form>
          <div class="row" style={{ marginBottom: 15 }}>
            <div class="col">
              <label style={{ fontWeight: "bold", margin: 0 }}>Team Name</label>
              <input onChange={(e) => setTeamName(e.target.value)} value={teamName} type="text" class="form-control" placeholder="Team Name" />
            </div>
            <div class="col">
              <label style={{ fontWeight: "bold", margin: 0 }}>Workers</label>
              <Select
                size='large'
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Select Workers"
                onChange={(e) => setWorkersArr(e)}
                value={workersArr}
              >
                {workers.map((a, i) => {
                  return (
                    <Select.Option key={a.name} />
                  )
                })}
              </Select>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};