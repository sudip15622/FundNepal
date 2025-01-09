"use client"
import React, { useState, useEffect } from 'react'
import "./DonationStatus.css";
import Image from 'next/image';
import Link from 'next/link';

const DonationStatus = ({ status, fundraiser }) => {

    useEffect(() => {
      console.log(status);
    }, [])
    

    return (
        status ? <>
            <div className="ds-donation-status-container">
                {status === "Completed" || status === "COMPLETE" ? <>
                    <main className="ds-donation-status">
                        <picture className='ds-status-icon-cont'>
                            <Image className='ds-status-icon' src="/success.png" alt="success-icon" priority width={200} height={200} />
                        </picture>
                        <div className="ds-status-text">Donation Successfull</div>
                        <div className="ds-payment-status-info">Your payment status is: <b>{status}</b></div>
                        <Link  href={`/fundraisers/${fundraiser}`} className='ds-status-ok-btn' >OK</Link>
                    </main>
                </> : <>
                    <main className="ds-donation-status">
                        <picture className='ds-status-icon-cont'>
                            <Image className='ds-status-icon' src="/failure.png" alt="failure-icon" priority width={200} height={200} />
                        </picture>
                        <div className="ds-status-text">Donation Unsuccessfull</div>
                        <div className="ds-payment-status-info">Your payment status is: <b>{status}</b></div>
                        <Link  href={`/fundraisers/${fundraiser}`} className='ds-status-ok-btn' >OK</Link>
                    </main>
                </>}
            </div>
        </> : <>
            <div className="loading">Loading...</div>
        </>
    )
}

export default DonationStatus
