import { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { bindActionCreators } from 'redux';
import SideDrawerHome from '../../common/sideDrawers/sideDrawerHome';
import CrmUsers from './crmUsers/crmUsers';
import Customers from './customers/customers';
import Dashboard from './dashboard/dashboard';
import MobileSubServices from './mobileSubServices/mobileSubServices';
import Services from './services/services';
import SubServices from './subServices/subServices';
import Teams from './teams/teams';
import Vendors from './vendors/vendors';
import VendorTeams from './vendorTeams/vendorTeams';
import Workers from './workers/workers';

function Home(props) {

    let [activePage, setActivePage] = useState("dashboard")

    useEffect(() => {
        let route = window.location.pathname
        let arr = route.split("/")
        if (arr[2].toLowerCase() === "dashboard") {
            setActivePage("dashboard")
        }
        else if (arr[2].toLowerCase() === "services") {
            setActivePage("services")
        }
        else if (arr[2].toLowerCase() === "subservices") {
            setActivePage("subservices")
        }
        else if (arr[2].toLowerCase() === "mobilesubservices") {
            setActivePage("mobilesubservices")
        }
        else if (arr[2].toLowerCase() === "teams") {
            setActivePage("teams")
        }
        else if (arr[2].toLowerCase() === "vendorteams") {
            setActivePage("vendorteams")
        }
        else if (arr[2].toLowerCase() === "customers") {
            setActivePage("customers")
        }
        else if (arr[2].toLowerCase() === "crm-users") {
            setActivePage("crm-users")
        }
        else if (arr[2].toLowerCase() === "vendors") {
            setActivePage("vendors")
        }
        else if (arr[2].toLowerCase() === "workers") {
            setActivePage("workers")
        }
    }, [])

    return (
        <div className='d-flex'>
            <div className='sideDrawerHome'>
                <SideDrawerHome />
            </div>
            <div className='w-100 p-3'>
                <div className="card cardView p-3" >
                    {activePage === "dashboard" ?
                        <Dashboard />
                        :
                        activePage === "services" ?
                            <Services />
                            :
                            activePage === "subservices" ?
                                <SubServices />
                                :
                                activePage === "mobilesubservices" ?
                                    <MobileSubServices />
                                    :
                                    activePage === "teams" ?
                                        <Teams />
                                        :
                                        activePage === "vendorteams" ?
                                            <VendorTeams />
                                            :
                                            activePage === "customers" ?
                                                <Customers />
                                                :
                                                activePage === "crm-users" ?
                                                    <CrmUsers />
                                                    :
                                                    activePage === "vendors" ?
                                                        <Vendors />
                                                        :
                                                        activePage === "workers" ?
                                                            <Workers />
                                                            :
                                                            null
                    }
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (store) => {
    // console.log(store)
    return {
        store
    }
}

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {

        },
        dispatch
    )

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home)