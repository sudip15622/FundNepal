"use client"
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import "./Adminpage.css";
import Overview from './Overview/Overview';
import Profile from './Profile/Profile';
import Users from './Users/Users';
import Fundraisers from './Fundraisers/Fundraisers';
import Donations from './Donations/Donations';
import Reports from './Reports/Reports';
import Banks from './Banks/Banks';

import { MdDashboard, MdCampaign, MdOutlineManageSearch, MdReport } from "react-icons/md";
import { BiSolidDonateHeart, BiSolidBank } from "react-icons/bi";
import { FaUserCircle, FaUsers } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa6";

const Adminpage = ({ user, overview }) => {

    const searchParams = useSearchParams();
    const router = useRouter();

    const page = searchParams.get('page') || 'dashboard';
    const [selected, setSelected] = useState(page);
    const [validPage, setValidPage] = useState(true);

    const validPages = ['dashboard', 'users', 'fundraisers', 'donations', 'banks', 'reports', 'profile'];


    useEffect(() => {
        if (validPages.includes(page)) {
            setSelected(page);
            setValidPage(true);
        } else {
            setValidPage(false);
        }
    }, [page]);

    const handleSidebarClick = (page) => {
        setSelected(page);
        router.push(`/dashboard?page=${page}`);
    };


    return (
        <>
            <main className='user-dashboard-container'>
                <aside className="user-dashboard-sidebar">
                    <ul>
                        <li
                            className={`sidebar-element ${selected === 'dashboard' && 'sidebar-active'}`}
                            onClick={() => handleSidebarClick('dashboard')}
                        >
                            <div className="sidebar-element-left">
                                <div className="sidebar-element-icon">
                                    <MdDashboard />
                                </div>
                                <div className="sidebar-element-text">
                                    Dashboard
                                </div>
                            </div>
                            <div className={`sidebar-element-right ${selected === 'dashboard' && "sidebar-pointer-show"}`}><FaAngleRight /></div>
                        </li>
                        <li
                            className={`sidebar-element ${selected === 'users' && 'sidebar-active'}`}
                            onClick={() => handleSidebarClick('users')}
                        >
                            <div className="sidebar-element-left">
                                <div className="sidebar-element-icon">
                                    <FaUsers />
                                </div>
                                <div className="sidebar-element-text">
                                    Users
                                </div>
                            </div>
                            <div className={`sidebar-element-right ${selected === 'users' && "sidebar-pointer-show"}`}><FaAngleRight /></div>
                        </li>
                        <li
                            className={`sidebar-element ${selected === 'fundraisers' && 'sidebar-active'}`}
                            onClick={() => handleSidebarClick('fundraisers')}
                        >
                            <div className="sidebar-element-left">
                                <div className="sidebar-element-icon">
                                    <MdCampaign />
                                </div>
                                <div className="sidebar-element-text">
                                    Fundraisers
                                </div>
                            </div>
                            <div className={`sidebar-element-right ${selected === 'fundraisers' && "sidebar-pointer-show"}`}><FaAngleRight /></div>
                        </li>
                        <li
                            className={`sidebar-element ${selected === 'donations' && 'sidebar-active'}`}
                            onClick={() => handleSidebarClick('donations')}
                        >
                            <div className="sidebar-element-left">
                                <div className="sidebar-element-icon">
                                    <BiSolidDonateHeart />
                                </div>
                                <div className="sidebar-element-text">
                                    Donations
                                </div>
                            </div>
                            <div className={`sidebar-element-right ${selected === 'donations' && "sidebar-pointer-show"}`}><FaAngleRight /></div>
                        </li>
                        <li
                            className={`sidebar-element ${selected === 'banks' && 'sidebar-active'}`}
                            onClick={() => handleSidebarClick('banks')}
                        >
                            <div className="sidebar-element-left">
                                <div className="sidebar-element-icon">
                                    <BiSolidBank />
                                </div>
                                <div className="sidebar-element-text">
                                    Banks
                                </div>
                            </div>
                            <div className={`sidebar-element-right ${selected === 'banks' && "sidebar-pointer-show"}`}><FaAngleRight /></div>
                        </li>
                        <li
                            className={`sidebar-element ${selected === 'reports' && 'sidebar-active'}`}
                            onClick={() => handleSidebarClick('reports')}
                        >
                            <div className="sidebar-element-left">
                                <div className="sidebar-element-icon">
                                    <MdReport />
                                </div>
                                <div className="sidebar-element-text">
                                    Reports
                                </div>
                            </div>
                            <div className={`sidebar-element-right ${selected === 'reports' && "sidebar-pointer-show"}`}><FaAngleRight /></div>
                        </li>
                        <li
                            className={`sidebar-element ${selected === 'profile' && 'sidebar-active'}`}
                            onClick={() => handleSidebarClick('profile')}
                        >
                            <div className="sidebar-element-left">
                                <div className="sidebar-element-icon">
                                    <FaUserCircle />
                                </div>
                                <div className="sidebar-element-text">
                                    Profile
                                </div>
                            </div>
                            <div className={`sidebar-element-right ${selected === 'profile' && "sidebar-pointer-show"}`}><FaAngleRight /></div>
                        </li>
                    </ul>
                </aside>
                <section className="user-dashboard">
                    {!validPage ? (
                        <div className="invalid-dashboard">
                            <h1>Invalid Page</h1>
                            <p>The page you are looking for does not exist.</p>
                        </div>
                    ) : (
                        <>
                            {selected === 'dashboard' && (
                                <>
                                    <Overview user={user} overview={overview} />
                                </>
                            )}
                            {selected === 'users' && (
                                <>
                                    <Users />
                                </>
                            )}
                            {selected === 'fundraisers' && (
                                <>
                                    <Fundraisers />
                                </>
                            )}
                            {selected === 'donations' && (
                                <>
                                    <Donations />
                                </>
                            )}
                            {selected === 'banks' && (
                                <>
                                    <Banks />
                                </>
                            )}
                            {selected === 'reports' && (
                                <>
                                    <Reports />
                                </>
                            )}
                            {selected === 'profile' && (
                                <>
                                    <Profile userId={user.id} />
                                </>
                            )}
                        </>
                    )}
                </section>
            </main>
        </>
    )
}

export default Adminpage
