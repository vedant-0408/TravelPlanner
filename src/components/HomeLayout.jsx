import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import { useDisclosure } from '@nextui-org/react'
import AuthModal from './AuthModal'
import { useLocation } from 'react-router-dom'

const HomeLayout = ({ children }) => {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      {
        pathname.includes("/admin") ? <main>{children}</main>:
          (
            <div className="relative flex flex-col" id="app-container">
              <main className='flex flex-col relative'>
                <Navbar onOpen={onOpen} />
                <main>{children}</main>
                <AuthModal isOpen={isOpen} onOpen={onOpen} onOpenChange={onOpenChange} />
                <Footer />
              </main>
            </div>
          )
      }
    </>
  )
}

export default HomeLayout