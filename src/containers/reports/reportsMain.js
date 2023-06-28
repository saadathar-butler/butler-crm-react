import { io } from 'socket.io-client'
import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import SalesReportDetails from './reports/saleReportsDetails';
import ReceivableReports from './reports/receivableReport';
import ExpenseReportsDetails from './reports/expenseReportsDetails';
import ExpenseReportsSummary from './reports/expenseReportsSummary';
import SalesSummaryCatWise from './reports/salesSummaryCatWise';
import SalesSummarySubCatWise from './reports/salesSummarySubCatWise';
import CallReports from './reports/callReports';
import WorkerVendorReportsDetail from './reports/workerVendorReportsDetails';
import WorkerVendorReportsSummary from './reports/workerVendorReportsSummary';
import DispatchReports from './reports/dispatchReports';
import DispatchReportsWorkerVendorWise from './reports/dispatchReportWorkerVendorWise';

const socket = io(`${process.env.REACT_APP_BACKEND_URL}`)

function ReportMain() {

    let [routeName, setRouteName] = useState("")

    useEffect(() => {
        let route = window.location.pathname
        let specificRoute = route.split("/")[route.split("/").length - 1]
        setRouteName(specificRoute)
    }, [])

    return (
        <div className='reportMain'>
            {routeName.split("-").join(" ") === "Sale Reports Detail" ?
                <SalesReportDetails name={routeName} />
                :
                routeName.split("-").join(" ") === "Receivavle Reports" ?
                    <ReceivableReports name={routeName} />
                    :
                    routeName.split("-").join(" ") === "Expense Reports Details" ?
                        <ExpenseReportsDetails name={routeName} />
                        :
                        routeName.split("-").join(" ") === "Expense Reports Summary" ?
                            <ExpenseReportsSummary name={routeName} />
                            :
                            routeName.split("-").join(" ") === "Sale Reports Summary Category Wise" ?
                                <SalesSummaryCatWise name={routeName} />
                                :
                                routeName.split("-").join(" ") === "Sale Reports Summary Sub Cateory Wise" ?
                                    <SalesSummarySubCatWise name={routeName} />
                                    :
                                    routeName.split("-").join(" ") === "Call Reports" ?
                                        <CallReports name={routeName} />
                                        :
                                        routeName.split("-").join(" ") === "Worker Vendor Reports Details" ?
                                            <WorkerVendorReportsDetail name={routeName} />
                                            :
                                            routeName.split("-").join(" ") === "Worker Vendor Reports Summary" ?
                                                <WorkerVendorReportsSummary name={routeName} />
                                                :
                                                routeName.split("-").join(" ") === "Dispatch Reports" ?
                                                    <DispatchReports name={routeName} />
                                                    :
                                                    routeName.split("-").join(" ") === "Dispatch Reports Worker Vendor Wise" ?
                                                        <DispatchReportsWorkerVendorWise name={routeName} />
                                                        :
                                                        null
            }
        </div>
    );
}

export default ReportMain;