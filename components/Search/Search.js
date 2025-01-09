"use client"
import React, { useState, useEffect, useRef } from 'react'
import "./Search.css";
import { useDebounce } from '@/hooks/useDebounce';
import { getFundraiserWhileSearch } from '@/actions/getFundraisers';
import { MoonLoader } from 'react-spinners';
import Image from 'next/image';
import Link from 'next/link';

import { IoSearch } from "react-icons/io5";
import { LuDelete } from "react-icons/lu";
import { IoIosArrowDown } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa";
import { TbTargetArrow } from "react-icons/tb";
import { MdOutlineRocketLaunch } from "react-icons/md";
import { HiMiniBarsArrowUp } from "react-icons/hi2";
import { BiSolidDonateHeart } from "react-icons/bi";
import { FaHandHoldingMedical } from "react-icons/fa";
import { MdCastForEducation, MdFamilyRestroom, MdClearAll, MdDelete  } from "react-icons/md";
import { TbEmergencyBed } from "react-icons/tb";


const Search = () => {

    const [data, setData] = useState([]);
    const [totalFundraisers, setTotalFundraisers] = useState(0);
    const [loading, setLoading] = useState(false);

    const [searchText, setSearchText] = useState('');
    const [count, setCount] = useState(6);
    const [category, setCategory] = useState('');
    const [filter, setFilter] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [showCategory, setShowCategory] = useState(false);
    const filterRef = useRef(null);
    const categoryRef = useRef(null);

    const debouncedSearchQuery = useDebounce(searchText, 500);

    const fetchFundraisers = async () => {
        setLoading(true);
        try {
            const result = await getFundraiserWhileSearch(count, debouncedSearchQuery, category, filter);
            setData(result.fundraisers);
            setTotalFundraisers(result.totalFundraisers);
        } catch (error) {
            console.error('Error fetching fundraisers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFundraisers();
    }, [debouncedSearchQuery, count, category, filter]);

    useEffect(() => {

        function handleClickOutside(event) {
            if (filterRef.current && !filterRef.current.contains(event.target)) {
                setShowFilters(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setShowCategory(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [showFilters, showCategory]);

    const handleSearchChange = (value) => {
        setSearchText(value);
    }

    const handleClearClick = () => {
        setSearchText('');
    }

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
        <main className='fns-search-container'>
            <div className="fns-search-header">
                <h1 className="fns-search-header-title">Find Fundraisers over Nepal</h1>
                <p className="fns-search-header-text">Find fundraiser's by person's name or fundraiser title</p>
                <div className="fns-search-inputBox">
                    <div className="fns-search-icon"><IoSearch /></div>
                    <input type="text" placeholder="Search for fundraisers" onChange={(e) => { handleSearchChange(e.target.value) }} className="fns-search-input" value={searchText} />
                    {searchText.length > 0 && (
                        <button onClick={(e) => { handleClearClick(); }} type='button' className="fns-clear-icon"><LuDelete /></button>
                    )}
                </div>
            </div>

            <div className="fns-search-filters">
                <div className="fns-filter-container" ref={filterRef}>
                    <div className="fns-main-filter" onClick={(e) => { setShowFilters(!showFilters) }}>
                        <span className="fns-main-filter-text">{filter !== '' ? filter : "Filter Options"}</span>
                        <span className="fns-main-filter-icon"><FaChevronDown /></span>
                    </div>
                    <ul className={`fns-filter-option-container ${showFilters && "fns-show-filters"}`}>
                        {filter !== '' && (
                            <li className="fns-filter-option fns-remove-filter" onClick={(e) => { setFilter(''); setShowFilters(false); }}>
                                <span className="fns-filter-option-icon"><MdDelete  /></span>
                                <span className="fns-filter-option-text">Remove Filter</span>
                            </li>
                        )}
                        <li className="fns-filter-option" onClick={(e) => { setFilter(''); setShowFilters(false); }}>
                            <span className="fns-filter-option-icon"><TbTargetArrow /></span>
                            <span className="fns-filter-option-text">Close to Goal</span>
                        </li>
                        <li className="fns-filter-option" onClick={(e) => { setFilter('Just Launched'); setShowFilters(false); }}>
                            <span className="fns-filter-option-icon"><MdOutlineRocketLaunch /></span>
                            <span className="fns-filter-option-text">Just Launched</span>
                        </li>
                        <li className="fns-filter-option" onClick={(e) => { setFilter('Now Trending'); setShowFilters(false); }}>
                            <span className="fns-filter-option-icon"><HiMiniBarsArrowUp /></span>
                            <span className="fns-filter-option-text">Now Trending</span>
                        </li>
                    </ul>
                </div>
                <div className="fns-filter-container" ref={categoryRef}>
                    <div className="fns-main-filter" onClick={(e) => { setShowCategory(!showCategory) }}>
                        <span className="fns-main-filter-text">{category !== '' ? category : "All Categories"}</span>
                        <span className="fns-main-filter-icon"><FaChevronDown /></span>
                    </div>
                    <ul className={`fns-filter-option-container ${showCategory && "fns-show-filters"}`}>
                        {category !== '' && (
                            <li className="fns-filter-option" onClick={(e) => { setCategory(''); setShowCategory(false); }}>
                                <span className="fns-filter-option-icon"><MdClearAll /></span>
                                <span className="fns-filter-option-text">All Categories</span>
                            </li>
                        )}
                        <li className="fns-filter-option" onClick={(e) => { setCategory('Medical'); setShowCategory(false); }}>
                            <span className="fns-filter-option-icon"><FaHandHoldingMedical /></span>
                            <span className="fns-filter-option-text">Medical</span>
                        </li>
                        <li className="fns-filter-option" onClick={(e) => { setCategory('Emergency'); setShowCategory(false); }}>
                            <span className="fns-filter-option-icon"><TbEmergencyBed /></span>
                            <span className="fns-filter-option-text">Emergency</span>
                        </li>
                        <li className="fns-filter-option" onClick={(e) => { setCategory('Education'); setShowCategory(false); }}>
                            <span className="fns-filter-option-icon"><MdCastForEducation /></span>
                            <span className="fns-filter-option-text">Education</span>
                        </li>
                        <li className="fns-filter-option" onClick={(e) => { setCategory('Family'); setShowCategory(false); }}>
                            <span className="fns-filter-option-icon"><MdFamilyRestroom /></span>
                            <span className="fns-filter-option-text">Family</span>
                        </li>
                        <li className="fns-filter-option" onClick={(e) => { setCategory('Non Profit'); setShowCategory(false); }}>
                            <span className="fns-filter-option-icon"><BiSolidDonateHeart /></span>
                            <span className="fns-filter-option-text">Non Profit</span>
                        </li>
                    </ul>
                </div>
            </div>

            {loading ? <div className="fns-loading">
                <MoonLoader size={100} color='var(--btn-secondary)' />
            </div> : <ul className="fns-fundraiser-container">
                {(data.length > 0) && data.map((fundraiser) => {
                    return (
                        <li key={fundraiser.id} className="fns-fundraiser-item">
                            <Link href={`/fundraisers/${fundraiser.slug}`}>
                                <div className='fns-fundraiser-image-cont'>
                                    <Image className='fns-fundraiser-cover-image' src={getImageUrl(fundraiser.photo)} width={200} height={150} priority alt={`medical-${fundraiser.id}-image`} />
                                    <span className='fns-fundraiser-address'>{getAddress(fundraiser.beneficiary)}</span>
                                </div>
                                <div className="fns-fundraiser-details">
                                    <h3 className="fns-fundraiser-title">{fundraiser.title}</h3>
                                    <div className="fns-details-progress">
                                        <div className="fns-details-progress-top">
                                            <div className="fns-progress-bar" style={{ width: `${fundraiser.progress}%` }}></div>
                                        </div>
                                        <div className="fns-progress-amount">
                                            Rs.{fundraiser.totalDonationAmount} raised
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </li>
                    );
                })}

                {(data.length === 0) && <div className="fns-no-fundraiser">
                    <h2 className="fns-no-fundraiser-title">No fundraisers found</h2>
                    <p className="fns-no-fundraiser-text">Try searching with different keywords</p>
                </div>}
            </ul>}

            {totalFundraisers > count && <div className="fns-fundraiser-seemore">
                <button className='fns-fundraiser-seemore-btn' onClick={(e) => { handleSeeMore(); }}>See more <IoIosArrowDown style={{ fontSize: "1rem" }} /></button>
            </div>}
        </main>
    )
}

export default Search
