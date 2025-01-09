"use client"
import React, { useState, useEffect, act } from 'react';
import "./Overview.css";

import { MdCampaign, MdReport } from "react-icons/md";
import { BiSolidDonateHeart, BiDonateHeart } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

const Overview = ({ user, overview }) => {

    return (
        <>
            <div className="ad-overview-container">
                <div className="ad-overview-header">
                    <h1 className="ad-overview-title">Welcome, {user.name}</h1>
                    <p className="ad-overview-text">Where insights meet action — empowering your journey.</p>
                </div>
                <ul className="ad-overview-cards-container">
                    <li className="ad-overview-card">
                        <div className="ad-overview-card-details">
                            <span className="ad-overview-card-title">Total Users <FaUsers style={{ fontSize: "1.6rem" }} /></span>
                            <span className="ad-overview-card-text">Number of users now in FundNepal.</span>
                        </div>
                        <div className="ad-overview-card-count"><span>{overview.totalUsers}</span></div>
                    </li>
                    <li className="ad-overview-card">
                        <div className="ad-overview-card-details">
                            <span className="ad-overview-card-title">Total Fundraisers <MdCampaign style={{ fontSize: "1.6rem" }} /></span>
                            <span className="ad-overview-card-text">Number of fundraisers that are created here.</span>
                        </div>
                        <div className="ad-overview-card-count"><span>{overview.totalFundraisers}</span></div>
                    </li>
                    <li className="ad-overview-card">
                        <div className="ad-overview-card-details">
                            <span className="ad-overview-card-title">Total Donations <BiSolidDonateHeart style={{ fontSize: "1.6rem" }} /></span>
                            <span className="ad-overview-card-text">Number of donations that are made here.</span>
                        </div>
                        <div className="ad-overview-card-count"><span>{overview.totalDonations}</span></div>
                    </li>
                    <li className="ad-overview-card">
                        <div className="ad-overview-card-details">
                            <span className="ad-overview-card-title">Total Reports <MdReport style={{ fontSize: "1.6rem" }} /></span>
                            <span className="ad-overview-card-text">Number of reports that are actioned here.</span>
                        </div>
                        <div className="ad-overview-card-count"><span>{overview.totalReports}</span></div>
                    </li>
                </ul>
            </div>
        </>
    )
}

export default Overview
