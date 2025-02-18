import React, {useContext} from 'react'
import {Navigate} from "react-router-dom"
import {Store} from '../Utils/Store'

function AdminProtected({children}) {
    const {state} = useContext(Store)
    const {UserInfo} = state
    return UserInfo && UserInfo.isAdmin ? children : <Navigate to='/login'/>
}

export default AdminProtected