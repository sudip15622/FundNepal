"use client"
import React, { useState, useEffect } from 'react'
import "./FirstPage.css";

import { FaHandHoldingHeart, FaHandHoldingMedical } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { TbEmergencyBed } from "react-icons/tb";
import { BiSolidDonateHeart } from "react-icons/bi";
import { MdCastForEducation, MdFamilyRestroom } from "react-icons/md";
import { HiMiniHandRaised } from "react-icons/hi2";

const FirstPage = ({ completed, setCompleted }) => {

    const [firstData, setFirstData] = useState({ category: '', type: '' });

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('firstData'));
        if (savedData) {
            setFirstData(savedData);
        }
    }, []);

    useEffect(() => {
        if (firstData.category !== "" && firstData.type !== "") {
            setCompleted(true);
        } else {
            setCompleted(false);
        }
    }, [firstData]);

    const categories = [
        {
            name: "Medical",
            icon: <FaHandHoldingMedical />,
        },
        {
            name: "Emergency",
            icon: <TbEmergencyBed />,
        },
        {
            name: "Education",
            icon: <MdCastForEducation />,
        },
        {
            name: "Family",
            icon: <MdFamilyRestroom />,
        },
        {
            name: "Non Profit",
            icon: <BiSolidDonateHeart />,
        },
    ]
    const fundraiserTypes = [
        {
            name: "Yourself",
            description: "Funds are delivered to your bank account for your own use.",
            icon: <HiMiniHandRaised />,
        },
        {
            name: "Someone else",
            description: "You will invite a beneficiary to recieve funds or distribute them yourself.",
            icon: <FaPeopleGroup />,
        },
        {
            name: "Charity",
            description: "Funds are delivered to your choosen nonprofit for you.",
            icon: <FaHandHoldingHeart />,
        },
    ]

    const handleFormChange = (name, value) => {
        let newData = { ...firstData };
        newData[name] = value;
        setFirstData(newData);
        localStorage.setItem('firstData', JSON.stringify(newData));
    };

    return (
        <>
            <div className="gs-getstarted-phases-container">
                <div className="gs-select-top">
                    <h2 className="gs-getstarted-phases-title">Which category describes your case?</h2>
                    <ul className="gs-select-category-lists">
                        {categories.map((item, index) => {
                            return (
                                <li key={index} className={`gs-category-item ${(firstData.category == item.name) && "category-active"}`} onClick={(e) => { (firstData.category == item.name) ? handleFormChange('category', '') : handleFormChange('category', item.name) }}>
                                    <div className="gs-category-icon">{item.icon}</div>
                                    <div className="gs-category-name">{item.name}</div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
                <div className="gs-select-bottom">
                    <h2 className="gs-getstarted-phases-title">Who are you fundraising for?</h2>
                    <ul className="gs-select-type-lists">
                        {fundraiserTypes.map((item, index) => {
                            return (
                                <li key={index} className={`gs-type-item ${(firstData.type == item.name) && "category-active"}`} onClick={(e) => { (firstData.type == item.name) ? handleFormChange('type', '') : handleFormChange('type', item.name) }}>
                                    <div className="gs-type-icon">{item.icon}</div>
                                    <div className="gs-type-details">
                                        <h3 className="gs-type-name">{item.name}</h3>
                                        <p className="gs-type-desc">{item.description}</p>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
        </>
    )
}

export default FirstPage
