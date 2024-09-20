"use client"
import React, { useState, useEffect } from 'react'
import "./Donate.css";
import Link from 'next/link'
import Image from 'next/image'

import { BiSolidDonateHeart } from "react-icons/bi";
import { FaHandHoldingMedical } from "react-icons/fa";
import { MdCastForEducation, MdFamilyRestroom } from "react-icons/md";
import { TbEmergencyBed } from "react-icons/tb";
import { MdChevronRight } from "react-icons/md";

const Donate = ({ fundraisers }) => {

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
            name: "Non Profit",
            icon: <BiSolidDonateHeart />,
        },
        {
            name: "Education",
            icon: <MdCastForEducation />,
        },
        {
            name: "Family",
            icon: <MdFamilyRestroom />,
        },
    ]

    useEffect(() => {
        console.log(fundraisers);
    }, [fundraisers])

    const getImageUrl = (myfile) => {
        const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
        return imageUrl;
    }

    return (
        <main className='donate-container'>
            <section className="d-donate-first">
                <h1 className="d-donate-first-title">
                    Browse various fundraisers by category
                </h1>
                <p className="d-donate-first-text">
                    Find a cause you care about, support it wholeheartedly, and make a significant difference in the lives of those in need today.
                </p>
                <Link href={"/getstarted"} className="d-get-started-btn">
                    <span>Get Started</span>
                </Link>
            </section>

            <section id='categories' className="d-fundraiser-categories">
                <ul className="d-category-container">
                    {categories.map((category, index) => {
                        return (
                            <li key={index} className="d-category-item">
                                <div className="d-category-icon">{category.icon}</div>
                                <div className="d-category-name">{category.name}</div>
                            </li>
                        )
                    })}
                </ul>
            </section>

            <div className="d-separator-line"></div>

            {fundraisers && Object.entries(fundraisers).map(([categoryKey, category], index, array) => {
                return (
                    <React.Fragment key={categoryKey}>
                        <section className="d-donate-fundraiser">
                            <h2 className="d-fundraiser-title">{categoryKey} Fundraisers</h2>
                            <ul className="d-fundraiser-container">
                                {(category.length > 0) && category.map((fundraiser) => {
                                    return (
                                        <li key={fundraiser.id} className="d-fundraiser-item">
                                            <picture className='d-fundraiser-image-cont'>
                                                <Image className='d-fundraiser-cover-image' src={fundraiser.imageUrl} width={200} height={150} priority alt={`medical-${fundraiser.id}-image`} />
                                            </picture>
                                            <div className="d-fundraiser-details">
                                                <h3 className="d-fundraiser-title">{fundraiser.title}</h3>
                                                <div className="d-details-progress">
                                                    <div className="d-details-progress-top">
                                                        <div className="d-progress-bar"></div>
                                                    </div>
                                                    <div className="d-progress-amount">
                                                        Rs.{fundraiser.goal} raised
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="d-fundraiser-seemore">
                                <Link className='d-fundraiser-seemore-btn' href={"/"}>See more <MdChevronRight style={{ fontSize: "1.5rem" }} /></Link>
                            </div>
                        </section>
                        {index < array.length - 1 && <div className="d-separator-line"></div>}
                    </React.Fragment>
                );
            })}


        </main>
    )
}

export default Donate