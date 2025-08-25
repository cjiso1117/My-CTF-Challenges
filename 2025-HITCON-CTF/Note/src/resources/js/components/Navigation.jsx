import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Button, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, Dropdown, Avatar, DropdownHeader, DropdownItem } from 'flowbite-react';
import { HiOutlineHome, HiOutlineDocumentText, HiOutlineLogout, HiOutlineSpeakerphone } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

function Navigation() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar fluid rounded className="border-b border-gray-200 dark:border-gray-700">
            <NavbarBrand as={Link} to="/">
                <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg mr-3">
                        <HiOutlineDocumentText className="w-6 h-6 text-white" />
                    </div>
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
                        Notes App
                    </span>
                </div>
            </NavbarBrand>

            <div className="flex md:order-2">
                {user ? (
                    <Dropdown
                        arrowIcon={false}
                        inline
                        label={
                            <Avatar alt="User settings" img={`https://ui-avatars.com/api/?name=${user.name}&background=random`} rounded />
                        }
                    >
                        <DropdownHeader>
                            <span className="block text-sm">{user.name}</span>
                            <span className="block truncate text-sm font-medium">{user.email}</span>
                        </DropdownHeader>
                        <DropdownItem icon={HiOutlineLogout} onClick={handleLogout}>
                            Sign out
                        </DropdownItem>
                    </Dropdown>
                ) : (
                    <div className="flex gap-2">
                        <Button as={Link} to="/login" color="alternative" size="sm">
                            Login
                        </Button>
                        <Button as={Link} to="/register" size="sm">
                            Sign Up
                        </Button>
                    </div>
                )}
                <NavbarToggle />
            </div>

            <NavbarCollapse>
                <NavbarLink
                    as={Link}
                    to='/'
                    active={isActive('/')}
                    className="flex items-center"
                >
                    <HiOutlineHome className="mr-2 h-4 w-4" />
                    Home
                </NavbarLink>
                <NavbarLink
                    as={Link}
                    to='/announcement'
                    active={isActive('/announcement')}
                    className="flex items-center"
                >
                    <HiOutlineSpeakerphone className="mr-2 h-4 w-4" />
                    Announcement
                </NavbarLink>
                <NavbarLink
                    as={Link}
                    to='/note'
                    active={isActive('/note')}
                    className="flex items-center"
                >
                    <HiOutlineDocumentText className="mr-2 h-4 w-4" />
                    My Notes
                </NavbarLink>
            </NavbarCollapse>
        </Navbar>
    );
}

export default Navigation;
