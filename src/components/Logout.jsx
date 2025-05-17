import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { setUserInfo } from '../actions/authActions';

const Logout = () => {
    const navigate=useNavigate();
    const dispatch=useDispatch();
    // const userInfo = useSelector((state) => state.auth.userInfo);

    useEffect(()=>{
        dispatch(setUserInfo(null));
        localStorage.removeItem('token');
        navigate("/");
    },[dispatch,navigate])
  return (
    null
  )
}

export default Logout