"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import "./ReportPage.css";
import Link from 'next/link';
import Image from 'next/image';
import { MoonLoader } from 'react-spinners';
import { reportFundraiser } from '@/actions/handleReports';


import { GoChevronLeft } from 'react-icons/go';
import { FaRegSquare } from "react-icons/fa";
import { IoCheckbox } from "react-icons/io5";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";

const ReportPage = ({ user, details }) => {

  const router = useRouter();

  const [selectedCauses, setSelectedCauses] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportInfo, setReportInfo] = useState("");

  useEffect(() => {
    if (!user) {
      router.push(`/signin?redirectTo=/fundraisers/${details.slug}?page=report`);
      return;
    }
  }, [user])

  const getImageUrl = (myfile) => {
    if (myfile) {
      const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
      return imageUrl;
    }
  }

  useEffect(() => {
    console.log(selectedCauses);
  }, [selectedCauses])


  const causeList = [
    {
      title: "Fraudulent Activity",
      text: "The fundraiser is suspected of being a scam or involves deceitful practices.",
    },
    {
      title: "Misuse of Funds",
      text: "Funds are not being used for the purpose stated in the description.",
    },
    {
      title: "Inappropriate Content",
      text: "The fundraiser contains offensive, harmful, or misleading information.",
    },
    {
      title: "Violation of Policies",
      text: "The fundraiser breaches FundNepal terms of service or guidelines.",
    },
    {
      title: "Unauthorized Fundraiser",
      text: "The campaign uses someone else's identity or cause without consent.",
    },

  ]

  const handleCauseSelect = (cause) => {
    if (selectedCauses.includes(cause)) {
      setSelectedCauses(selectedCauses.filter(item => item !== cause));
    } else {
      setSelectedCauses([...selectedCauses, cause]);
    }
  }

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedCauses([]);
    } else {
      setSelectedCauses(causeList.map(cause => cause.title));
    }
    setIsAllSelected(!isAllSelected);
  }

  const handleReportBtnClick = async () => {
    setLoading(true);
    setReportError("");
    setReportInfo("");

    if (selectedCauses.length <= 0) {
      return;
    }

    const response = await reportFundraiser(selectedCauses, user.id, details.id);

    if (response.success) {
      setReportInfo("Successfull reported fundraiser!");
    } else {
      setReportError(response.error);
    }

  }

  const handleOkClick = () => {
    router.push(`/fundraisers/${details.slug}`);
    setLoading(false);
    setReportError("");
    setReportInfo("");
    setSelectedCauses([]);
  }

  return (
    user ? (
      <div className="report-page-container">
        <Link href={`/fundraisers/${details.slug}`} className="rp-gobackto-fundraiser">
          <div className="rp-goback-icon"><GoChevronLeft /></div>
          <span className="rp-goback-text">Fundraiser</span>
        </Link>

        <main className="rp-report-page">
          <h1 className="rp-donation-page-title">
            <span className='rp-title-title'>You're Reporting</span>
            <span className="rp-title-underline"></span>
          </h1>
          <div className="rp-fundraiser-detials">
            <picture className="rp-details-left">
              <Image className='rp-details-left-image' src={getImageUrl(details.photo)} width={300} height={200} priority alt="fundraiser-cover-image" />
            </picture>
            <div className="rp-details-right">
              <h2 className="rp-fundraiser-title">{details.title}</h2>
              <div className="rp-fundraiser-text">Your report will be noticed soon and we will take action on it.</div>
            </div>
          </div>

          <div className="rp-select-cause-header">
            <h2 className="rp-select-cause-title">Select reasons behind reporting:</h2>
            <div className="rp-select-cause-selectall" onClick={(e) => { handleSelectAll(); }}>
              <div className="rp-cause-icon">{isAllSelected ? <IoCheckbox /> : <FaRegSquare />}</div>
              <div className="rp-cause-selectall-text">Select All</div>
            </div>
          </div>

          <div className="rp-report-note"><i><b>Note:</b> Once you reported then cannot be reviewd by anyone (not even you) expect admin.</i></div>

          <ul className="rp-select-cause-lists">
            {
              causeList.map((cause, index) => {
                return (
                  <li key={index} onClick={(e) => { handleCauseSelect(cause.title); }} className={`rp-cause-listitem ${selectedCauses.includes(cause.title) ? 'rp-selected' : ''}`}>
                    <div className="rp-cause-icon">{selectedCauses.includes(cause.title) ? <IoCheckbox /> : <FaRegSquare />}</div>
                    <div className="rp-cause-details">
                      <h3 className="rp-cause-details-title">{cause.title}</h3>
                      <p className="rp-cause-details-text">{cause.text}</p>
                    </div>
                  </li>
                )
              })
            }
          </ul>

          <button className='rp-report-btn' type="button" onClick={(e) => { handleReportBtnClick(); }} disabled={selectedCauses.length <= 0}>
            Report
          </button>

          {loading && (
            <div className="rp-action-loading-container">
              {reportInfo ? (
                <div className="rp-action-loading-content">
                  <div className="rp-action-content-icon"><FaCheckCircle /></div>
                  <div className="rp-action-content-text">{reportInfo}</div>
                  <button className="rp-action-content-btn" onClick={(e) => { handleOkClick(); }}>OK</button>
                </div>
              ) : (
                reportError ? (
                  <div className="rp-action-loading-content rp-action-loading-error">
                    <div className="rp-action-content-icon"><MdError /></div>
                    <div className="rp-action-content-text">{reportError}</div>
                    <button className="rp-action-content-btn" onClick={(e) => { handleOkClick(); }}>OK</button>
                  </div>
                ) : (
                  <MoonLoader size={100} color='var(--btn-secondary)' />
                )
              )}
            </div>
          )}
        </main>
      </div>
    ) : null
  )
}

export default ReportPage
