"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { getFundraisersForAdmin, deleteFundraiser, changeFundraiserStatus } from '@/actions/getFundraisers';
import { useDebounce } from '@/hooks/useDebounce';
import { MoonLoader } from 'react-spinners';
import Link from 'next/link';
import Image from 'next/image';
import "./Fundraisers.css";

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdDelete, MdError } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { FaCheckCircle, FaEye } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const Fundraisers = () => {

    // const table = useReactTable();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalFundraisers, setTotalFundraisers] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortFundraiser, setSortFundraiser] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionPopup, setActionPopup] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const actionRef = useRef(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    const [actionInfo, setActionInfo] = useState('');

    const [showContent, setShowContent] = useState(false);
    const [currentDetails, setCurrentDetails] = useState(null);
    const detailsRef = useRef(null);

    const [showDesc, setShowDesc] = useState(false);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const getAllFundraisers = async () => {
        try {
            setLoading(true);
            const response = await getFundraisersForAdmin(pageIndex, pageSize, sortFundraiser, debouncedSearchQuery, statusFilter, categoryFilter);
            if (response.success) {
                setData(response.fundraisers);
                setTotalFundraisers(response.totalFundraisers);
            } else {
                console.error(response);
            }
            setLoading(false);

        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getAllFundraisers();
    }, [pageIndex, pageSize, sortFundraiser, debouncedSearchQuery, statusFilter, categoryFilter])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionRef.current && !actionRef.current.contains(event.target)) {
                setActionPopup(false);
                setSelectedAction(null);
            }
            if (detailsRef.current && !detailsRef.current.contains(event.target)) {
                handleHideClick();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [actionRef, detailsRef]);

    const getDate = (date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return formattedDate;
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
            const street = contactInfo[0].address.street;
            return `${street}-${wardNo}, ${city}, ${district}`;
        }
    }

    const handleChangeStatus = async (id, status) => {
        setActionLoading(true);
        const response = await changeFundraiserStatus(id, status);
        if (response.success) {
            setActionInfo("Successfully changed fundraiser's status!");
        } else {
            setActionError(response.error);
        }
    }

    const handleDeleteFundraiser = async (id) => {
        setActionLoading(true);
        const response = await deleteFundraiser(id);
        if (response.success) {
            setActionInfo("Successfully deleted Fundraiser!");
        } else {
            setActionError(response.nextError);
        }
    }

    const handleViewDetails = (details) => {
        setShowContent(true);
        setCurrentDetails(details);
        console.log(details);
    }

    const handleHideClick = () => {
        setShowContent(false);
        setCurrentDetails(null);
    }

    const handleOkClick = () => {
        setActionLoading(false);
        setActionInfo('');
        setActionError('');
        getAllFundraisers();
    }

    const columns = [
        {
            header: 'Fundraiser',
            cell: ({ row }) => {
                const { title, slug, photo } = row.original;
                return (
                    <div className="adf-users-name-container">
                        <picture className='adf-fundraiser-cover-container'>
                            <Image className='adf-users-avatar' src={getImageUrl(photo)} width={50} height={45} alt="user-avatar" />
                        </picture>
                        <Link href={`/fundraisers/${slug}`} className="adf-fundraiser-title">{title}</Link>
                    </div>
                );
            },
        },
        {
            header: 'Organizer',
            cell: ({ row }) => {
                const { user } = row.original;
                return (
                    <div className="adf-users-name-container">
                        <picture className='adf-users-avatar-container'>
                            <Image className='adf-users-avatar' src={user.avatar !== '' ? user.avatar : "/user.png"} width={50} height={45} alt="user-avatar" />
                        </picture>
                        <span className="adf-users-table-spans">{user.name}</span>
                    </div>
                );
            },
        },
        {
            header: 'Fund Raised',
            cell: ({ row }) => {
                const { totalDonationAmount } = row.original;
                return (
                    <span className="adu-users-table-spans">Rs. {totalDonationAmount}</span>
                );
            },
        },
        {
            header: 'Category',
            cell: ({ row }) => {
                const { category } = row.original;
                return (
                    <span className={`adu-users-table-spans`}>{category}</span>
                );
            },
        },
        {
            header: 'Status',
            cell: ({ row }) => {
                const { status } = row.original;
                return (
                    <span className={`adu-users-table-spans ${status === 'Published' ? "adf-published" : "adf-draft"}`}>{status}</span>
                );
            },
        },
        {
            header: 'Date',
            accessorKey: 'dateRequested',
            cell: ({ getValue }) => getDate(getValue()),
        },
        {
            header: 'Action',
            cell: ({ row }) => {
                const { id, status } = row.original;
                return (
                    <>
                        <button type='button' className="adu-users-table-spans adu-action-btn" onClick={(e) => { setActionPopup(!actionPopup); setSelectedAction(row.original); }}><HiOutlineDotsHorizontal /></button>
                        {actionPopup ?
                            <>
                                {selectedAction.id === row.original.id ?
                                    <div className="adu-order-action-popup adf-action-popup" ref={actionRef}>
                                        <div className="adu-popup-inside-divs" onClick={(e) => { handleViewDetails(row.original) }}>
                                            <div className="adu-inside-div-icon"><FaEye /></div>
                                            <div className="adu-inside-div-text">View Details</div>
                                        </div>
                                        <div className={`adu-popup-inside-divs ${status === 'Draft' ? "adf-published" : "adf-draft"}`} onClick={(e) => { handleChangeStatus(id, status) }}>
                                            <div className="adu-inside-div-icon"><RiAdminFill /></div>
                                            {status === 'Published' ? <div className="adu-inside-div-text">Mark as Draft</div> : <div className="adu-inside-div-text">Mark as Published</div>}
                                        </div>
                                        <div className="adu-popup-inside-divs adu-delete-user-div" onClick={(e) => { handleDeleteFundraiser(id) }}>
                                            <div className="adu-inside-div-icon"><MdDelete /></div>
                                            <div className="adu-inside-div-text">Delete Fundraiser</div>
                                        </div>
                                    </div> : <></>}
                            </> : <></>}
                    </>
                );
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        // getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: Math.ceil(totalFundraisers / pageSize),
    })

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < table.getPageCount() - 1;


    return (
        <div className='adu-users-container'>
            <div className="adu-users-header">
                <h1 className="adu-users-title">All Fundraisers</h1>
                <p className="adu-users-text">Below is the list of all fundraisers requested or published in FundNepal.</p>
            </div>

            <div className="adu-users-filters-container">
                <input
                    type="text"
                    placeholder="Search fundraiser"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="adu-search-input"
                />

                <select
                    value={sortFundraiser}
                    onChange={(e) => setSortFundraiser(e.target.value)}
                    className="adu-sort-select"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>

                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="adu-sort-select"
                >
                    <option value="">All Category</option>
                    <option value="Medical">Medical</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Non Profit">Non Profit</option>
                    <option value="Education">Education</option>
                    <option value="Family">Family</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="adu-sort-select"
                >
                    <option value="">All Status</option>
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                </select>

            </div>

            {loading ? <div className="adu-loading">
                <MoonLoader size={100} color='var(--btn-secondary)' />
            </div> : (
                <>
                    {data.length > 0 ? (
                        <div className="adu-users-table-container">
                            <table className='adu-users-table'>
                                <thead>
                                    {table.getHeaderGroups().map(headerGroup => {
                                        return (
                                            <tr key={headerGroup.id}>
                                                {headerGroup.headers.map(header => ( // map over the headerGroup headers array
                                                    <th key={header.id}>
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </th>
                                                ))}
                                            </tr>
                                        )
                                    })}
                                </thead>
                                <tbody>
                                    {table.getRowModel().rows.map(row => (
                                        <tr key={row.id}>
                                            {row.getVisibleCells().map(cell => (
                                                <td key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="adu-no-users-container">
                            No Fundraiser Found!
                        </div>
                    )}

                    {data.length > 0 && (
                        <div className="adu-pagination-container">
                            <div className="adu-user-count">
                                {`Showing ${data.length} ${data.length > 1 ? "fundraisers" : "fundraiser"} out of ${totalFundraisers}`}
                            </div>
                            <div className="adu-pagination-control">
                                <button
                                    onClick={() => setPageIndex(prev => Math.max(prev - 1, 0))}
                                    disabled={!canPreviousPage}
                                    className='adu-page-text-btn'
                                >
                                    Previous
                                </button>

                                <span>
                                    Page ( {pageIndex + 1} / {table.getPageCount()} )
                                </span>

                                <button
                                    onClick={() => setPageIndex(prev => Math.min(prev + 1, table.getPageCount() - 1))}
                                    disabled={!canNextPage}
                                    className='adu-page-text-btn'
                                >
                                    Next
                                </button>
                            </div>

                        </div>
                    )}

                    {actionLoading && (
                        <div className="adu-action-loading-container">
                            {actionInfo ? (
                                <div className="adu-action-loading-content">
                                    <div className="adu-action-content-icon"><FaCheckCircle /></div>
                                    <div className="adu-action-content-text">{actionInfo}</div>
                                    <button className="adu-action-content-btn" onClick={(e) => { handleOkClick(); }}>OK</button>
                                </div>
                            ) : (
                                actionError ? (
                                    <div className="adu-action-loading-content adu-action-loading-error">
                                        <div className="adu-action-content-icon"><MdError /></div>
                                        <div className="adu-action-content-text">{actionError}</div>
                                        <button className="adu-action-content-btn" onClick={(e) => { handleOkClick(); }}>OK</button>
                                    </div>
                                ) : (
                                    <MoonLoader size={100} color='var(--btn-secondary)' />
                                )
                            )}
                        </div>
                    )}
                    {showContent && (
                        <div className="adf-fundraiser-details-container">
                            {currentDetails && (
                                <div ref={detailsRef} className="adf-fundraiser-details">
                                    <button className="adf-hide-popup-btn" onClick={(e) => { handleHideClick(); }}><IoClose /></button>
                                    <ul className="adf-fundraiser-details-content">
                                        <h2 className="adf-popup-title">Fundraiser Details:</h2>
                                        <li className="adf-preview-item">
                                            <h3 className="adf-item-title">Cover Image</h3>
                                            <picture>
                                                <Image className='adf-preview-photo' src={getImageUrl(currentDetails.photo)} width={400} height={300} alt="" />
                                            </picture>
                                        </li>

                                        <li className="adf-preview-item">
                                            <h3 className="adf-item-title">Title</h3>
                                            <p className="adf-item-desc">{currentDetails.title}</p>
                                        </li>

                                        <li className="adf-preview-line"></li>

                                        <li className="adf-preview-item">
                                            <h3 className="adf-item-title">Starting Goal</h3>
                                            <p className="adf-item-desc">{currentDetails.goal}</p>
                                        </li>

                                        <li className="adf-preview-line"></li>

                                        <li className="adf-preview-item">
                                            <h3 className="adf-item-title">Category</h3>
                                            <p className="adf-item-desc">{currentDetails.category}</p>
                                        </li>

                                        <li className="adf-preview-line"></li>

                                        <li className="adf-preview-item">
                                            <h3 className="adf-item-title">Fundraising for</h3>
                                            <p className="adf-item-desc">{currentDetails.type}</p>
                                        </li>

                                        <li className="adf-preview-line"></li>

                                        <li className="adf-preview-item">
                                            <h3 className="adf-item-title">Description</h3>
                                            <p className="adf-item-desc">{showDesc ? currentDetails.description : `${currentDetails.description.slice(0, 150)}...`}</p>
                                            <button className='adf-show-less-more' onClick={(e) => {setShowDesc(!showDesc);}} type="button">{showDesc ? "Show Less" : "Show More"}</button>
                                        </li>

                                        <h2 className="adf-popup-title2">Beneficiary Details:</h2>

                                        <li className="adf-preview-item">
                                            <h3 className="adf-item-title">Full Name</h3>
                                            <p className="adf-item-desc">{currentDetails.beneficiary[0].name}</p>
                                        </li>

                                        <li className="adf-preview-line"></li>

                                        <li className="adf-preview-item">
                                            <h3 className="adf-item-title">Phone Number</h3>
                                            <p className="adf-item-desc">{currentDetails.beneficiary[0].name}</p>
                                        </li>

                                        <li className="adf-preview-line"></li>

                                        <li className="adf-preview-item">
                                            <h3 className="adf-item-title">Address</h3>
                                            <p className="adf-item-desc">{getAddress(currentDetails.beneficiary)}</p>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}

                </>
            )}

        </div>
    )
}

export default Fundraisers
