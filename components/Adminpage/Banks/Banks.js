"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { getBanksForAdmin, deleteBankByAdmin, changeBankStatus } from '@/actions/handleBank';
import { useDebounce } from '@/hooks/useDebounce';
import { MoonLoader } from 'react-spinners';
import Image from 'next/image';

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdDelete, MdError } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { FaCheckCircle } from 'react-icons/fa';

const Banks = () => {

    // const table = useReactTable();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalBanks, setTotalBanks] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortBank, setSortBank] = useState('desc');
    const [statusFilter, setStatusFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionPopup, setActionPopup] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const actionRef = useRef(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    const [actionInfo, setActionInfo] = useState('');

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const getAllBanks = async () => {
        try {
            setLoading(true);
            const response = await getBanksForAdmin(pageIndex, pageSize, sortBank, debouncedSearchQuery, statusFilter);
            if (response.success) {
                setData(response.banks);
                setTotalBanks(response.totalBanks);
            } else {
                console.error(response);
            }
            setLoading(false);

        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getAllBanks();
    }, [pageIndex, pageSize, sortBank, debouncedSearchQuery, statusFilter]);

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

    const handleChangeStatus = async (id, status) => {
        setActionLoading(true);
        const response = await changeBankStatus(id, status);
        if (response.success) {
            setActionInfo("Successfully changed bank's status!");
        } else {
            setActionError(response.error);
        }
    }

    const handleDeleteBank = async (id) => {
        setActionLoading(true);
        const response = await deleteBankByAdmin(id);
        if (response.success) {
            setActionInfo("Successfully deleted bank!");
        } else {
            setActionError(response.error);
        }
    }

    const handleOkClick = () => {
        setActionLoading(false);
        setActionInfo('');
        setActionError('');
        getAllBanks();
    }

    const columns = [
        {
            header: 'Bank Name',
            cell: ({ row }) => {
                const { bankName } = row.original;
                return (
                    <span className="adu-users-table-spans">{bankName}</span>
                );
            },
        },
        {
            header: `Holder's Name`,
            cell: ({ row }) => {
                const { holderName } = row.original;
                return (
                    <span className="adu-users-table-spans">{holderName}</span>
                );
            },
        },
        {
            header: 'Account No.',
            cell: ({ row }) => {
                const { accountNumber } = row.original;
                return (
                    <span className="adu-users-table-spans">{accountNumber}</span>
                );
            },
        },
        {
            header: 'Mobile No.',
            cell: ({ row }) => {
                const { mobileNumber } = row.original;
                return (
                    <span className="adu-users-table-spans">{mobileNumber}</span>
                );
            },
        },
        {
            header: 'User',
            cell: ({ row }) => {
                const { user } = row.original;
                return (
                    <div className="adu-users-name-container">
                        <picture className='adu-users-avatar-container'>
                            <Image className='adu-users-avatar' src={user.avatar !== '' ? user.avatar : "/user.png"} width={50} height={45} alt="user-avatar" />
                        </picture>
                        <span className="adu-users-table-spans">{user.name}</span>
                    </div>
                );
            },
        },
        {
            header: 'Status',
            cell: ({ row }) => {
                const { status } = row.original;
                return (
                    <span className={`adu-users-table-spans ${status === 'Active' ? "adf-published" : "adf-draft"}`}>{status}</span>
                );
            },
        },
        {
            header: 'Date',
            accessorKey: 'dateAdded',
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
                                    <div className="adu-order-action-popup" ref={actionRef}>
                                        <div className={`adu-popup-inside-divs ${status === 'Pending' ? "adf-published" : "adf-draft"}`} onClick={(e) => { handleChangeStatus(id, status) }}>
                                            <div className="adu-inside-div-icon"><RiAdminFill /></div>
                                            {status === 'Active' ? <div className="adu-inside-div-text">Mark as Pending</div> : <div className="adu-inside-div-text">Mark as Active</div>}
                                        </div>
                                        <div className="adu-popup-inside-divs adu-delete-user-div" onClick={(e) => { handleDeleteBank(id); }}>
                                            <div className="adu-inside-div-icon"><MdDelete /></div>
                                            <div className="adu-inside-div-text">Delete Bank</div>
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
        pageCount: Math.ceil(totalBanks / pageSize),
    })

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < table.getPageCount() - 1;


    return (
        <div className='adu-users-container'>
            <div className="adu-users-header">
                <h1 className="adu-users-title">All Banks</h1>
                <p className="adu-users-text">Below is the list of all banks added in FundNepal.</p>
            </div>

            <div className="adu-users-filters-container">
                <input
                    type="text"
                    placeholder="Search bank"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="adu-search-input"
                />

                <select
                    value={sortBank}
                    onChange={(e) => setSortBank(e.target.value)}
                    className="adu-sort-select"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="adu-sort-select"
                >
                    <option value="">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
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
                            No Bank Found!
                        </div>
                    )}

                    {data.length > 0 && (
                        <div className="adu-pagination-container">
                            <div className="adu-user-count">
                                {`Showing ${data.length} ${data.length > 1 ? "banks" : "bank"} out of ${totalBanks}`}
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

export default Banks
