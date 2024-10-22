import React from 'react'
import { Navigate } from 'react-router-dom'

const PrivateEmpRoute = ({children}) => {
  return localStorage.getItem("userid") ? children : <Navigate to="/" />
}

export default PrivateEmpRoute