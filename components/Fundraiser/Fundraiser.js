"use client"
import React, { useState, useEffect } from 'react'
import "./Fundraiser.css";
import Image from 'next/image';

import { FaUserCircle, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

const Fundraiser = ({ details }) => {

    const [showMore, setShowMore] = useState(false);

    useEffect(() => {
        console.log(details);
    }, [details])

    const getImageUrl = (myfile) => {
        if (myfile) {
            const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
            return imageUrl;
        }
    }

    const getAddress = (contactInfo) => {
        if (contactInfo) {
            const wardNo = contactInfo[0].address.wardNo;
            const city = contactInfo[0].address.city;
            const district = contactInfo[0].address.district;
            return `${city}-${wardNo}, ${district}`;
        }
    }

    return (
        <div className='ff-fundraiser-container'>
            <main className='ff-fundraiser-details-cont'>
                <h1 className="ff-fundraiser-details-title">
                    {details.title}
                </h1>
                <picture className='ff-fundraiser-cover-cont'>
                    <Image className='ff-fundraiser-cover-image' src={getImageUrl(details.photo)} width={600} height={500} priority alt={`image-${details.id}`} />
                </picture>

                <div className="ff-below-contents">
                    <div className="ff-who-is-organizing">
                        <div className="ff-who-organizing-icon"><FaUserCircle /></div>
                        <p className="ff-who-organizing-text">
                            <span style={{ fontWeight: "bold" }}>{details.user.name}</span> is organizing this fundraiser.
                        </p>
                    </div>

                    <div className="ff-details-separator-line"></div>

                    <div className="ff-donation-protected">
                        <div className="ff-protected-icon"><IoShieldCheckmark />
                        </div>
                        <div className="ff-protected-text">Donation Protected</div>
                    </div>

                    <div className="ff-details-separator-line"></div>

                    <div className="ff-details-description-cont">
                        <p className="ff-details-desc">
                            {!showMore && <div className="ff-desc-bottom-shadow"></div>}
                            {showMore ? details.description : details.description.slice(0, 200)}
                        </p>
                        <button className="ff-desc-read-more" onClick={(e)=>{setShowMore(!showMore)}}>
                            <div className="ff-readmore-text">{showMore ? "Read less" : "Read more"}</div>
                            <div className="ff-readmore-icon">{showMore ? <FaAngleUp /> : <FaAngleDown />}</div>
                        </button>
                    </div>

                </div>
            </main>
            <aside className="ff-fundraiser-donate-box">
                Hello this is donate box
            </aside>
        </div>
    )
}

export default Fundraiser
