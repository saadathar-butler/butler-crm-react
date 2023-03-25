import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SideDrawerCalls from '../../common/sideDrawers/sideDrawerCalls';
import { Button, Collapse, Select } from 'antd';
import axios from 'axios';
import { io } from 'socket.io-client'
import UploadComponent from '../finance/upload';
import { AudioRecorder } from 'react-audio-voice-recorder';

const { Panel } = Collapse;

// const socket = io('http://localhost:5000')
const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

export default function Calls(props) {

    const onChange = (key) => {
        // console.log(key);
    };

    let [leadNo, setLeadNo] = useState("")
    let [jobId, setJobId] = useState("")
    let [customerName, setCustomerName] = useState("")
    let [customerPhone, setcustomerPhone] = useState("")
    let [formName, setFormName] = useState("")
    let [dateCreated, setDateCreated] = useState("")
    let [status, setStatus] = useState("New")
    let [source, setSource] = useState("")
    let [amount, setAmount] = useState("")
    let [service, setService] = useState("")
    let [serviceId, setServiceId] = useState("")
    let [subService, setSubService] = useState("")
    let [subServiceId, setSubServiceId] = useState("")
    let [description, setDescription] = useState("")
    let [city, setCity] = useState("Karachi")
    let [residenceType, setResidenceType] = useState("")
    let [nearestLandmark, setNearestLandmark] = useState("")
    let [zone, setZone] = useState("")
    let [address, setAddress] = useState("")
    let [scheduleDate, setScheduleDate] = useState("")
    let [scheduleTo, setScheduleTo] = useState("Worker")
    let [followupDate, setFollowupdate] = useState("")
    let [workerObj, setWorkerObj] = useState("")
    let [vendorObj, setVendorObj] = useState([])
    let [slot, setSlot] = useState([])
    let [notes, setNotes] = useState([])
    let [workerNotes, setWorkerNotes] = useState([])
    let [extraImages, setExtraImages] = useState([])
    let [receipts, setReceipts] = useState([])
    let [voiceNotes, setVoiceNotes] = useState([])
    let [checkedInImage, setCheckedInImage] = useState("")
    let [checkedOutImage, setCheckedOutImage] = useState("")
    let [note, setNote] = useState("")
    let [workerNote, setWorkerNote] = useState("")

    let [services, setServices] = useState([])
    let [subServices, setSubServices] = useState([])
    let [selectedSubServices, setSelectedSubServices] = useState([])
    let [workers, setWorkers] = useState([])
    let [jobs, setJobs] = useState([])

    let [selectedWorkerId, setSelectedWorkerId] = useState("")
    let [helpers, setHelpers] = useState([])

    let [filteredSubServices, setFilteredSubServices] = useState([])

    useEffect(() => {
        getServices()
        getWorkers()
        getJobs()
    }, [])

    useEffect(() => {
        if (selectedItem && service) {
            let arr = subServices.filter((a) => a.serviceId === services.filter((b) => b.name === service)[0]._id)
            setSelectedSubServices(arr)
            // setSubService(arr[0].name)
            // setAmount(arr[0].cost)
        }
    }, [service])

    const getServices = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/service`,
            // url: 'http://localhost:5000/api/service'
        };

        axios(config)
            .then((res) => {
                setServices(res.data)
                setService(res.data[0].name)
                getSubServices(res.data[0].name, res.data)
            })
    }

    const getSubServices = (service, data) => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/subService`,
            // url: 'http://localhost:5000/api/subService'
        };

        axios(config)
            .then((res) => {
                setSubServices(res.data)
                if (props.fromLeads && props.editObj.service) {
                    let arr = res.data.filter((a) => a.serviceId === data.filter((b) => b.name === props.editObj.service)[0]._id)
                    console.log(arr)
                    setSelectedSubServices(arr)
                    setService(props.editObj.service)
                    // setSubService(arr[0].name)
                    // setAmount(arr[0].cost)
                } else {
                    let arr = res.data.filter((a) => a.serviceId === data.filter((b) => b.name === service)[0]._id)
                    setSelectedSubServices(arr)
                    setSubService(arr[0].name)
                    setAmount(arr[0].cost)
                }
            })
    }

    const getWorkers = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/worker`,
            // url: 'http://localhost:5000/api/worker'
        };

        axios(config)
            .then((res) => {
                let arr = res.data.filter((a) => a.isActive)
                setSelectedWorkerId(arr[0]._id)
                setWorkers(arr)
            })
    }

    const getJobs = () => {
        var config = {
            method: 'get',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/jobs`,
            // url: 'http://localhost:5000/api/jobs'
        };

        axios(config)
            .then((res) => {
                setJobs(res.data)
            })
    }

    function generateUID() {
        // I generate the UID from two parts here 
        // to ensure the random number provide enough bits.
        var firstPart = (Math.random() * 46656) | 0;
        var secondPart = (Math.random() * 46656) | 0;
        firstPart = ("000" + firstPart.toString(36)).slice(-3);
        secondPart = ("000" + secondPart.toString(36)).slice(-3);
        return firstPart + secondPart;
    }

    let [activeUser, setActiveUser] = useState("")

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        setActiveUser(user)
    }, [])

    useEffect(() => {
        if (!props.editObj) {
            setLeadNo(`L-${generateUID()}`)
            setJobId(`J-${generateUID()}`)
        }
    }, [])

    const addJob = () => {
        let workerObjj = workers.filter((a) => a._id === selectedWorkerId)[0]

        let obj = {
            leadNo: leadNo,
            jobId: jobId,
            service: service,
            serviceId: services.filter((b) => b.name === service).length ? services.filter((b) => b.name === service)[0]._id : "",
            subService: subService,
            subServiceId: subServices.filter((b) => b.name === subService).length ? subServices.filter((b) => b.name === subService)[0]._id : "",
            city: city,
            nearestLandmark: nearestLandmark,
            zone: zone,
            address: address,
            status: status,
            source: source,
            formName: formName,
            description: description,
            notes: notes,
            workerNotes: workerNotes,
            customerName: customerName,
            customerId: "123",
            customerRating: "",
            email: "",
            customerFeedback: "",
            customerPhone: customerPhone,
            workerObj: [
                workerObjj
            ],
            helpers: helpers,
            vendorObj: [
                {
                    vendorName: "",
                    vendorTeam: "",
                    vendorId: "",
                    vendorTeamId: "",
                    vendorRating: ""
                }
            ],
            images: [],
            voiceNotes: [],
            amount: amount,
            forAccounts: [],
            scheduledDate: scheduleDate,
            scheduledTo: scheduleTo,
            followUpDate: followupDate,
            dateContacted: "",
            slot: slot,
            history: [],
            checkedIn: false,
            checkedOut: false
        }

        var config = {
            method: 'post',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/jobs`,
            // url: 'http://localhost:5000/api/jobs',
            data: obj
        };
        axios(config)
            .then((res) => {
                newJob(obj)
                getJobs()
                setLeadNo(`L-${generateUID()}`)
                setJobId(`J-${generateUID()}`)
                setCustomerName("")
                setcustomerPhone("")
                setFormName("")
                setDateCreated("")
                setStatus("New")
                setSource("")
                setAmount("")
                setService("")
                setServiceId("")
                setSubService("")
                setSubServiceId("")
                setDescription("")
                setCity("Karachi")
                setResidenceType("")
                setNearestLandmark("")
                setZone("")
                setAddress("")
                setScheduleDate("")
                setScheduleTo("Worker")
                setFollowupdate("")
                setWorkerObj("")
                setHelpers([])
                setVendorObj("")
                setSlot([])
                setNotes([])
                setWorkerNotes([])
                setExtraImages([])
                setReceipts([])
                setVoiceNotes([])
                setCheckedInImage("")
                setCheckedOutImage("")
                setServices([])
                setSubServices([])
                setSelectedWorkerId("")
                if (props.fromLeads) {
                    props.handleCancel()
                    props.getJobs()
                }
            })

    }

    const updateJob = () => {
        let history = []
        if (props.fromLeads) {
            if (props.editObj.history) {
                history = [...props.editObj.history]
            }
        } else {
            if (selectedItem.history) {
                history = [...selectedItem.history]
            }
        }
        let hObj = { ...selectedItem }
        hObj.updatedBy = activeUser.username
        hObj.updatedByID = activeUser._id
        history.unshift(JSON.stringify(hObj))
        let workerObjj = workers.filter((a) => a._id === selectedWorkerId)[0]
        let obj = {
            leadNo: leadNo,
            jobId: jobId,
            service: service,
            serviceId: serviceId,
            subService: subService,
            subServiceId: subServiceId,
            city: city,
            nearestLandmark: nearestLandmark,
            zone: zone,
            address: address,
            status: status,
            source: source,
            formName: formName,
            description: description,
            notes: notes,
            workerNotes: workerNotes,
            customerName: customerName,
            customerId: "123",
            customerRating: "",
            email: "",
            customerFeedback: "",
            customerPhone: customerPhone,
            workerObj: [
                workerObjj
            ],
            helpers: helpers,
            vendorObj: [
                {
                    vendorName: "",
                    vendorTeam: "",
                    vendorId: "",
                    vendorTeamId: "",
                    vendorRating: ""
                }
            ],
            images: [],
            voiceNotes: [],
            amount: amount,
            forAccounts: [],
            scheduledDate: scheduleDate,
            scheduledTo: scheduleTo,
            followUpDate: followupDate,
            dateContacted: "",
            slot: slot,
            // history: history
        }

        var config = {
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/jobs/${props.fromLeads ? props.editObj._id : selectedItem._id}`,
            // url: `http://localhost:5000/api/jobs/${props.fromLeads ? props.editObj._id : selectedItem._id}`,
            data: obj
        };
        axios(config)
            .then((res) => {
                // const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)
                // socket.emit('updateJob', props.fromLeads ? props.editObj._id : selectedItem._id);
                // joinRoom(activeUser.id)
                sendMessage(props.fromLeads ? props.editObj._id : selectedItem._id, obj)
                getJobs()
                setLeadNo(`L-${generateUID()}`)
                setJobId(`J-${generateUID()}`)
                setCustomerName("")
                setcustomerPhone("")
                setFormName("")
                setDateCreated("")
                setStatus("New")
                setSource("")
                setAmount("")
                setService("")
                setServiceId("")
                setSubService("")
                setSubServiceId("")
                setDescription("")
                setCity("Karachi")
                setResidenceType("")
                setNearestLandmark("")
                setZone("")
                setAddress("")
                setScheduleDate("")
                setScheduleTo("Worker")
                setFollowupdate("")
                setWorkerObj("")
                setHelpers([])
                setVendorObj("")
                setSlot([])
                setNotes([])
                setWorkerNotes([])
                setExtraImages([])
                setReceipts([])
                setVoiceNotes([])
                setCheckedInImage("")
                setCheckedOutImage("")
                setServices([])
                setSubServices([])
                setSelectedWorkerId("")
                if (props.fromLeads) {
                    props.handleCancel()
                    props.getJobs()
                }
            })

    }

    useEffect(() => {
        joinRoom({ ...selectedItem, roomname: "abc" })
    }, [activeUser])

    const joinRoom = (id) => {
        socket.emit("join_room", id);
    };

    const sendMessage = (id, obj) => {

        socket.emit("send_message", { room: "abc", id: id, obj: obj });

    };

    const newJob = (obj) => {

        socket.emit("new_job", { room: "abc", obj: obj });

    };

    let [selectedItem, setSelectedItem] = useState("")

    let [_id, set_id] = useState()

    useEffect(() => {
        // if (props.fromLeads) {
        //     set_id(props.editObj.leadNo)
        // } else {
        //     console.log(selectedItem.jobId)
        //     set_id(selectedItem.leadNo)
        // }
    }, [selectedItem])

    useEffect(() => {
        socket.on("receive_message", (data) => {
            // if (props.fromLeads) {
            //     currentId = props.editObj.leadNo
            // } else {
            //     currentId = selectedItem.leadNo
            // }
            // alert(`Data Id: ${data._id} Selected Id: ${_id}`)
            // alert(`${data.leadNo} ${selectedItem.leadNo}`)
            // if (data.leadNo === selectedItem.leadNo) {
            //     if (props.fromLeads) {
            //         console.log(data)
            //         props.setEditObj(data)
            //     } else {
            //         setSelectedItem(data)
            //     }
            // }
            // console.log("aaa")
            getJobs()
        });
        // socket.on("standing", (data) => {
        //     console.log(data)
        // });

    }, [socket]);

    useEffect(() => {
        if (jobs.length && selectedItem) {
            let arr = jobs.filter((a) => a._id === selectedItem._id)
            setSelectedItem(arr[0])
        }
    }, [jobs])


    useEffect(() => {
        if (!props.fromLeads && selectedItem) {
            let workerObjj = {
                name: selectedItem.name,
                workerTeam: "",
                _id: selectedItem._id,
                workerTeamId: "",
                workerRating: ""
            }
            setLeadNo(selectedItem.leadNo)
            setJobId(selectedItem.jobId)
            setCustomerName(selectedItem.customerName)
            setcustomerPhone(selectedItem.customerPhone)
            setFormName(selectedItem.formName)
            setDateCreated(selectedItem.dateCreated)
            setStatus(selectedItem.status)
            setSource(selectedItem.source)
            setAmount(selectedItem.amount)
            setService(selectedItem.service)
            setServiceId(selectedItem.serviceId)
            // alert(selectedItem.subService)
            setSubService(selectedItem.subService)
            setSubServiceId(selectedItem.subServiceId)
            setDescription(selectedItem.description)
            setCity(selectedItem.city)
            setResidenceType(selectedItem.residenceType)
            setNearestLandmark(selectedItem.nearestLandmark)
            setZone(selectedItem.zone)
            setAddress(selectedItem.address)
            setScheduleDate(selectedItem.scheduledDate ? selectedItem.scheduledDate : "")
            setScheduleTo(selectedItem.scheduleTo)
            setFollowupdate(selectedItem.followUpDate)
            setWorkerObj(selectedItem.workerObj)
            setVendorObj(selectedItem.vendorObj)
            setSlot(selectedItem.slot)
            setNotes(selectedItem.notes)
            setWorkerNotes(selectedItem.workerNotes)
            setExtraImages(selectedItem.extraImages)
            setCheckedInImage(selectedItem.checkedInImage)
            setCheckedOutImage(selectedItem.checkedOutImage)
            setSelectedWorkerId(selectedItem.workerObj && selectedItem.workerObj[0] ? selectedItem.workerObj[0]._id : selectedWorkerId)
            setHelpers(selectedItem.helpers)
            if (selectedItem.forAccounts && selectedItem.forAccounts.length && selectedItem.forAccounts[0].attachments && selectedItem.forAccounts[0].attachments.length) {
                setReceipts(selectedItem.forAccounts[0].attachments)
            }
            if (selectedItem.voiceNotes && selectedItem.voiceNotes.length) {
                setVoiceNotes(selectedItem.voiceNotes)
            }
        }
        else if (!props.fromLeads && !selectedItem) {
            setLeadNo(`L-${generateUID()}`)
            setJobId(`J-${generateUID()}`)
            setCustomerName("")
            setcustomerPhone("")
            setFormName("")
            setDateCreated("")
            setStatus("New")
            setSource("")
            setAmount("")
            setService("")
            setServiceId("")
            setSubService("")
            setSubServiceId("")
            setDescription("")
            setCity("Karachi")
            setResidenceType("")
            setNearestLandmark("")
            setZone("")
            setAddress("")
            setScheduleDate("")
            setScheduleTo("Worker")
            setFollowupdate("")
            setWorkerObj("")
            setHelpers([])
            setVendorObj("")
            setSlot([])
            setNotes([])
            setWorkerNotes([])
            setExtraImages([])
            setCheckedInImage("")
            setCheckedOutImage("")
            setReceipts([])
            setVoiceNotes([])
            setSelectedWorkerId("")
        }
        else {
            if (props.editObj) {
                let workerObjj = {
                    name: props.editObj.name,
                    workerTeam: "",
                    _id: props.editObj._id,
                    workerTeamId: "",
                    workerRating: ""
                }
                // alert(JSON.stringify(props.editObj.workerObj[0]._id))
                setLeadNo(props.editObj.leadNo)
                setJobId(props.editObj.jobId)
                setCustomerName(props.editObj.customerName)
                setcustomerPhone(props.editObj.customerPhone)
                setFormName(props.editObj.formName)
                setDateCreated(props.editObj.dateCreated)
                setStatus(props.editObj.status)
                setSource(props.editObj.source)
                setAmount(props.editObj.amount)
                setService(props.editObj.service)
                setServiceId(props.editObj.serviceId)
                setSubService(props.editObj.subService)
                setSubServiceId(props.editObj.subServiceId)
                setDescription(props.editObj.description)
                setCity(props.editObj.city)
                setResidenceType(props.editObj.residenceType)
                setNearestLandmark(props.editObj.nearestLandmark)
                setZone(props.editObj.zone)
                setAddress(props.editObj.address)
                setScheduleDate(props.editObj.scheduledDate)
                setScheduleTo(props.editObj.scheduleTo)
                setFollowupdate(props.editObj.followUpDate)
                setWorkerObj(props.editObj.workerObj)
                setHelpers(props.editObj.helpers)
                setVendorObj(props.editObj.vendorObj)
                setSlot(props.editObj.slot)
                setNotes(props.editObj.notes)
                setWorkerNotes(props.editObj.workerNotes)
                setExtraImages(props.editObj.extraImages)
                setCheckedInImage(props.editObj.checkedInImage)
                setCheckedOutImage(props.editObj.checkedOutImage)
                setSelectedWorkerId(props.editObj.workerObj[0] ? props.editObj.workerObj[0]._id : selectedWorkerId)
                if (props.editObj.forAccounts && props.editObj.forAccounts.length && props.editObj.forAccounts[0].attachments && props.editObj.forAccounts[0].attachments.length) {
                    setReceipts(props.editObj.forAccounts[0].attachments)
                }
                if (props.editObj.voiceNotes && props.editObj.voiceNotes.length) {
                    setVoiceNotes(props.editObj.voiceNotes)
                }
            }
        }
    }, [selectedItem, props.editObj, workers])

    const closeJob = () => {
        let obj = {
            jobClosed: true,
            jobClosedDate: new Date(),
            jobClosedBy: activeUser.username,
            jobClosedById: activeUser._id,
        }

        var config = {
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/jobs/${props.fromLeads ? props.editObj._id : selectedItem._id}`,
            // url: `http://localhost:5000/api/jobs/${props.fromLeads ? props.editObj._id : selectedItem._id}`,
            data: obj
        };
        axios(config)
            .then((res) => {
                sendMessage(props.fromLeads ? props.editObj._id : selectedItem._id)
                getJobs()
                if (props.fromLeads) {
                    props.handleCancel()
                    props.getJobs()
                }
            })
    }

    const reopenJob = () => {
        let obj = {
            jobClosed: false,
            jobClosedDate: "",
        }

        var config = {
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/jobs/${props.fromLeads ? props.editObj._id : selectedItem._id}`,
            // url: `http://localhost:5000/api/jobs/${props.fromLeads ? props.editObj._id : selectedItem._id}`,
            data: obj
        };
        axios(config)
            .then((res) => {
                sendMessage(props.fromLeads ? props.editObj._id : selectedItem._id)
                props.handleCancel()
                getJobs()
            })
    }

    let [attachments, setAttachments] = useState([])

    let [material, setMaterial] = useState(0)
    let [outsourcePaid, setOutsourcePaid] = useState(0)
    let [fuelTransportation, setFuelTransportation] = useState(0)
    let [cardRepair, setCardRepair] = useState(0)
    let [gasRefill, setGasRefill] = useState(0)
    let [workshopCharges, setWorkshopCharges] = useState(0)
    let [machineryRent, setMachineryRent] = useState(0)
    let [netAmount, setNetAmount] = useState(0)

    const updateFinance = () => {

        // let images = new FormData()
        // for (let i = 0; i < attachments.length; i++) {
        //     images.append("files", attachments[i].originFileObj)
        // }
        // var config = {
        //     method: 'post',
        //     url: `${process.env.REACT_APP_BACKEND_URL}/uploadMultiple`,
        //     // url: 'http://localhost:5000/uploadMultiple',
        //     data: images
        // };
        // axios(config)
        //     .then((response) => {
        let obj = {
            enteredBy: activeUser.username,
            userId: activeUser._id,
            material: material,
            outsourcePaid: outsourcePaid,
            fuelTransportation: fuelTransportation,
            cardRepair: cardRepair,
            gasRefill: gasRefill,
            workshopCharges: workshopCharges,
            machineryRent: machineryRent,
            netAmount: Number(amount) - Number(Number(material) + Number(outsourcePaid) + Number(fuelTransportation) + Number(cardRepair) + Number(gasRefill) + Number(workshopCharges) + Number(machineryRent)),
            // attachments: response.data,
            notes: notes,
            workerNotes: workerNotes,
        }

        var config2 = {
            method: 'put',
            url: `${process.env.REACT_APP_BACKEND_URL}/api/jobs/${props.fromLeads ? props.editObj._id : selectedItem._id}`,
            // url: `http://localhost:5000/api/jobs/${props.fromLeads ? props.editObj._id : selectedItem._id}`,
            data: obj
        };
        axios(config2)
            .then((res) => {
                sendMessage(props.fromLeads ? props.editObj._id : selectedItem._id)
                getJobs()
                props.handleCancel()
            })
        // })
        // .catch((error) => {
        //     // console.log(error);
        // });
    }

    let [preSlots, setPreSlots] = useState([])

    useEffect(() => {
        if (scheduleDate && selectedWorkerId) {
            if (props.fromLeads) {
                let arr = jobs.filter((a) => `${new Date(a.scheduledDate).getDate()}${new Date(a.scheduledDate).getMonth()}${new Date(a.scheduledDate).getFullYear()}` === `${new Date(scheduleDate).getDate()}${new Date(scheduleDate).getMonth()}${new Date(scheduleDate).getFullYear()}`)
                let arr2 = arr.filter((a) => a.workerObj[0] && a.workerObj[0]._id === selectedWorkerId)
                let slotss = []
                for (let i = 0; i < arr2.length; i++) {
                    if (arr2[i].leadNo !== props.editObj.leadNo) {
                        for (let j = 0; j < arr2[i].slot.length; j++) {
                            if (arr2[i].slot[j]) {
                                slotss.push(arr2[i].slot[j])
                            }
                        }
                    }
                }
                setPreSlots(slotss)
            } else {
                let arr = jobs.filter((a) => `${new Date(a.scheduledDate).getDate()}${new Date(a.scheduledDate).getMonth()}${new Date(a.scheduledDate).getFullYear()}` === `${new Date(scheduleDate).getDate()}${new Date(scheduleDate).getMonth()}${new Date(scheduleDate).getFullYear()}`)
                let arr2 = arr.filter((a) => a.workerObj[0] && a.workerObj[0]._id === selectedWorkerId)
                let slotss = []
                for (let i = 0; i < arr2.length; i++) {
                    if (arr2[i].leadNo !== selectedItem.leadNo) {
                        for (let j = 0; j < arr2[i].slot.length; j++) {
                            if (arr2[i].slot[j]) {
                                slotss.push(arr2[i].slot[j])
                            }
                        }
                    }
                }
                setPreSlots(slotss)
            }
            // console.log(selectedWorkerId, scheduleDate, arr2, slotss)
        } else {
            setPreSlots([])
        }
    }, [selectedWorkerId, scheduleDate, selectedItem, props.editObj])

    const addAudioElement = (blob) => {
        const url = URL.revokeObjectURL(blob);
        const audio = document.createElement("audio");
        audio.src = url;
        audio.controls = true;
        // document.body.appendChild(audio);
        blob.name = "recording" + ".m4a"
        console.log(blob)

        var data = new FormData();
        data.append('files', blob)

        var config = {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            //   url: 'http://192.168.18.228:5000/uploadmultiple/',
            url: 'https://butlernode-production.up.railway.app/uploadmultiple/',
            // url: 'http://192.168.3.107:5000/uploadmultiple/',
            data,
        };

        axios(config)
            .then((res) => {
                let obj = {
                    voiceNotes: voiceNotes
                }

                let obj2 = {
                    voiceUserName: activeUser.username,
                    voiceUserId: activeUser._id,
                    voiceNoteUrl: res.data[0],
                }

                obj.voiceNotes.push(obj2)

                var config2 = {
                    method: 'put',
                    url: `${process.env.REACT_APP_BACKEND_URL}/api/jobs/${props.fromLeads ? props.editObj._id : selectedItem._id}`,
                    // url: `http://localhost:5000/api/jobs/${props.fromLeads ? props.editObj._id : selectedItem._id}`,
                    data: obj
                };
                axios(config2)
                    .then((res) => {
                        sendMessage(props.fromLeads ? props.editObj._id : selectedItem._id)
                        getJobs()
                        console.log(voiceNotes)
                        console.log(res.data)
                    })
            })
            .catch((e) => {
                console.log(e, "error")
            })
    };

    function getTimeDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      }      

    return (
        <div className='d-flex'>
            {!props.fromLeads &&
                <div className='sideDrawerCalls'>
                    <SideDrawerCalls socket={socket} selectedItem={selectedItem} setSelectedItem={setSelectedItem} newJobs={jobs.filter((a) => !a.jobClosed).sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime())} />
                </div>
            }
            <div className='w-100 p-3'>
                <div className="card cardView p-3" >
                    <Collapse defaultActiveKey={["1", '2', "3", "4", "5", "6"]} onChange={onChange}>
                        <Panel header="Lead Information" key="1">
                            <form>
                                <div className="row" style={{ marginBottom: 15 }}>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Lead No.</label>
                                        <input disabled={true} type="text" className="form-control" placeholder="Lead No." value={leadNo} />
                                    </div>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Job Id</label>
                                        <input disabled={true} type="text" className="form-control" placeholder="Job Id" value={jobId} />
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: 15 }}>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Customer Name</label>
                                        <input onChange={(e) => setCustomerName(e.target.value)} value={customerName} type="text" className="form-control" placeholder="Customer Name" />
                                    </div>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Customer Number</label>
                                        <input onChange={(e) => setcustomerPhone(e.target.value)} value={customerPhone} type="number" className="form-control" placeholder="Customer Number" />
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: 15 }}>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Form Name</label>
                                        <input onChange={(e) => setFormName(e.target.value)} value={formName} type="text" className="form-control" placeholder="Form Name" />
                                    </div>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Date Created</label>
                                        <input disabled={true} type="text" className="form-control" placeholder="Date Created" value={dateCreated} />
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: 15 }}>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Status</label>
                                        <select onChange={(e) => setStatus(e.target.value)} value={status} type="text" className="form-control" placeholder="Status" >
                                            <option>New</option>
                                            <option>Not Responded</option>
                                            <option>Only Info</option>
                                            <option>Scheduled</option>
                                            <option>On Hold</option>
                                            <option>Cancelled</option>
                                            <option>Rejected</option>
                                            <option>Fake</option>
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Source</label>
                                        {/* <input type="text" onChange={(e) => setSource(e.target.value)} value={source} className="form-control" placeholder="Source" /> */}
                                        <select onChange={(e) => setSource(e.target.value)} value={source} type="text" className="form-control" placeholder="Status" >
                                            <option>Old Customer</option>
                                            <option>Reference</option>
                                            <option>Facebook</option>
                                            <option>Whatsapp</option>
                                            <option>Instagram</option>
                                            <option>Website</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: 15 }}>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Service</label>
                                        <select onChange={(e) => {
                                            setService(e.target.value)
                                            // console.log(services.filter((a) => a.name === e.target.value)[0]._id)
                                            if (subService) {
                                                let arr = subServices.filter((a) => a.serviceId === services.filter((b) => b.name === e.target.value)[0]._id)
                                                setSelectedSubServices(arr)
                                                setSubService(arr[0].name)
                                                setAmount(arr[0].cost ? arr[0].cost : "")
                                            }
                                        }
                                        } value={service} type="text" className="form-control" placeholder="Service" >
                                            {services.map((a, i) => {
                                                return (
                                                    <option value={a.name}>{a.name}</option>
                                                )
                                            })}
                                        </select>
                                    </div><div className="col-6">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Sub Service</label>
                                        <select onChange={(e) => {
                                            setSubService(e.target.value)
                                            let obj = subServices.filter((a) => a.name === e.target.value)[0]
                                            setAmount(obj.cost ? obj.cost : 0)
                                        }} value={subService} type="text" className="form-control" placeholder="Sub Service" >
                                            {selectedSubServices.map((a, i) => {
                                                return (
                                                    <option value={a.name}>{a.name}</option>
                                                )
                                            })}
                                        </select>
                                    </div>
                                    {/* <div className="col-6">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Sub Service</label>
                                        <select onChange={(e) => {
                                            setSubService(e.target.value)
                                            let obj = subServices.filter((a) => a.name === e.target.value)[0]
                                            setAmount(obj.cost ? obj.cost : 0)
                                        }} value={subService} type="text" className="form-control" placeholder="Sub Service" >
                                            {selectedSubServices.map((a, i) => {
                                                return (
                                                    <option value={a.name}>{a.name}</option>
                                                )
                                            })}
                                        </select>
                                    </div> */}
                                </div>
                                <div className="row" style={{ marginBottom: 15 }}>
                                    <div className="col-6">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Amount</label>
                                        <input type="number" onChange={(e) => setAmount(e.target.value)} value={amount} className="form-control" placeholder="Amount" />
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: 15 }}>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Description</label>
                                        <textarea onChange={(e) => setDescription(e.target.value)} value={description} type="text" className="form-control" placeholder="Description" />
                                    </div>
                                </div>
                            </form>
                        </Panel>
                        <Panel header="Address Informatiion" key="2">
                            <form>
                                <div className="row" style={{ marginBottom: 15 }}>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>City</label>
                                        <input disabled onChange={(e) => setCity(e.target.value)} value={city} type="text" className="form-control" placeholder="City" />
                                    </div>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Residence Type</label>
                                        {/* <input onChange={(e) => setResidenceType(e.target.value)} value={residenceType} type="text" className="form-control" placeholder="Residence Type" /> */}
                                        <select onChange={(e) => setResidenceType(e.target.value)} value={residenceType} type="text" className="form-control" placeholder="Status" >
                                            <option>House</option>
                                            <option>Flat</option>
                                            <option>Office</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: 15 }}>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Nearest Landmark</label>
                                        <input onChange={(e) => setNearestLandmark(e.target.value)} value={nearestLandmark} type="text" className="form-control" placeholder="Nearest Landmark" />
                                    </div>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Zone</label>
                                        {/* <input onChange={(e) => setZone(e.target.value)} value={zone} type="text" className="form-control" placeholder="Zone" /> */}
                                        <select onChange={(e) => setZone(e.target.value)} value={zone} type="text" className="form-control" placeholder="Status" >
                                            <option>Scheme 33</option>
                                            <option>Malir</option>
                                            <option>East</option>
                                            <option>West</option>
                                            <option>South</option>
                                            <option>Central</option>
                                            <option>Maymar</option>
                                            <option>Bahria</option>
                                            <option>Gulshan e Hadeed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: 15 }}>
                                    <div className="col">
                                        <label style={{ fontWeight: "bold", margin: 0 }}>Address</label>
                                        <textarea onChange={(e) => setAddress(e.target.value)} value={address} type="text" className="form-control" placeholder="Address" />
                                    </div>
                                </div>
                            </form>
                        </Panel>
                        <Panel header="Schedule" key="3">
                            <h6>Schedule to Worker/Vendor</h6>
                            <div className="row" style={{ marginBottom: 15 }}>
                                <div className="col">
                                    <label style={{ fontWeight: "bold", margin: 0 }}>Schedule Date</label>
                                    <input onChange={(e) => setScheduleDate(e.target.value)} value={scheduleDate} type="date" className="form-control" />
                                </div>
                                <div className="col">
                                    <label style={{ fontWeight: "bold", margin: 0 }}>Schedule To</label>
                                    <select onChange={(e) => setScheduleTo(e.target.value)} value={scheduleTo} type="text" className="form-control" >
                                        <option>Worker</option>
                                        {/* <option>Vendor</option> */}
                                    </select>
                                </div>
                            </div>
                            <div className="row" style={{ marginBottom: 15 }}>
                                <div className="col-6">
                                    <label style={{ fontWeight: "bold", margin: 0 }}>Assign Worker</label>
                                    <select onChange={(e) => setSelectedWorkerId(e.target.value)} value={selectedWorkerId} type="text" className="form-control" >
                                        {workers.map((a, i) => {
                                            return (
                                                <option value={a._id}>{a.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label style={{ fontWeight: "bold", margin: 0 }}>Helpers</label>
                                    <Select
                                        mode="multiple"
                                        size='large'
                                        placeholder="Please select"
                                        onChange={(e) => setHelpers(e)}
                                        style={{ width: '100%' }}
                                        value={helpers}
                                    >
                                        {workers.map((a, i) => {
                                            return (
                                                a._id !== selectedWorkerId &&
                                                <option value={a.name}>{a.name}</option>
                                            )
                                        })}
                                    </Select>
                                </div>
                            </div>
                            <div className="col-6 d-flex flex-wrap justify">
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "11am - 12pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "11am - 12pm")[0]) {
                                            slotss.splice(slotss.indexOf("11am - 12pm"), 1)
                                        } else {
                                            slotss.push("11am - 12pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "11am - 12pm")[0] ? "green" : preSlots.filter((a) => a === "11am - 12pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "11am - 12pm")[0] ? "not-allowed" : "pointer" }}>11am - 12pm</span>
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "12pm - 01pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "12pm - 01pm")[0]) {
                                            slotss.splice(slotss.indexOf("12pm - 01pm"), 1)
                                        } else {
                                            slotss.push("12pm - 01pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "12pm - 01pm")[0] ? "green" : preSlots.filter((a) => a === "12pm - 01pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "12pm - 01pm")[0] ? "not-allowed" : "pointer" }}>12pm - 01pm</span>
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "01pm - 02pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "01pm - 02pm")[0]) {
                                            slotss.splice(slotss.indexOf("01pm - 02pm"), 1)
                                        } else {
                                            slotss.push("01pm - 02pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "01pm - 02pm")[0] ? "green" : preSlots.filter((a) => a === "01pm - 02pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "01pm - 02pm")[0] ? "not-allowed" : "pointer" }}>01pm - 02pm</span>
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "02pm - 03pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "02pm - 03pm")[0]) {
                                            slotss.splice(slotss.indexOf("02pm - 03pm"), 1)
                                        } else {
                                            slotss.push("02pm - 03pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "02pm - 03pm")[0] ? "green" : preSlots.filter((a) => a === "02pm - 03pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "02pm - 03pm")[0] ? "not-allowed" : "pointer" }}>02pm - 03pm</span>
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "03pm - 04pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "03pm - 04pm")[0]) {
                                            slotss.splice(slotss.indexOf("03pm - 04pm"), 1)
                                        } else {
                                            slotss.push("03pm - 04pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "03pm - 04pm")[0] ? "green" : preSlots.filter((a) => a === "03pm - 04pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "03pm - 04pm")[0] ? "not-allowed" : "pointer" }}>03pm - 04pm</span>
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "04pm - 05pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "04pm - 05pm")[0]) {
                                            slotss.splice(slotss.indexOf("04pm - 05pm"), 1)
                                        } else {
                                            slotss.push("04pm - 05pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "04pm - 05pm")[0] ? "green" : preSlots.filter((a) => a === "04pm - 05pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "04pm - 05pm")[0] ? "not-allowed" : "pointer" }}>04pm - 05pm</span>
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "05pm - 06pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "05pm - 06pm")[0]) {
                                            slotss.splice(slotss.indexOf("05pm - 06pm"), 1)
                                        } else {
                                            slotss.push("05pm - 06pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "05pm - 06pm")[0] ? "green" : preSlots.filter((a) => a === "05pm - 06pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "05pm - 06pm")[0] ? "not-allowed" : "pointer" }}>05pm - 06pm</span>
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "06pm - 07pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "06pm - 07pm")[0]) {
                                            slotss.splice(slotss.indexOf("06pm - 07pm"), 1)
                                        } else {
                                            slotss.push("06pm - 07pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "06pm - 07pm")[0] ? "green" : preSlots.filter((a) => a === "06pm - 07pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "06pm - 07pm")[0] ? "not-allowed" : "pointer" }}>06pm - 07pm</span>
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "07pm - 08pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "07pm - 08pm")[0]) {
                                            slotss.splice(slotss.indexOf("07pm - 08pm"), 1)
                                        } else {
                                            slotss.push("07pm - 08pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "07pm - 08pm")[0] ? "green" : preSlots.filter((a) => a === "07pm - 08pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "07pm - 08pm")[0] ? "not-allowed" : "pointer" }}>07pm - 08pm</span>
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "08pm - 09pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "08pm - 09pm")[0]) {
                                            slotss.splice(slotss.indexOf("08pm - 09pm"), 1)
                                        } else {
                                            slotss.push("08pm - 09pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "08pm - 09pm")[0] ? "green" : preSlots.filter((a) => a === "08pm - 09pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "08pm - 09pm")[0] ? "not-allowed" : "pointer" }}>08pm - 09pm</span>
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "09pm - 10pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "09pm - 10pm")[0]) {
                                            slotss.splice(slotss.indexOf("09pm - 10pm"), 1)
                                        } else {
                                            slotss.push("09pm - 10pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "09pm - 10pm")[0] ? "green" : preSlots.filter((a) => a === "09pm - 10pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "09pm - 10pm")[0] ? "not-allowed" : "pointer" }}>09pm - 10pm</span>
                                <span onClick={() => {
                                    if (preSlots.filter((a) => a === "10pm - 11pm")[0]) {
                                        alert("slot is booked")
                                    } else {

                                        let slotss = [...slot]
                                        if (slotss.filter(a => a === "10pm - 11pm")[0]) {
                                            slotss.splice(slotss.indexOf("10pm - 11pm"), 1)
                                        } else {
                                            slotss.push("10pm - 11pm")
                                        }
                                        setSlot(slotss)
                                    }
                                }} className="badge badge-light h-50 d-flex align-items-center justify-content-center" style={{ backgroundColor: slot.filter((a) => a === "10pm - 11pm")[0] ? "green" : preSlots.filter((a) => a === "10pm - 11pm")[0] ? "red" : "lightgray", width: 100, cursor: "pointer", marginRight: 5, marginBottom: 5, cursor: preSlots.filter((a) => a === "10pm - 11pm")[0] ? "not-allowed" : "pointer" }}>10pm - 11pm</span>
                            </div>

                            <hr />

                            <h6>Schedule to Follow up</h6>
                            <div className="row" style={{ marginBottom: 15 }}>
                                <div className="col-6">
                                    <label style={{ fontWeight: "bold", margin: 0 }}>Schedule Date</label>
                                    <input disabled={scheduleDate} onChange={(e) => setFollowupdate(e.target.value)} value={followupDate} type="date" className="form-control" />
                                </div>
                            </div>
                        </Panel>
                        <Panel header="Notes" key="4">
                            <div className='d-flex'>
                                <div className='col'>
                                    <ol>
                                        {notes.map((a, i) => {
                                            return (
                                                <li key={i}>{a}</li>
                                            )
                                        })}
                                    </ol>

                                    <div className="row" style={{ marginBottom: 15 }}>
                                        <div className="col">
                                            <label style={{ fontWeight: "bold", margin: 0 }}>Add a CRM user note</label>
                                            <textarea onChange={(e) => setNote(e.target.value)} value={note} rows={3} type="text" className="form-control" placeholder="Add a note" />
                                        </div>
                                    </div>
                                    <button onClick={() => {
                                        let arr = [...notes]
                                        arr.push(`${activeUser.username} Added on ${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()} | ${new Date().getHours()}:${new Date().getMinutes()} : ${note}`)
                                        setNotes(arr)
                                        setNote("")
                                    }} type="button" className="btn btn-primary">Add</button>
                                </div>
                                <div className='col'>
                                    <ol>
                                        {workerNotes.map((a, i) => {
                                            return (
                                                <li key={i}>{a}</li>
                                            )
                                        })}
                                    </ol>

                                    <div className="row" style={{ marginBottom: 15 }}>
                                        <div className="col">
                                            <label style={{ fontWeight: "bold", margin: 0 }}>Add a worker note</label>
                                            <textarea onChange={(e) => setWorkerNote(e.target.value)} value={workerNote} rows={3} type="text" className="form-control" placeholder="Add a note" />
                                        </div>
                                    </div>
                                    <button onClick={() => {
                                        let arr = [...workerNotes]
                                        arr.push(`${activeUser.username} Added on ${new Date().getDate()}-${new Date().getMonth() + 1}-${new Date().getFullYear()} | ${new Date().getHours()}:${new Date().getMinutes()} : ${workerNote}`)
                                        setWorkerNotes(arr)
                                        setWorkerNote("")
                                    }} type="button" className="btn btn-primary">Add</button>
                                </div>
                            </div>
                        </Panel>
                        <Panel header="Attachments" key="5">
                            <h6>Voice Notes</h6>
                            <div className='d-flex flex-column'>
                                {voiceNotes.map((a, i) => {
                                    return (
                                        <div style={{ display: "flex", flexDirection: "column", marginTop: 10 }}>
                                            <label style={{ marginBottom: 5, marginLeft: 10, fontWeight: "bold" }}>{a.voiceUserName} | {getTimeDate(new Date(a.voiceNoteDate))}</label>
                                            <audio controls>
                                                <source src={`https://butlernode-production.up.railway.app/${a.voiceNoteUrl}`} type="audio/ogg" />
                                            </audio>
                                        </div>
                                    )
                                })}
                                <hr />
                                <AudioRecorder onRecordingComplete={addAudioElement} />
                            </div>
                            <hr />
                            <h6>Extra Images</h6>
                            <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
                                {extraImages.map((a, i) => {
                                    return (
                                        <div>
                                            <img style={{ marginRight: 10 }} width={100} src={`${process.env.REACT_APP_BACKEND_URL}/${a}`} />
                                        </div>
                                    )
                                })}
                            </div>
                            <hr />
                            <h6>Checked In | Checked Out Images</h6>
                            <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label>Checked In</label>
                                    <img style={{ marginRight: 10 }} width={100} src={`${process.env.REACT_APP_BACKEND_URL}/${checkedInImage}`} />
                                </div>
                                <div style={{ display: "flex", flexDirection: "column" }}>
                                    <label>Checked Out</label>
                                    <img style={{ marginRight: 10 }} width={100} src={`${process.env.REACT_APP_BACKEND_URL}/${checkedOutImage}`} />
                                </div>
                            </div>
                            <hr />
                            <h6>Receipts</h6>
                            <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
                                {receipts.map((a, i) => {
                                    return (
                                        <div>
                                            <img style={{ marginRight: 10 }} width={100} src={`${process.env.REACT_APP_BACKEND_URL}/${a}`} />
                                        </div>
                                    )
                                })}
                            </div>
                        </Panel>

                        {props.fromFinance &&
                            <Panel header="Accounts" key="6">
                                <form>
                                    <div className="row" style={{ marginBottom: 15 }}>
                                        <div className="col">
                                            <label style={{ fontWeight: "bold", margin: 0 }}>Material Cost</label>
                                            <input onChange={(e) => setMaterial(e.target.value)} value={material} type="number" className="form-control" placeholder="Material Cost" />
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: "bold", margin: 0 }}>Outsource Paid</label>
                                            <input onChange={(e) => setOutsourcePaid(e.target.value)} value={outsourcePaid} type="number" className="form-control" placeholder="Outsource Paid" />
                                        </div>
                                    </div>
                                    <div className="row" style={{ marginBottom: 15 }}>
                                        <div className="col">
                                            <label style={{ fontWeight: "bold", margin: 0 }}>Fuel Transportation</label>
                                            <input onChange={(e) => setFuelTransportation(e.target.value)} value={fuelTransportation} type="number" className="form-control" placeholder="Fuel Transportation" />
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: "bold", margin: 0 }}>Card Repair</label>
                                            <input onChange={(e) => setCardRepair(e.target.value)} value={cardRepair} type="number" className="form-control" placeholder="Card Repair" />
                                        </div>
                                    </div>
                                    <div className="row" style={{ marginBottom: 15 }}>
                                        <div className="col">
                                            <label style={{ fontWeight: "bold", margin: 0 }}>Gas Refill</label>
                                            <input onChange={(e) => setGasRefill(e.target.value)} value={gasRefill} type="number" className="form-control" placeholder="Gas Refill" />
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: "bold", margin: 0 }}>Workshop Charges</label>
                                            <input onChange={(e) => setWorkshopCharges(e.target.value)} value={workshopCharges} type="number" className="form-control" placeholder="Workshop Charges" />
                                        </div>
                                    </div>
                                    <div className="row" style={{ marginBottom: 15 }}>
                                        <div className="col">
                                            <label style={{ fontWeight: "bold", margin: 0 }}>Machinery Rent</label>
                                            <input onChange={(e) => setMachineryRent(e.target.value)} value={machineryRent} type="number" className="form-control" placeholder="Machinery Rent" />
                                        </div>
                                        <div className="col">
                                            <label style={{ fontWeight: "bold", margin: 0 }}>Amount</label>
                                            <input disabled={true} type="number" value={amount} className="form-control" placeholder="Amount" />
                                        </div>
                                    </div>
                                    <div className="row" style={{ marginBottom: 15 }}>
                                        <div className="col">
                                            <label style={{ fontWeight: "bold", margin: 0 }}>Net Amount</label>
                                            <input value={Number(amount) - Number(Number(material) + Number(outsourcePaid) + Number(fuelTransportation) + Number(cardRepair) + Number(gasRefill) + Number(workshopCharges) + Number(machineryRent))} disabled={true} type="number" className="form-control" placeholder="Net Amount" />
                                        </div>
                                    </div>
                                </form>
                            </Panel>
                        }

                    </Collapse>
                    <div className='mt-5 d-flex justify-content-end'>
                        {props.handleCancel &&
                            <Button className='mr-2' onClick={props.handleCancel}>X</Button>
                        }
                        {props.fromLeads && props.editObj && !props.fromFinance ?
                            <Button type='primary' onClick={updateJob}>Update</Button>
                            :
                            props.fromLeads && !props.fromFinance ?
                                <Button type='primary' onClick={addJob}>Add</Button>
                                :
                                !props.fromFinance &&
                                <Button type='primary' onClick={updateJob}>Update</Button>
                        }
                        {!props.fromFinance && props.editObj && !props.editObj.jobClosed &&
                            <Button className='ml-2' type='default' style={{ backgroundColor: "green", color: "white" }} onClick={closeJob}>Close Job</Button>
                        }
                        {!props.fromFinance && props.editObj && props.editObj.jobClosed &&
                            <Button className='ml-2' type='default' style={{ backgroundColor: "green", color: "white" }} onClick={reopenJob}>Reopen</Button>
                        }
                        {props.fromFinance &&
                            <Button type='primary' onClick={updateFinance}>Update</Button>
                        }
                    </div>
                </div>
            </div>
        </div >
    );
}