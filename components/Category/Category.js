"use client"
import React, { useState, useEffect } from 'react'
import "./Category.css";
import Link from 'next/link'
import Image from 'next/image'
import { getCategoryWiseFundraiser } from '@/actions/getFundraisers';
import { MoonLoader } from 'react-spinners';

import { IoIosArrowDown } from "react-icons/io";

const Category = ({ details }) => {

    const [count, setCount] = useState(6);
    const [fundraisers, setFundraisers] = useState([]);
    const [fundraiserCount, setFundraiserCount] = useState('');
    const [loading, setLoading] = useState(false);

    const getFundraisers = async (category, count) => {
        setLoading(true);
        const allfundraisers = await getCategoryWiseFundraiser(category, count);
        if (allfundraisers) {
            setTimeout(() => {
                setFundraisers(allfundraisers.fundraisers);
                setFundraiserCount(allfundraisers.totalFundraisers);
                setLoading(false);
            }, 200);
        }
    }

    useEffect(() => {
        getFundraisers(details.title, count);
    }, [details, count])

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

    const handleSeeMore = () => {
        setCount(count + 6);
    }

    return (
        <main className='category-container'>
            <section className="c-category-first">
                <div className="c-category-first-left">
                    <h1 className="c-category-first-title">
                        Discover various {details.title} fundraisers on FundNepal
                    </h1>
                    <p className="c-category-first-text">
                        Find a cause you care about, support it wholeheartedly, and make a significant difference in the lives of those in need today.
                    </p>
                    <Link href={"/getstarted"} className="c-get-started-btn">
                        <span>Get Started</span>
                    </Link>
                </div>

                <picture className="c-category-first-right">
                    <Image className='c-category-cover' src={details.coverImage} width={500} height={400} priority alt={`${details.title}-cover`} />
                </picture>
            </section>

            <div className="c-separator-line"></div>

            <section className="c-all-fundraisers">
                <h2 className="c-all-fundraisers-title">Browse {details.title} Fundraisers</h2>

                {loading ? <div className="c-loading">
                    <MoonLoader size={100} color='var(--btn-secondary)' />
                </div> : <ul className="c-fundraiser-container">
                    {(fundraisers.length > 0) && fundraisers.map((fundraiser) => {
                        return (
                            <li key={fundraiser.id} className="c-fundraiser-item">
                                <Link href={`/fundraisers/${fundraiser.slug}`}>
                                    <div className='c-fundraiser-image-cont'>
                                        <Image className='c-fundraiser-cover-image' src={getImageUrl(fundraiser.photo)} width={200} height={150} priority alt={`medical-${fundraiser.id}-image`} />
                                        <span className='c-fundraiser-address'>{getAddress(fundraiser.beneficiary)}</span>
                                    </div>
                                    <div className="c-fundraiser-details">
                                        <h3 className="c-fundraiser-title">{fundraiser.title}</h3>
                                        <div className="c-details-progress">
                                            <div className="c-details-progress-top">
                                                <div className="c-progress-bar" style={{width: `${fundraiser.progress}%`}}></div>
                                            </div>
                                            <div className="c-progress-amount">
                                                Rs.{fundraiser.totalDonationAmount} raised
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })}
                </ul>}

                {fundraiserCount > count && <div className="c-fundraiser-seemore">
                    <button className='c-fundraiser-seemore-btn' onClick={(e) => { handleSeeMore(); }}>See more <IoIosArrowDown style={{ fontSize: "1rem" }} /></button>
                </div>}
            </section>
        </main>
    )
}

export default Category
