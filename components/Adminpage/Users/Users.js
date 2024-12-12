"use client"
import React, { useState, useEffect, useRef} from 'react'
import { useReactTable, getCoreRowModel, flexRender, getPaginationRowModel, getSortedRowModel } from '@tanstack/react-table';
import { getUsers, changeUserRole, deleteUserByAdmin } from '@/actions/handleLogin';
import { useDebounce } from '@/hooks/useDebounce';
import { MoonLoader } from 'react-spinners';
import Image from 'next/image';
import "./Users.css";

import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdDelete, MdError } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { FaCheckCircle } from 'react-icons/fa';

const Users = () => {

    // const table = useReactTable();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageIndex, setPageIndex] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [sortUser, setSortUser] = useState('desc');
    const [roleFilter, setRoleFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [actionPopup, setActionPopup] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const actionRef = useRef(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState('');
    const [actionInfo, setActionInfo] = useState('');

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const getAllUsers = async () => {
        try {
            setLoading(true);
            const response = await getUsers(pageIndex, pageSize, sortUser, debouncedSearchQuery, roleFilter);
            if (response.success) {
                setData(response.users);
                setTotalUsers(response.totalUsers);
                // console.log(response.users);
            } else {
                console.error(response);
            }
            setLoading(false);

        } catch (error) {
            console.error(error.message);
        }
    }

    useEffect(() => {
        getAllUsers();
    }, [pageIndex, pageSize, sortUser, debouncedSearchQuery, roleFilter]);

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

    const handleMakeAdmin = async (id, role) => {
        setActionLoading(true);
        const response = await changeUserRole(id, role);
        if (response.success) {
            setActionInfo("Successfully changed user's role!");
        } else {
            setActionError(response.error);
        }
    }

    const handleDeleteUser = async (id) => {
        setActionLoading(true);
        const response = await deleteUserByAdmin(id);
        if (response.success) {
            setActionInfo("Successfully deleted user!");
        } else {
            setActionError(response.error);
        }
    }

    const handleOkClick = () => {
        setActionLoading(false);
        setActionInfo('');
        setActionError('');
        getAllUsers();
    }

    const columns = [
        {
            header: 'Name',
            cell: ({ row }) => {
                const { name, avatar } = row.original;
                return (
                    <div className="adu-users-name-container">
                        <picture className='adu-users-avatar-container'>
                            <Image className='adu-users-avatar' src={avatar!=='' ? avatar : "/user.png"} width={50} height={45} alt="user-avatar" />
                        </picture>
                        <span className="adu-users-table-spans">{name}</span>
                    </div>
                );
            },
        },
        {
            header: 'Username',
            cell: ({ row }) => {
                const { userName } = row.original;
                return (
                    <span className="adu-users-table-spans">{userName}</span>
                );
            },
        },
        {
            header: 'Email',
            cell: ({ row }) => {
                const { email } = row.original;
                return (
                    <span className="adu-users-table-spans">{email}</span>
                );
            },
        },
        // {
        //     header: 'Phone',
        //     cell: ({ row }) => {
        //         const { phone } = row.original;
        //         return (
        //             <span className="adu-users-table-spans">{phone ? phone : "Not Set"}</span>
        //         );
        //     },
        // },
        {
            header: 'Role',
            cell: ({ row }) => {
                const { role } = row.original;
                return (
                    <span className="adu-users-table-spans">{role}</span>
                );
            },
        },
        {
            header: 'Date Joined',
            accessorKey: 'dateJoined',
            cell: ({ getValue }) => getDate(getValue()),
        },
        {
            header: 'Action',
            cell: ({ row }) => {
                const { id, role } = row.original;
                return (
                    <>
                        <button type='button' className="adu-users-table-spans adu-action-btn" onClick={(e) => { setActionPopup(!actionPopup); setSelectedAction(row.original); }}><HiOutlineDotsHorizontal /></button>
                        {actionPopup ?
                            <>
                                {selectedAction.id === row.original.id ?
                                    <div className="adu-order-action-popup" ref={actionRef}>
                                        <div className="adu-popup-inside-divs" onClick={(e) => { handleMakeAdmin(id, role); }}>
                                            <div className="adu-inside-div-icon"><RiAdminFill /></div>
                                            {role === 'Admin' ? <div className="adu-inside-div-text">Remove Admin</div> : <div className="adu-inside-div-text">Make Admin</div>}
                                        </div>
                                        <div className="adu-popup-inside-divs adu-delete-user-div" onClick={(e) => { handleDeleteUser(id); }}>
                                            <div className="adu-inside-div-icon"><MdDelete /></div>
                                            <div className="adu-inside-div-text">Delete User</div>
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
        pageCount: Math.ceil(totalUsers / pageSize),
    })

    const canPreviousPage = pageIndex > 0;
    const canNextPage = pageIndex < table.getPageCount() - 1;


    return (
        <div className='adu-users-container'>
            <div className="adu-users-header">
                <h1 className="adu-users-title">All Users</h1>
                <p className="adu-users-text">Below is the list of all users now in FundNepal.</p>
            </div>

            <div className="adu-users-filters-container">
                <input
                    type="text"
                    placeholder="Search user"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="adu-search-input"
                />

                <select
                    value={sortUser}
                    onChange={(e) => setSortUser(e.target.value)}
                    className="adu-sort-select"
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="adu-sort-select"
                >
                    <option value="">All Role</option>
                    <option value="Admin">Admin</option>
                    <option value="User">User</option>
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
                            No Users Found!
                        </div>
                    )}

                    {data.length > 0 && (
                        <div className="adu-pagination-container">
                            <div className="adu-user-count">
                                {`Showing ${data.length} ${data.length > 1 ? "users" : "user"} out of ${totalUsers}`}
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
                                    <button className="adu-action-content-btn" onClick={(e) => {handleOkClick();}}>OK</button>
                                </div>
                            ) : (
                                actionError ? (
                                    <div className="adu-action-loading-content adu-action-loading-error">
                                        <div className="adu-action-content-icon"><MdError /></div>
                                        <div className="adu-action-content-text">{actionError}</div>
                                        <button className="adu-action-content-btn" onClick={(e) => {handleOkClick();}}>OK</button>
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

export default Users
