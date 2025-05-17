import React from 'react';
import { Avatar, Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, NavbarBrand, NavbarContent, NavbarItem, Navbar as NextNavbar } from '@nextui-org/react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = ({ onOpen }) => {
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.auth.userInfo);
    const routesWithImages = ["/", "/search-flights", "/search-hotels"];
    const { pathname } = useLocation();

    return (
        <NextNavbar isBordered className='min-h-[10vh] bg-vi bg-opacity-10 text-white relative'>
            {!routesWithImages.includes(pathname) && (
                <>
                    <div className="fixed left-0 top-0 h-[10vh] w-[100vw] overflow-hidden z-0">
                        <div className='h-[70vh] w-[100vw] absolute z-10 top-0 left-0'>
                            <img src="/home/home-bg.png" className="w-full h-full object-cover" alt="search" />
                        </div>
                    </div>
                    <div className="fixed left-0 top-0 h-[10vh] w-[100vw] overflow-hidden z-0" style={{
                        backdropFilter: "blur(12px) saturate(280%)",
                        WebkitBackdropFilter: "blur(12px) saturate(280%)",
                    }}>
                    </div>
                </>
            )}
            <div className="z-10 w-full flex items-center">
                <NavbarBrand>
                    <div className='cursor-pointer flex items-center'>
                        <img src="/logo.png" height={80} width={80} alt='logo'></img>
                        <span className="text-xl uppercase font-medium italic">
                            <span>ARKLYTE</span>
                        </span>
                    </div>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem>
                        <a href="/" className={`${pathname === "/" ? "text-danger-500" : "text-white"}`}>
                            Tours
                        </a>
                    </NavbarItem>
                    <NavbarItem isActive>
                        <a href="/search-flights" aria-current="page" className={`${pathname === "/search-flights" ? "text-danger-500" : "text-white"}`}>
                            Flights
                        </a>
                    </NavbarItem>
                    <NavbarItem>
                        <a href="/search-hotels" className={`${pathname === "/search-hotels" ? "text-danger-500" : "text-white"}`}>
                            Hotels
                        </a>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    {
                        userInfo &&
                        <>
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Avatar
                                        isBordered
                                        as="button"
                                        className="transition-transform"
                                        color="secondary"
                                        size="md"
                                        classNames={{
                                            base:"bg-gradient-to-br from-[#ff578f] to-[#945bff]",
                                            icon:"text-black/80",

                                        }}
                                    />
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Profile Actions" variant="flat" onAction={key=>navigate(key)}>
                                    <DropdownItem key="profile" className="h-14 gap-2">
                                        <p className="font-semibold">Signed in as</p>
                                        <p className="font-semibold">{userInfo.email}</p>
                                    </DropdownItem>
                                    <DropdownItem key="/settings">My Settings</DropdownItem>
                                    <DropdownItem key="/my-bookings">My Bookings</DropdownItem>
                                    <DropdownItem key="/wishlists">Wishlist</DropdownItem>
                                    <DropdownItem key="/logout" color="danger">
                                        Log Out
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </>
                    }
                    {
                        !userInfo && (
                            <>
                                <NavbarItem className="hidden lg:flex">
                                    <Button color="secondary" variant='flat' className='text-purple-500' onPress={onOpen}>Login</Button>
                                </NavbarItem>
                                <NavbarItem>
                                    <Button color="danger" variant='flat' className='text-red-700' onPress={onOpen}>Sign Up</Button>
                                </NavbarItem>
                            </>
                        )
                    }
                </NavbarContent>
            </div>
        </NextNavbar>
    );
};

export default Navbar;
