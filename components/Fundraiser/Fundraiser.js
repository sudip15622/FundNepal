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
import { HiMiniBarsArrowUp } from "react-icons/hi2";
import { IoIosStarOutline } from "react-icons/io";
import { GoCopy } from "react-icons/go";

const Fundraiser = ({ details }) => {

    const [showMore, setShowMore] = useState(false);
    const [shareInfo, setShareInfo] = useState('');
    const [shareBoxInfo, setShareBoxInfo] = useState('');

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
    const handleShare = async (key) => {
        try {
            const currentUrl = window.location.href;

            await navigator.clipboard.writeText(currentUrl);

            key === 'box' ? setShareBoxInfo('URL copied to clipboard') : setShareInfo('URL copied to clipboard');

            setTimeout(() => {
                setShareInfo('');
                setShareBoxInfo('');
            }, 2000);
        } catch (err) {
            key === 'box' ? setShareBoxInfo('Failed to copy URL!') : setShareInfo('Failed to copy URL!');
            setTimeout(() => {
                setShareInfo('');
                setShareInfo('');
                setShareBoxInfo('');
            }, 2000);
        }
    };

    return (
        <div className='ff-fundraiser-container'>
            <main className='ff-fundraiser-details-cont'>
                <h1 className="ff-fundraiser-details-title">
                    {details.title}
                </h1>
                <picture className='ff-fundraiser-cover-cont'>
                    <Image className='ff-fundraiser-cover-image' src={getImageUrl(details.photo)} width={600} height={500} alt={`image-${details.id}`} />
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
                        <button className="ff-details-sd-btn" onClick={(e) => { handleShare(''); }}>
                            {shareInfo != '' && <span className="ff-sd-btn-info">{shareInfo}</span>}
                            <div className="ff-details-sd-icon"><GoCopy /></div> Copy link
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
                <div className="ff-donate-box-first">
                    <div className="ff-box-goal-and-amount">
                        <span className='ff-box-raised-amount'>Rs.5000</span>
                        <span className='ff-box-goal-amount'>raised of Rs.{details.goal} goal</span>
                    </div>
                    <div className="ff-box-progress">
                        <div className="ff-box-progress-bar"></div>
                    </div>
                    <span className="ff-box-total-donation">
                        20K donations
                    </span>
                </div>

                <div className="ff-donate-box-buttons">
                    {shareBoxInfo != '' && <span className="ff-sd-btn-info">{shareBoxInfo}</span>}
                    <button className="ff-box-button ff-box-share-btn" onClick={(e) => { handleShare('box'); }}>
                        <span>Copy link</span>
                    </button>
                    <button className="ff-box-button ff-box-donate-btn">
                        <span>Donate Now</span>
                    </button>
                </div>

                <div className="ff-donate-box-latest-donation">
                    <div className="ff-box-latest-icon"><HiMiniBarsArrowUp /></div>
                    <div className="ff-box-latest-text">7.1K people just donated</div>
                </div>

                <ul className="ff-donate-box-donator-types">
                    <li className="ff-box-types-item">
                        <div className="ff-comments-item-icon"><BiDonateHeart /></div>
                        <div className="ff-types-item-details">
                            <div className="ff-types-item-name">Sagar Rijal</div>
                            <div className="ff-types-item-amount-type">
                                <span className="ff-types-item-amount">Rs.500</span>
                                <span className="ff-type-item-type">--- Recent donation</span>
                            </div>
                        </div>
                    </li>
                    <li className="ff-box-types-item">
                        <div className="ff-comments-item-icon"><BiDonateHeart /></div>
                        <div className="ff-types-item-details">
                            <div className="ff-types-item-name">Maddath Subedi</div>
                            <div className="ff-types-item-amount-type">
                                <span className="ff-types-item-amount">Rs.2000</span>
                                <span className="ff-type-item-type">--- Top donation</span>
                            </div>
                        </div>
                    </li>
                    <li className="ff-box-types-item">
                        <div className="ff-comments-item-icon"><BiDonateHeart /></div>
                        <div className="ff-types-item-details">
                            <div className="ff-types-item-name">Oasis Regmi</div>
                            <div className="ff-types-item-amount-type">
                                <span className="ff-types-item-amount">Rs.200</span>
                                <span className="ff-type-item-type">--- First donation</span>
                            </div>
                        </div>
                    </li>
                </ul>

                <div className="ff-donate-box-last-buttons">
                    <button className="ff-box-last-btns">See all</button>
                    <button className="ff-box-last-btns"><span><IoIosStarOutline /></span>See top</button>
                </div>
            </aside>
        </div>
    )
}

export default Fundraiser
