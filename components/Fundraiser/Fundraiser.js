"use client"
import React, { useState, useEffect } from 'react'
import "./Fundraiser.css";
import Image from 'next/image';
import Link from 'next/link';

import { FaUserCircle, FaAngleDown, FaAngleUp } from "react-icons/fa";
import { IoShieldCheckmark } from "react-icons/io5";
import { LiaDonateSolid } from "react-icons/lia";
import { MdOutlineShare, MdOutlineEmail } from "react-icons/md";
import { FaArrowRightLong } from "react-icons/fa6";
import { BiDonateHeart } from "react-icons/bi";
import { FiFlag } from "react-icons/fi";

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
                    <p className="ff-who-organizing-text">
                        <span style={{ fontWeight: "bold" }}>{details.user.name}</span> is organizing this fundraiser.
                    </p>

                    <div className="ff-details-separator-line"></div>

                    <div className="ff-donation-protected">
                        <div className="ff-protected-icon"><IoShieldCheckmark />
                        </div>
                        <div className="ff-protected-text">Donation Protected</div>
                    </div>

                    <div className="ff-details-separator-line"></div>

                    <div className="ff-details-description-cont">
                        <p className="ff-details-desc">
                            {!showMore && <span className="ff-desc-bottom-shadow"></span>}
                            {showMore ? details.description : details.description.slice(0, 200)}
                        </p>
                        <button className="ff-desc-read-more" onClick={(e) => { setShowMore(!showMore) }}>
                            <div className="ff-readmore-text">{showMore ? "Read less" : "Read more"}</div>
                            <div className="ff-readmore-icon">{showMore ? <FaAngleUp /> : <FaAngleDown />}</div>
                        </button>
                    </div>

                    <div className="ff-details-share-donate">
                        <button className="ff-details-sd-btn">
                            <div className="ff-details-sd-icon"><LiaDonateSolid /></div> Donate
                        </button>
                        <button className="ff-details-sd-btn">
                            <div className="ff-details-sd-icon"><MdOutlineShare /></div> Share
                        </button>
                    </div>

                    <div className="ff-details-separator-line"></div>

                    <div className="ff-organizer-and-beneficiary">
                        <h2 className="ff-organizer-beneficiary-title">
                            Organizer and Beneficiary
                        </h2>
                        <div className="ff-organizer-beneficiary-cont">
                            <div className="ff-organizer-cont">
                                <div className="ff-organizer-icon"><FaUserCircle /></div>
                                <div className="ff-organizer-text">
                                    <div className="ff-organizer-name">Sudip Lamichhane</div>
                                    <div className="ff-organizer-address">Organizer</div>
                                    <div className="ff-organizer-address">Madi-7, Hetauda</div>
                                    <button className="ff-organizer-contact-btn">
                                        <div className="ff-organizer-contact-icon"><MdOutlineEmail /></div> Contact
                                    </button>
                                </div>
                            </div>

                            <div className="ff-ob-mid-arrow"><FaArrowRightLong /></div>

                            <div className="ff-organizer-cont">
                                <div className="ff-organizer-icon"><FaUserCircle /></div>
                                <div className="ff-organizer-text">
                                    <div className="ff-organizer-name">Maddath Subedi</div>
                                    <div className="ff-organizer-address">Beneficiary</div>
                                    <div className="ff-organizer-address">Bharatpur-10, Chitwan</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="ff-details-separator-line"></div>

                    <div className="ff-details-comments">
                        <h2 className="ff-organizer-beneficiary-title">
                            Words of Support (20)
                        </h2>
                        <p className="ff-comments-info">Please donate to share your words of support.</p>

                        <ul className="ff-details-comments-container">
                            <li className="ff-comments-item">
                                <div className="ff-comments-item-icon"><BiDonateHeart /></div>
                                <div className="ff-comments-details">
                                    <div className="ff-commentator-name">Sudip Lamichhane</div>
                                    <div className="ff-commentator-amount-date"> Rs.500 --- 3 d</div>
                                    <p className="ff-commentator-comment">Hey, best of luck for your further study. Just do it with your own. If you need any more help then you can reach me through here.</p>
                                </div>
                            </li>
                            <li className="ff-comments-item">
                                <div className="ff-comments-item-icon"><BiDonateHeart /></div>
                                <div className="ff-comments-details">
                                    <div className="ff-commentator-name">Maddath Subedi</div>
                                    <div className="ff-commentator-amount-date"> Rs.300 --- 5 d</div>
                                    <p className="ff-commentator-comment">Hey, best of luck for your further study. Just do it with your own. If you need any more help then you can reach me through here.</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="ff-details-separator-line"></div>

                    <div className="ff-details-category-info">
                        <div className="ff-details-published-date">Published 1 d ago ---</div>
                        <Link href={`/categories/${details.category.replace(/\s+/g, '').toLowerCase()}`}>{details.category}</Link>
                    </div>

                    <div className="ff-details-separator-line"></div>

                    <button className="ff-details-report-section">
                        <div className="ff-report-icon"><FiFlag /></div>
                        <div className="ff-report-text">Report fundraiser</div>
                    </button>

                </div>
            </main>
            <aside className="ff-fundraiser-donate-box">
                Hello this is donate box
            </aside>
        </div>
    )
}

export default Fundraiser
