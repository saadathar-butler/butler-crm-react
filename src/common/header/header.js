import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function Header(props) {

    const logout = () => {
        localStorage.removeItem("user")
        // window.location.href = "http://192.168.18.228:3000/login"
        window.location.href = "https://admin.qualitybutlerservices.com/login"
    }

    let [activeUser, setActiveUser] = useState("")

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        setActiveUser(user)
    }, [])

    return (
        activeUser ?
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <a className="navbar-brand" href="#">Butlers Bench</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse d-flex justify-content-between" id="navbarSupportedContent">
                    <ul className="navbar-nav mr-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/home/dashboard">Home</NavLink>
                        </li>
                        {activeUser.permissions[0].leadsView &&
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/leads">Leads</NavLink>
                            </li>
                        }
                        {activeUser.permissions[0].callsView &&
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/calls">Calls</NavLink>
                            </li>
                        }
                        {/* <li className="nav-item">
                            <NavLink className="nav-link" to="#">Admin Panel</NavLink>
                        </li> */}
                        {activeUser.permissions[0].financeView &&
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/finance">Finance</NavLink>
                            </li>
                        }
                        {activeUser.permissions[0].dispatchView &&
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/dispatch">Dispatch</NavLink>
                            </li>
                        }
                        {activeUser.permissions[0].reportsView &&
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Reports
                                </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a className="dropdown-item" href="#">Customer Reports</a>
                                    <a className="dropdown-item" href="#">Job Reports</a>
                                </div>
                            </li>
                        }
                    </ul>

                    <div className="mr-5 d-flex align-items-center">
                        <h6 className="mb-0 mr-2">{activeUser.name}</h6>
                        <svg onClick={logout} style={{ cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="red" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0v2z" />
                            <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3z" />
                        </svg>
                    </div>
                </div>
            </nav>
            : null
    );
}