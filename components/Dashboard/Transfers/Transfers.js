"use client"
import React, { useState, useEffect, useRef } from 'react'
import "./Transfers.css";
import InputBox from './InputBox';
import { isValidAccountNumber, isValidMobileNumber, isValidHolderName } from '@/utils/validateBank';
import { saveBankDetails, getBankDetails } from '@/actions/handleBank';

import { FaPlus } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { BiSolidBank } from "react-icons/bi";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";
import { MoonLoader } from "react-spinners";
import { MdChangeCircle } from "react-icons/md";


const Transfers = ({ user }) => {

    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({ bankName: '', holderName: '', accountNumber: '', mobileNumber: '' });
    const [inputErrors, setInputErrors] = useState({ holderName: '', accountNumber: '', mobileNumber: '' });
    const [showBanks, setShowBanks] = useState(false);
    const bankRef = useRef(null);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveInfo, setSaveInfo] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [bankDetails, setBankDetails] = useState(null);

    // const [amountToRecieve, setAmountToRecieve] = useState(0);

    const fetchBankDetails = async () => {
        const response = await getBankDetails(user.id);
        if (response.success) {
            setBankDetails(response.data);
            // setBankDetails(null);
        }
        setLoading(false);
    }

    // const getTransferAmount = async () => {
    //     const response = await getAmountsToRecieve(user.id);
    //     if (response.success) {
    //         setAmountToRecieve(response.totalAmount);
    //     }
    // }

    useEffect(() => {
        fetchBankDetails();
        // getTransferAmount();
    }, [])


    const bankLists = [
        "AGRICULTURAL DEVELOPMENT BANK LTD.",
        "BEST FINANCE COMPANY LTD.",
        "CENTRAL FINANCE LTD.",
        "CITIZENS BANK INTL. LTD.",
        "EVEREST BANK LTD.",
        "EXCEL DEVELOPMENT BANK LTD.",
        "GARIMA BIKAS BANK LTD.",
        "GLOBAL IME BANK LTD.",
        "GOODWILL FINANCE LTD.",
        "GREEN DEVELOPMENT BANK LTD.",
        "GUHESWORI MERCHANT BANK & FINANCE LTD.",
        "GURKHAS FINANCE LTD.",
        "HIMALAYAN BANK LTD.",
        "ICFC FINANCE LTD.",
        "JYOTI BIKAS BANK LTD.",
        "KAMANA SEWA BIKAS BANK LTD.",
        "KARNALI DEVELOPMENT BANK LTD.",
        "KISAN BAHUUDDESHIYA SAHAKARI SANSTHA LTD.",
        "KUMARI BANK LTD.",
        "LAXMI SUNRISE BANK LTD.",
        "LUMBINI BIKAS BANK LTD.",
        "MACHHAPUCHCHHRE BANK LTD.",
        "MAHALAXMI BIKAS BANK LTD.",
        "MANJUSHREE FINANCE LTD.",
        "MITERI DEVELOPMENT BANK LTD.",
        "MUKTINATH BIKAS BANK LTD.",
        "MULTIPURPOSE FINANCE LIMITED",
        "NABIL BANK LTD.",
        "NARAYANI DEVELOPMENT BANK",
        "NAVAJEEVAN CO-OPERATIVES LIMITED",
        "NAWAKANTIPUR SAVING & CREDIT CO-OPERATIVE SOCIETY",
        "NEPAL BANK LTD.",
        "NEPAL FINANCE LIMITED.",
        "NEPAL INVESTMENT MEGA BANK LTD.",
        "NEPAL SBI BANK LTD.",
        "NIC ASIA BANK LTD.",
        "NMB BANK LTD.",
        "OrangeNXT",
        "POKHARA FINANCE LTD.",
        "PRABHU BANK LTD.",
        "PRIME COMMERCIAL BANK LTD.",
        "PROGRESSIVE FINANCE LTD.",
        "RASTRIYA BANIJYA BANK LTD.",
        "RELIANCE FINANCE LTD.",
        "SALAPA BIKAS  BANK LTD.",
        "SAMRIDDHI FINANCE COMAPNY LIMITED",
        "SANIMA BANK LTD.",
        "SAPTAKOSHI DEVELOPMENT BANK LTD.",
        "SHANGRI-LA DEVELOPMENT BANK LTD.",
        "SHINE RESUNGA DEVELOPMENT BANK LTD.",
        "SHREE INVESTMENT & FINANCE COMPANY LTD.",
        "SIDDHARTHA BANK LTD.",
        "SINDHU BIKAS BANK LTD.",
    ]

    useEffect(() => {
        function handleClickOutside(event) {
            if (bankRef.current && !bankRef.current.contains(event.target)) {
                setShowBanks(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [bankRef]);

    const validateFunctions = {
        holderName: isValidHolderName,
        accountNumber: isValidAccountNumber,
        mobileNumber: isValidMobileNumber
    }

    const handleInputChange = (key, value) => {
        const validate = validateFunctions[key](value);
        if (!validate.success) {
            setInputErrors({ ...inputErrors, [key]: validate.error });
        } else {
            setInputErrors({ ...inputErrors, [key]: '' });
        }
        setFormData({ ...formData, [key]: value });
    }

    const isFormValid = () => {
        return (
            Object.values(inputErrors).every(error => error === '') &&
            Object.values(formData).every(value => value.trim() !== '')
        );
    };

    const handleBankSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid()) {
            return;
        }

        const validate1 = validateFunctions.holderName(formData.holderName);
        const validate2 = validateFunctions.accountNumber(formData.accountNumber);
        const validate3 = validateFunctions.mobileNumber(formData.mobileNumber);

        if (!validate1.success) {
            setInputErrors({ ...inputErrors, holderName: validate1.error });
            return;
        }
        if (!validate2.success) {
            setInputErrors({ ...inputErrors, accountNumber: validate2.error });
            return;
        }
        if (!validate3.success) {
            setInputErrors({ ...inputErrors, mobileNumber: validate3.error });
            return;
        }

        setSaveLoading(true);
        setSaveError('');
        setSaveInfo('');

        const response = await saveBankDetails(user.id, formData);

        if (response.success) {
            setSaveInfo('Bank details saved successfully!');
            setFormData({ bankName: '', holderName: '', accountNumber: '', mobileNumber: '' });
            setInputErrors({ holderName: '', accountNumber: '', mobileNumber: '' });
        } else {
            setSaveError(response.error ? response.error : 'Something went wrong!');
        }
    }

    const handleOkClick = () => {
        setSaveLoading(false);
        setSaveError('');
        setSaveInfo('');
    }
    const handleOkClickDone = () => {
        setSaveLoading(false);
        setSaveError('');
        setSaveInfo('');
        fetchBankDetails();
        setShowForm(false);
    }

    const getDate = (date) => {
        const formattedDate = new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return formattedDate;
    }

    const hanldeShowForm = () => {
        setShowForm(true);
        if (bankDetails) {
            setFormData({ bankName: bankDetails.bankName, holderName: bankDetails.holderName, accountNumber: bankDetails.accountNumber, mobileNumber: bankDetails.mobileNumber });
        }
    }

    const handleCancelClick = () => {
        setShowForm(false);
        setFormData({ bankName: '', holderName: '', accountNumber: '', mobileNumber: '' });
        setInputErrors({ holderName: '', accountNumber: '', mobileNumber: '' });
    }

    return (
        <div className='bt-transfers-container'>
            <div className="bt-transfers-header">
                <h1 className="bt-transfers-title">Your Bank Account</h1>
                <p className="bt-transfers-text">Here you can view your bank details.</p>
            </div>

            {loading ? (
                <div className="bt-loading">
                    <MoonLoader size={100} color='var(--btn-secondary)' />
                </div>
            ) : (
                <>
                    {!showForm && (bankDetails && (
                        <div className='bt-details-and-amount'>
                            <div className="bt-bank-details-container">
                                <div className="bt-bank-details-left">
                                    <div className="bt-details-left-icon"><BiSolidBank /></div>
                                    <div className="bt-details-left-status">{bankDetails.status}</div>
                                </div>
                                <div className="bt-bank-details-right">
                                    <div className="bt-bank-details-bankname">{bankDetails.bankName}</div>
                                    <div className="bt-bank-details-item"><span>Account Number:</span> <b>{bankDetails.accountNumber}</b></div>
                                    <div className="bt-bank-details-item"><span>Account Holder&apos; Name:</span> <b>{bankDetails.holderName}</b></div>
                                    <div className="bt-bank-details-item"><span>Mobile Number:</span> <b>{bankDetails.mobileNumber}</b></div>
                                </div>
                                <div className="bt-bank-added-date">Added On: {getDate(bankDetails.dateAdded)}</div>
                            </div>

                            {/* <div className="bt-amount-to-recieve">
                                <div className="bt-recieving-amount-text">Amount to Recieve</div>
                                <div className="bt-recieving-amount">Rs. {amountToRecieve}</div>
                            </div> */}
                        </div>
                    ))}

                    <div className="bt-add-bank-container">
                        {!bankDetails && <div className="bt-note-section"><i><b>Note:</b> You must add a bank account in order to publish your fundraiser and recieve funds.</i></div>}

                        {bankDetails ? (
                            !showForm && (
                                <button type='button' className='bt-add-bank-btn' onClick={(e) => { hanldeShowForm(); }}>
                                    <span className='bt-add-btn-text'>Change Bank Details</span>
                                    <span className='bt-add-btn-icon'><MdChangeCircle /></span>
                                </button>
                            )
                        ) : (
                            !showForm && (
                                <button type='button' className='bt-add-bank-btn' onClick={(e) => { hanldeShowForm(); }}>
                                    <span className='bt-add-btn-text'>Add Bank Details</span>
                                    <span className='bt-add-btn-icon'><FaPlus /></span>
                                </button>
                            )
                        )}

                        {showForm && (
                            <div className="bt-add-bank-form-container">
                                <div className="bt-add-bank-header">
                                    <h2 className="bt-add-bank-title">Provide Bank Details:</h2>
                                    <p className="bt-add-bank-text">Make sure you have provided same details as in your bank account.</p>
                                </div>

                                <form className="bt-add-bank-form" onSubmit={(e) => { handleBankSubmit(e); }}>
                                    <div className="bt-select-bank" ref={bankRef}>
                                        <div className={`bt-select-bank-selected ${showBanks && 'bt-selected'}`} onClick={(e) => { setShowBanks(!showBanks) }}>
                                            <span className="bt-selected-name">{formData.bankName !== '' ? formData.bankName : "Select Bank"}</span>
                                            <span className="bt-select-bank-icon"><FaAngleDown /></span>
                                        </div>

                                        {showBanks && (
                                            <ul className="bt-select-bank-options-list">
                                                {bankLists.map((bank, index) => {
                                                    return (
                                                        <li key={index} className={`bt-select-bank-option ${bank === formData.bankName && "bt-selected-option"}`} onClick={(e) => { setFormData({ ...formData, bankName: bank }); setShowBanks(false) }}>
                                                            <span className='bt-select-option-icon'><BiSolidBank /></span>
                                                            <span>{bank}</span>
                                                        </li>
                                                    )
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                    <InputBox type='text' value={formData.holderName} name='holderName' label={`Account Holder's Name`} error={inputErrors.holderName} changeFunction={handleInputChange} />
                                    <InputBox type='number' value={formData.accountNumber} name='accountNumber' label='Account Number' error={inputErrors.accountNumber} changeFunction={handleInputChange} />
                                    <InputBox type='number' value={formData.mobileNumber} name='mobileNumber' label='Mobile Number' error={inputErrors.mobileNumber} changeFunction={handleInputChange} />
                                    <div className="bt-add-bank-buttons">
                                        <button className='bt-save-details-btn bt-cancel-btn' onClick={(e) => { handleCancelClick(); }} type="button">Cancel</button>
                                        <button disabled={!isFormValid()} className='bt-save-details-btn bt-save-btn' type="submit">Save</button>
                                    </div>
                                </form>

                            </div>
                        )}
                    </div>

                    {saveLoading && (
                        <div className="bt-action-loading-container">
                            {saveInfo ? (
                                <div className="bt-action-loading-content">
                                    <div className="bt-action-content-icon"><FaCheckCircle /></div>
                                    <div className="bt-action-content-text">{saveInfo}</div>
                                    <button className="bt-action-content-btn" onClick={(e) => { handleOkClickDone(); }}>OK</button>
                                </div>
                            ) : (
                                saveError ? (
                                    <div className="bt-action-loading-content bt-action-loading-error">
                                        <div className="bt-action-content-icon"><MdError /></div>
                                        <div className="bt-action-content-text">{saveError}</div>
                                        <button className="bt-action-content-btn" onClick={(e) => { handleOkClick(); }}>OK</button>
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

export default Transfers
