"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
// import { getFundraisersForAdmin, deleteFundraiser, changeFundraiserStatus } from '@/actions/getFundraisers';
import { getDonationForAdmin, deleteDonation } from '@/actions/getDonations';
import { useDebounce } from '@/hooks/useDebounce';
import { MoonLoader } from 'react-spinners';
import Link from 'next/link';
import Image from 'next/image';
import "./Donations.css";

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdDelete, MdError } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { FaCheckCircle, FaEye } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { BiSolidDonateHeart, BiDonateHeart } from "react-icons/bi";

const Donations = () => {

    // const table = useReactTable();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalDonations, setTotalDonations] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortDonation, setSortDonation] = useState('desc');
    const [methodFilter, setMethodFilter] = useState('');
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

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const getAllDonations = async () => {
        try {
            setLoading(true);
            const response = await getDonationForAdmin(pageIndex, pageSize, sortDonation, debouncedSearchQuery, methodFilter);
            if (response.success) {
                setData(response.donations);
                setTotalDonations(response.totalDonations);
            } else {
                console.error(response);
            }
            setLoading(false);

        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getAllDonations();
    }, [pageIndex, pageSize, sortDonation, debouncedSearchQuery
        , methodFilter])

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

    // const handleChangeStatus = async (id, status) => {
    //     setActionLoading(true);
    //     const response = await changeFundraiserStatus(id, status);
    //     if (response.success) {
    //         setActionInfo("Successfully changed fundraiser's status!");
    //     } else {
    //         setActionError(response.error);
    //     }
    // }

    const handleDeleteDonation = async (id) => {
        setActionLoading(true);
        const response = await deleteDonation(id);
        if (response.success) {
            setActionInfo("Successfully deleted Donation!");
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
        getAllDonations();
    }

    const columns = [
        {
            header: 'Amount',
            cell: ({ row }) => {
                const { donationAmount } = row.original;
                return (
                    <div className="adf-users-name-container">
                        <div className='add-donations-column-icon'>
                            <BiSolidDonateHeart />
                        </div>
                        <div className="add-donations-column-amount">Rs. {donationAmount}</div>
                    </div>
                );
            },
        },
        {
            header: 'Donor',
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
            header: 'Donated To',
            cell: ({ row }) => {
                const { fundraiser } = row.original;
                return (
                    <div className="adf-users-name-container">
                        <picture className='adf-fundraiser-cover-container'>
                            <Image className='adf-users-avatar' src={getImageUrl(fundraiser.photo)} width={50} height={45} alt="user-avatar" />
                        </picture>
                        <Link href={`/fundraisers/${fundraiser.slug}`} className="adf-fundraiser-title">{fundraiser.title}</Link>
                    </div>
                );
            },
        },
        {
            header: 'Payment Method',
            cell: ({ row }) => {
                const { paymentMethod } = row.original;
                return (
                    <div className="adf-users-name-container">
                        <picture className='adf-users-avatar-container add-wallet-logo'>
                            <Image className='adf-users-avatar' src={paymentMethod === 'Khalti' ? "/khalti_logo.png" : "/esewa_logo.png"} width={50} height={45} alt="user-avatar" />
                        </picture>
                        <span className="adf-users-table-spans">{paymentMethod}</span>
                    </div>
                );
            },
        },
        {
            header: 'Date Donated',
            accessorKey: 'dateDonated',
            cell: ({ getValue }) => getDate(getValue()),
        },
        {
            header: 'Action',
            cell: ({ row }) => {
                const { id } = row.original;
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
                                        <div className="adu-popup-inside-divs adu-delete-user-div" onClick={(e) => { handleDeleteDonation(id) }}>
                                            <div className="adu-inside-div-icon"><MdDelete /></div>
                                            <div className="adu-inside-div-text">Delete Donation</div>
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
        pageCount: Math.ceil(totalDonations / pageSize),
    })

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < table.getPageCount() - 1;


    return (
        <div className='adu-users-container'>
            <div className="adu-users-header">
                <h1 className="adu-users-title">All Donations</h1>
                <p className="adu-users-text">Below is the list of all donations made here in FundNepal.</p>
            </div>

            <div className="adu-users-filters-container">
                <input
                    type="text"
                    placeholder="Search donation"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="adu-search-input"
                />

                <select
                    value={sortDonation}
                    onChange={(e) => setSortDonation(e.target.value)}
                    className="adu-sort-select"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>

                <select
                    value={methodFilter}
                    onChange={(e) => setMethodFilter(e.target.value)}
                    className="adu-sort-select"
                >
                    <option value="">All Methods</option>
                    <option value="Khalti">Khalti</option>
                    <option value="eSewa">eSewa</option>
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
                            No Donation Found!
                        </div>
                    )}

                    {data.length > 0 && (
                        <div className="adu-pagination-container">
                            <div className="adu-user-count">
                                {`Showing ${data.length} ${data.length > 1 ? "donations" : "donation"} out of ${totalDonations}`}
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
                                <div ref={detailsRef} className="add-fundraiser-details">
                                    <button className="adf-hide-popup-btn" onClick={(e) => { handleHideClick(); }}><IoClose /></button>
                                    <div className="add-view-donation-details">
                                        <h2 className="add-popup-title">Donation Details:</h2>
                                        <ul className="add-donation-details-list">
                                            <li className="add-donation-fundraiser">
                                                <Link href={`/fundraisers/${currentDetails.fundraiser.slug}`}>
                                                    <picture className="add-donation-fundraiser-cover">
                                                        <Image className='add-donation-fundraiser-image' src={getImageUrl(currentDetails.fundraiser.photo)} width={150} height={80} alt="fundraiser-cover" />
                                                    </picture>
                                                    <div className="add-donation-fundraiser-details">
                                                        <h3 className="add-donation-fundraiser-title">{currentDetails.fundraiser.title}</h3>
                                                        <p className="add-donation-fundraiser-text">{currentDetails.user.name} have supported this fundraiser with Rs.{currentDetails.donationAmount}</p>
                                                    </div>
                                                </Link>
                                            </li>
                                            <li className="add-donation-details-listitem add-listitem-first">
                                                <span className="add-donation-details-key">Donation Amount:</span>
                                                <span className="add-donation-details-value">Rs.{currentDetails.donationAmount}</span>
                                            </li>
                                            <li className="add-donation-details-listitem add-listitem-first">
                                                <span className="add-donation-details-key">Service Charge:</span>
                                                <span className="add-donation-details-value">Rs.{currentDetails.serviceCharge}</span>
                                            </li>
                                            <li className="add-donation-details-listitem add-listitem-first">
                                                <span className="add-donation-details-key">Total Amount:</span>
                                                <span className="add-donation-details-value">Rs.{currentDetails.totalAmount}</span>
                                            </li>
                                        </ul>

                                        <div className="add-donation-line"></div>

                                        <h2 className="add-popup-title2">Transaction Details:</h2>

                                        <ul className="add-transaction-details-list">
                                            <li className="add-donation-details-listitem">
                                                <span className="add-donation-details-key">Payment Method:</span>
                                                <span className="add-donation-details-value">{currentDetails.paymentMethod}</span>
                                            </li>
                                            <li className="add-donation-details-listitem">
                                                <span className="add-donation-details-key">pidx:</span>
                                                <span className="add-donation-details-value">{currentDetails.pidx}</span>
                                            </li>
                                            <li className="add-donation-details-listitem">
                                                <span className="add-donation-details-key">Status:</span>
                                                <span className="add-donation-details-value">{currentDetails.status}</span>
                                            </li>
                                            <li className="add-donation-details-listitem">
                                                <span className="add-donation-details-key">Purchase Order Id:</span>
                                                <span className="add-donation-details-value">{currentDetails.purchase_order_id}</span>
                                            </li>
                                            <li className="add-donation-details-listitem">
                                                <span className="add-donation-details-key">Purchase Order Name:</span>
                                                <span className="add-donation-details-value">{currentDetails.purchase_order_name}</span>
                                            </li>
                                            <li className="add-donation-details-listitem">
                                                <span className="add-donation-details-key">Transaction Id:</span>
                                                <span className="add-donation-details-value">{currentDetails.transaction_id}</span>
                                            </li>
                                            <li className="add-donation-details-listitem">
                                                <span className="add-donation-details-key">Total Amount:</span>
                                                <span className="add-donation-details-value">Rs.{currentDetails.totalAmount}</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </>
            )}

        </div>
    )
}

export default Donations
