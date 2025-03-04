import React, { useContext } from 'react'
import { Navigate } from "react-router-dom"
import { Store } from '../Utils/Store'

function AttorneyProtected({children}) {
    const {state}=useContext(Store)
    const {UserInfo}=state

    return  UserInfo && UserInfo.isUser ?  children : <Navigate to='/login'/>
}

export default AttorneyProtected