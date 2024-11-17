"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link';
import "./DonationPage.css";
import { useRouter } from 'next/navigation';
import { handleKhalti } from '@/actions/handleKhalti';
import { v4 as uuidv4 } from 'uuid';

import { PulseLoader } from "react-spinners";
import { IoTriangleSharp } from "react-icons/io5";
import { MdOutlineRadioButtonUnchecked } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { GoChevronLeft } from "react-icons/go";
import { IoShieldCheckmark } from "react-icons/io5";

const DonationPage = ({ details, user }) => {

    const router = useRouter();

    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [focusedField, setFocusedField] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState('Khalti');

    const inputRef = useRef(null);

    useEffect(() => {
        if (!user) {
            if (!user) {
                router.push(`/signin?redirectTo=/fundraisers/${details.slug}?page=donation`);
                return;
            }
        }
    }, [user])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setFocusedField(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [inputRef]);

    const resetFields = () => {
        setAmount('');
        setAmountError('');
        setIsLoading(false);
        setError('');
        setInfo('');
        setFocusedField(false);
    }

    const getImageUrl = (myfile) => {
        if (myfile) {
            const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
            return imageUrl;
        }
    }

    const isValidAmount = (amount) => {
        const regex = /^\d+$/;
        if (!regex.test(amount)) {
            return { success: false, error: "Amount must be in digits!" };
        }
        if (parseFloat(amount) < 10) {
            return { success: false, error: "Minimum donation amount is 10!" };
        }
        if (parseFloat(amount) > 1000) {
            return { success: false, error: "Cannot donate more than 1K at once!", newValue: '1000' };
        }
        return { success: true };
    }

    const handleInputChange = (value) => {
        let newValue = value;
        const validation = isValidAmount(value);
        if (!validation.success) {
            setAmountError(validation.error);
            if (validation.newValue) {
                newValue = validation.newValue;
            }
        } else {
            setAmountError('');
        }

        setAmount(newValue);
    };

    const handleAmountBtnClick = (newamount) => {
        let newAmount = newamount;
        if (amount === newamount) {
            newAmount = '';
        }
        setAmount(newAmount);
    }

    const handlePaymentMethodClick = (method) => {
        setPaymentMethod(method);
    }

    const isFormValid = () => {
        return (
            amount !== '' &&
            amountError === ''
        );
    };

    const resetError = () => {
        setTimeout(() => {
            setError('');
        }, 4000);
    }

    const handlePayment = async (wallet) => {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        setError('');
        setInfo('');

        if (!amount) {
            setError("Please enter amount!");
            setIsLoading(false);
            resetError();
            return;
        }

        const validation = isValidAmount(amount);
        if (!validation.success) {
            setAmountError(validation.error);
            setIsLoading(false);
            resetError();
        }

        if (wallet === 'eSewa') {
            console.log("eSewa payment");
            setTimeout(() => {
                setIsLoading(false);
                setError('');
                setInfo('');
            }, 200);
            return;
        }

        const serviceCharge = `${Math.round(parseFloat(amount * 0.05))}`
        const totalAmount = `${Math.round(parseFloat(amount) + parseFloat(serviceCharge))}`;

        const payloadDetails = {
            id: uuidv4(),
            donationAmount: amount,
            serviceCharge: serviceCharge,
            totalAmount: totalAmount,
            fundraiserTitle: details.title,
            fundraiserId: details.id,
            donorName: user.name,
            donorEmail: user.email,
            donorId: user.id,
            fundraiserSlug: details.slug,
        }

        const paymentDetails = await handleKhalti(payloadDetails);
        console.log(paymentDetails);

        if (paymentDetails?.success) {
            router.push(paymentDetails.url);
            router.refresh();
            resetFields();
            return;
        }
        if (paymentDetails?.error) {
            setError(paymentDetails.error);
            setIsLoading(false);
            resetError();
            return;
        }
        if (paymentDetails?.nextError) {
            setError(paymentDetails.nextError);
            setIsLoading(false);
            resetError();
            return;
        }


    }

    return (
        user ? <div className="donation-page-container">
            <Link href={`/fundraisers/${details.slug}`} className="dp-gobackto-fundraiser">
                <div className="dp-goback-icon"><GoChevronLeft /></div>
                <span className="dp-goback-text">Fundraiser</span>
            </Link>
            <main className='donation-page'>
                <h1 className="dp-donation-page-title">
                    <span className='dp-title-title'>You're Supporting</span>
                    <span className="dp-title-underline"></span>
                </h1>
                <div className="dp-fundraiser-detials">
                    <picture className="dp-details-left">
                        <Image className='dp-details-left-image' src={getImageUrl(details.photo)} width={300} height={200} priority alt="fundraiser-cover-image" />
                    </picture>
                    <div className="dp-details-right">
                        <h2 className="dp-fundraiser-title">{details.title}</h2>
                        <div className="dp-fundraiser-text">Your donation will benefit <span style={{ fontWeight: "bold" }}>Sudip Lamichhane</span></div>
                    </div>
                </div>

                <form action="#" className="donation-page-form">
                    <h2 className="dp-form-title">Enter Donation:</h2>
                    <div className="dp-amount-buttons-container">
                        <button type="button" className={`dp-amount-button ${amount === '100' && "dp-entered-amount"}`} onClick={(e) => { handleAmountBtnClick('100') }}>Rs.100</button>
                        <button type="button" className={`dp-amount-button ${amount === '200' && "dp-entered-amount"}`} onClick={(e) => { handleAmountBtnClick('200') }}>Rs.200</button>
                        <button type="button" className={`dp-amount-button ${amount === '500' && "dp-entered-amount"}`} onClick={(e) => { handleAmountBtnClick('500') }}>Rs.500</button>
                        <button type="button" className={`dp-amount-button ${amount === '1000' && "dp-entered-amount"}`} onClick={(e) => { handleAmountBtnClick('1000') }}>Rs.1,000</button>
                        <button type="button" className={`dp-amount-button ${amount === '5000' && "dp-entered-amount"}`} onClick={(e) => { handleAmountBtnClick('5000') }}>Rs.5,000</button>
                    </div>
                    <div className="dp-inputBox" >
                        <input
                            ref={inputRef}
                            type='number'
                            className={`${amount !== "" && "dp-valid"}`}
                            name='amount'
                            value={amount}
                            onChange={(e) => { handleInputChange(e.target.value); }}
                            onFocus={() => { setFocusedField(true); }}
                            required
                        />
                        <span>Amount</span>
                        <div className="dp-currency">NRS</div>
                        {(focusedField && amountError !== '') && (
                            <div className="dp-input-error-div">
                                <div className="dp-pointer-icon"><IoTriangleSharp /></div>{amountError}
                            </div>
                        )}

                    </div>
                    <div className="dp-tip-info" >
                        <i><b>Note:</b> 5% of your donation will be added as a tip to support our platform.</i>
                    </div>

                    <h2 className="dp-form-title">Payment Method:</h2>
                    <div className="dp-payment-methods-container">
                        <button type="button" className="dp-payment-method" onClick={(e) => { handlePaymentMethodClick('eSewa') }}>
                            <div className="dp-method-left">
                                <picture className="dp-payment-method-logo">
                                    <Image src="/esewa_logo.png" width={100} height={90} priority alt="esewa-logo" />
                                </picture>
                                <span className="dp-payment-method-text">eSewa</span>
                            </div>
                            <div className="dp-method-right">
                                {paymentMethod === 'eSewa' ? <FaCheckCircle /> : <MdOutlineRadioButtonUnchecked />}
                            </div>
                        </button>
                        <span className="dp-payment-method-line"></span>
                        <button type="button" className="dp-payment-method" onClick={(e) => { handlePaymentMethodClick('Khalti') }}>
                            <div className="dp-method-left">
                                <picture className="dp-payment-method-logo">
                                    <Image src="/khalti_logo.jpg" width={100} height={90} alt="khalti-logo" />
                                </picture>
                                <span className="dp-payment-method-text">Khalti</span>
                            </div>
                            <div className="dp-method-right">
                                {paymentMethod === 'Khalti' ? <FaCheckCircle /> : <MdOutlineRadioButtonUnchecked />}
                            </div>
                        </button>
                    </div>

                    <h2 className="dp-form-title">Your Donation:</h2>
                    <div className="dp-final-donation-info">
                        <div className="dp-final-donation-text">
                            <span className="">Donation Amount:</span>
                            <span>Rs. {amount ? parseFloat(amount) : "0.00"}</span>
                        </div>
                        <div className="dp-final-donation-text">
                            <span>FundNepal Tip (5%):</span>
                            <span>Rs. {amount ? Math.round(parseFloat(amount * 0.05)) : "0.00"}</span>
                        </div>
                        <span className="dp-final-donation-line"></span>
                        <div className="dp-final-donation-text">
                            <span style={{ fontWeight: "bold" }}>Total Amount:</span>
                            <span style={{ fontWeight: "bold" }}>Rs. {amount ? Math.round(parseFloat(amount) + parseFloat(amount * 0.05)) : "0.00"}</span>
                        </div>
                    </div>

                    <div className="dp-error-field">
                        Something went wrong!
                    </div>

                    <button onClick={(e) => { handlePayment(paymentMethod); }} type="button" className={`dp-payment-form-btn ${paymentMethod == 'eSewa' ? "dp-esewa-btn" : "dp-khalti-btn"}`} disabled={isLoading || !isFormValid() || error !== ''}>
                        <span >{isLoading ? <PulseLoader size={10} margin={4} /> : `Pay via ${paymentMethod}`}</span>
                    </button>
                </form>

                <span className="dp-final-donation-line"></span>

                <div className="dp-donation-protected">
                    <div className="dp-protected-icon">
                        <IoShieldCheckmark />
                    </div>
                    <div className="dp-donation-protection-details">
                        <h3 className="dp-protected-title">FundNepal protects your donation</h3>
                        <p className="dp-protected-desc">We guarantee you a full refund for up to a year in the rare case that fraud occurs.</p>
                    </div>
                </div>
            </main>
        </div> : null
    )
}

export default DonationPage
