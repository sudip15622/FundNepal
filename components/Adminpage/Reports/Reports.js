"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { getAllReports, deleteReport } from '@/actions/handleReports';
import { useDebounce } from '@/hooks/useDebounce';
import { MoonLoader } from 'react-spinners';
import Link from 'next/link';
import Image from 'next/image';
import "./Reports.css";

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdDelete, MdError, MdReport } from "react-icons/md";
import { FaCheckCircle, FaEye } from 'react-icons/fa';

const Reports = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalReports, setTotalReports] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortReport, setSortReport] = useState('desc');
    const [causeFilter, setCauseFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionPopup, setActionPopup] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const actionRef = useRef(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    const [actionInfo, setActionInfo] = useState('');

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await getAllReports(pageIndex, pageSize, sortReport, debouncedSearchQuery, causeFilter);
            if (response.success) {
                setData(response.reports);
                setTotalReports(response.totalReports);
            } else {
                console.error(response);
            }
            setLoading(false);

        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        fetchReports();
    }, [pageIndex, pageSize, sortReport, debouncedSearchQuery, causeFilter])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (actionRef.current && !actionRef.current.contains(event.target)) {
                setActionPopup(false);
                setSelectedAction(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [actionRef]);

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

    const handleDeleteReport = async (id) => {
        setActionLoading(true);
        const response = await deleteReport(id);
        if (response.success) {
            setActionInfo("Successfully deleted Report!");
        } else {
            setActionError(response.nextError);
        }
    }

    const handleOkClick = () => {
        setActionLoading(false);
        setActionInfo('');
        setActionError('');
        fetchReports();
    }

    const columns = [
        {
            header: 'Causes',
            cell: ({ row }) => {
                const { causes } = row.original;
                return (
                    <div className="adr-causes-container">
                        {causes.map((cause, index) => {
                            return (
                                <div key={index} className="adr-cause-item">
                                    <div className="adr-cause-item-icon"><MdReport /></div>
                                    <div className="adr-cause-item-text">{cause}</div>
                                </div>
                            )
                        })}
                    </div>
                );
            },
        },
        {
            header: 'Reporter',
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
            header: 'Fundraiser',
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
            header: 'Date',
            accessorKey: 'dateReported',
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
                                        <div className="adu-popup-inside-divs adu-delete-user-div" onClick={(e) => { handleDeleteReport(id) }}>
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
        pageCount: Math.ceil(totalReports / pageSize),
    })

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < table.getPageCount() - 1;


    return (
        <div className='adu-users-container'>
            <div className="adu-users-header">
                <h1 className="adu-users-title">All Reports</h1>
                <p className="adu-users-text">Below is the list of all reports actioned here in FundNepal.</p>
            </div>

            <div className="adu-users-filters-container">
                <input
                    type="text"
                    placeholder="Search report"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="adu-search-input"
                />

                <select
                    value={sortReport}
                    onChange={(e) => setSortReport(e.target.value)}
                    className="adu-sort-select"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>

                <select
                    value={causeFilter}
                    onChange={(e) => setCauseFilter(e.target.value)}
                    className="adu-sort-select"
                >
                    <option value="">All Causes</option>
                    <option value="Fraudulent Activity">Fraudulent Activity</option>
                    <option value="Misuse of Funds">Misuse of Funds</option>
                    <option value="Inappropriate Content">Inappropriate Content</option>
                    <option value="Violation of Policies">Violation of Policies</option>
                    <option value="Unauthorized Fundraiser">Unauthorized Fundraiser</option>
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
                            No Report Found!
                        </div>
                    )}

                    {data.length > 0 && (
                        <div className="adu-pagination-container">
                            <div className="adu-user-count">
                                {`Showing ${data.length} ${data.length > 1 ? "reports" : "report"} out of ${totalReports}`}
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
                </>
            )}

        </div>
    )
}

export default Reports
