import { Button, Card, CardBody, CardFooter, CardHeader, Input } from '@nextui-org/react'
import React, { useState } from 'react'
import axios from 'axios';
import { ADMIN_API_ROUTES } from '../utils';
import { useSelector,useDispatch } from 'react-redux';
import { setUserInfo } from '../actions/authActions';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const[email,setEmail] = useState('');
    const[password,setPassword]= useState('');
    const userInfo = useSelector((state)=>state.auth.userInfo);
    const dispatch= useDispatch();
    const navigate=useNavigate();

    const handleLogin=async()=>{
        try{
            const response= await axios.post(ADMIN_API_ROUTES.LOGIN,{
            email,
            password,
        });
        if(response.data.userInfo){
            localStorage.setItem("token",response.data.token);
            dispatch(setUserInfo(response.data.userInfo));
            navigate('/admin');
        }
        }catch(error){
           console.log(error); 
        }
    }

  return (

    <div className='h-[100vh] w-full flex items-center justify-center bg-cover bg-center bg-no-repeat' style={{backgroundImage:'url("/home/home-bg.png")'}}>
    <div className='absolute inset-0 bg-black bg-opacity-50 backdrop-blur-2xl'></div>
    <Card className='shadow-2xl bg-opacity-20 w-[480px]'>
        <CardHeader className='flex flex-col gap-1 capitalize text-3xl items-center'>
            <div className="flex flex-col gap-1 capitalize text-3xl items-center">
                <img src="/logo.png" alt="logo" height={80} width={80} className="cursor-pointer" />
                <span className='text-xl uppercase font-medium italic text-white'>
                    <span>ARKLYTE Admin Login</span>
                </span>
            </div>
        </CardHeader>
        <CardBody className='flex flex-col items-center w-full justify-center'>
            <div className='flex flex-col gap-2 w-full'>
                <Input placeholder='Email' type="email" value={email} onChange={e=>setEmail(e.target.value)} color="danger"/>
                <Input placeholder='Password' type="password" value={password} onChange={e=>setPassword(e.target.value)} color="danger"/>
            </div>
        </CardBody>
        <CardFooter className='flex flex-col gap-2 items-center justify-center'>
            <Button color="danger" variant='shadow' className='w-full capitalize' size='lg' onClick={handleLogin}>Login</Button>
        </CardFooter>
    </Card>
    {/* {userInfo ? console.log("hiii") : console.log("hello")} */}
    </div>
  )
}

export default Login