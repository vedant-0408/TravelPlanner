import { Button, Input, Link, modal, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react'
import axios from 'axios';
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { USER_API_ROUTES } from '../utils/api-routes';
import { setUserInfo } from '../actions/authActions';

const AuthModal = ({isOpen,onOpen,onOpenChange}) => {

    const [modalType,setModalType]=useState("login");
    const navigate=useNavigate();
    const dispatch=useDispatch();

    const [firstName,setFirstName]=useState("");
    const [lastName,setLastName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");

    const handleSignup=async(onClose)=>{
        const response=await axios.post(USER_API_ROUTES.SIGNUP,{
            firstName,
            lastName,
            email,
            password,
        });
        if(response.data.userInfo){
            dispatch(setUserInfo(response.data.userInfo));
            onClose();
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
        }
    };

    const handleLogin=async(onClose)=>{
        const response=await axios.post(USER_API_ROUTES.LOGIN,{
            email,
            password,
        });
        localStorage.setItem("token",response.data.token);
        if(response.data.userInfo){
            dispatch(setUserInfo(response.data.userInfo));
            onClose();
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
        }
    };

    const switchModalType=()=>{
        if(modalType==="login") setModalType("signup");
        else setModalType("login");
    }

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop='blur' className='bg-opacity-50 bg-purple-200'>
        <ModalContent>
            {
                (onClose)=>(
                <>
                <ModalHeader className='flex flex-col gap-1 capitalize text-3xl items-center'>
                    {modalType}
                </ModalHeader>
                <ModalBody className='flex flex-col gap-1 capitalize text-3xl items-center'>
                    <div className='cursor-pointer'>
                        <img src="/logo.png" height={80} width={80} alt='logo'></img>
                        <span className="text-xl uppercase font-medium italic">
                            <span>ARKLYTE</span>
                        </span>
                    </div>
                    <div className='flex flex-col gap-2 w-full'>
                        <Input placeholder='Email' type="email" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        {
                            modalType==="signup" && (
                                <>
                                    <Input placeholder='First Name' type="text" value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
                                    <Input placeholder='Last Name' type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
                                </>
                            )
                        }
                        <Input placeholder='Password' type="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
                    </div>
                </ModalBody>
                <ModalFooter className='flex flex-col gap-2 items-center justify-center'>
                    <Button color="primary" className='w-full capitalize' onPress={()=>{
                        modalType==="login" ? handleLogin(onClose) : handleSignup(onClose)
                    }}>
                    {modalType}
                    </Button>
                    {
                        modalType==="signup" && (<p>Already have an account?&nbsp;{" "}<Link className='cursor-pointer' onClick={()=>switchModalType()}>{" "}Login Now</Link></p>)
                    }
                    {
                        modalType==="login" && (<p>Don{`'`}t have an account?&nbsp;{" "}<Link className='cursor-pointer' onClick={()=>switchModalType()}>{" "}SignUp Now</Link></p>)
                    }
                </ModalFooter>
                </>)
            }
        </ModalContent>
    </Modal>
  )
}

export default AuthModal