import { useState } from 'react';
import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './sideDrawerHome.scss'

export default function SideDrawerHome(props) {

    let [activeUser, setActiveUser] = useState("")

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"))
        if (user) {
            setActiveUser(user)
        }
    }, [])

    return (
        <aside>
            {activeUser &&
                <div class="sidebar left ">
                    <ul class="list-sidebar bg-defoult">
                        <li> <NavLink to="/home/dashboard"><i class="fa fa-th-large"></i> <span class="nav-label">Dashboard</span></NavLink> </li>
                        {activeUser.permissions[0].serviceView &&
                            <li> <NavLink to="/home/services"><i class="fa fa-th-large"></i> <span class="nav-label">Services</span></NavLink> </li>
                        }
                        {activeUser.permissions[0].subServiceView &&
                            <li> <NavLink to="/home/subservices"><i class="fa fa-th-large"></i> <span class="nav-label">Sub Services</span></NavLink> </li>
                        }
                        {activeUser.permissions[0].subServiceView &&
                            <li> <NavLink to="/home/mobilesubservices"><i class="fa fa-th-large"></i> <span class="nav-label">Mobile Sub Services</span></NavLink> </li>
                        }
                        {activeUser.permissions[0].workerView &&
                            <li> <NavLink to="/home/workers"><i class="fa fa-th-large"></i> <span class="nav-label">Workers</span></NavLink> </li>
                        }
                        {/* <li> <NavLink to="/home/teams"><i class="fa fa-th-large"></i> <span class="nav-label">Teams</span></NavLink> </li> */}
                        {/* <li> <NavLink to="/home/vendorteams"><i class="fa fa-th-large"></i> <span class="nav-label">Vendor Teams</span></NavLink> </li> */}
                        {activeUser.permissions[0].customerView &&
                            <li> <NavLink to="/home/customers"><i class="fa fa-th-large"></i> <span class="nav-label">Customers</span></NavLink> </li>
                        }
                        {activeUser.permissions[0].crmUserView &&
                            <li> <NavLink to="/home/crm-users"><i class="fa fa-th-large"></i> <span class="nav-label">CRM Users</span></NavLink> </li>
                        }
                        {/* <li> <NavLink to="/home/vendors"><i class="fa fa-th-large"></i> <span class="nav-label">Vendors</span></NavLink> </li> */}
                        {/* <li> <a href="#" data-toggle="collapse" data-target="#products" class="collapsed " > <i class="fa fa-bar-chart-o"></i> <span class="nav-label">Graphs</span> <span class="fa fa-chevron-right pull-right"></span> </a>
                        <ul class="sub-menu collapse" id="products">
                            <li class=""><a href="#">CSS3 Animation</a></li>
                            <li><a href="#">General</a></li>
                            <li><a href="#">Buttons</a></li>
                            <li><a href="#">Tabs & Accordions</a></li>
                            <li><a href="#">Typography</a></li>
                            <li><a href="#">FontAwesome</a></li>
                            <li><a href="#">Slider</a></li>
                            <li><a href="#">Panels</a></li>
                            <li><a href="#">Widgets</a></li>
                            <li><a href="#">Bootstrap Model</a></li>
                        </ul>
                    </li> */}
                    </ul>
                </div>
            }
        </aside>
    );
}