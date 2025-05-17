import axios from 'axios';
import React, { useEffect } from 'react'
// import { useLocation, useNavigate } from 'react-router-dom'
import { USER_API_ROUTES } from '../utils/api-routes';
import { useDispatch, useSelector } from 'react-redux';
import { setAdminAccess, setUserInfo } from '../actions/authActions';

const AppProtector = () => {

    // const navigate=useNavigate();
    // const location=useLocation();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const dispatch=useDispatch();
    // let admin_access=false;
    const admin_access=useSelector((state)=>state.admin.adminAccess);


    useEffect(()=>{
        if(!userInfo){
            const getUserInfo=async()=>{
                const token = localStorage.getItem('token');
                const response=await axios.get(USER_API_ROUTES.ME,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (response.data.userInfo) {
                    dispatch(setUserInfo(response.data.userInfo));  // Dispatch user info
          
                    if (response.data.userInfo.isAdmin) {
                      dispatch(setAdminAccess(true));  // Dispatch admin access
                      console.log(admin_access);

                    } else {
                      dispatch(setAdminAccess(false));
                      console.log("hi");
                      console.log(userInfo);
                    }
                  }
            };
            getUserInfo();
        }
    },[setUserInfo,userInfo]);
  return null;
}

export default AppProtector