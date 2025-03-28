"use client"
import React, { useState, useEffect } from 'react'
import "./Fundraise.css";
import Image from 'next/image';
import Link from 'next/link';

import { BiLike, BiSolidDonateHeart } from "react-icons/bi";
import { PiClover } from "react-icons/pi";
import { GrShieldSecurity } from "react-icons/gr";
import { FaHandHoldingMedical, FaChevronDown } from "react-icons/fa";
import { MdCastForEducation, MdFamilyRestroom } from "react-icons/md";
import { TbEmergencyBed } from "react-icons/tb";

const Fundraise = ({ examples }) => {

    const [currentIndex, setCurrentIndex] = useState(0);

    const categories = [
        {
            name: "Medical",
            icon: <FaHandHoldingMedical />,
        },
        {
            name: "Emergency",
            icon: <TbEmergencyBed />,
        },
        {
            name: "Non Profit",
            icon: <BiSolidDonateHeart />,
        },
        {
            name: "Education",
            icon: <MdCastForEducation />,
        },
        {
            name: "Family",
            icon: <MdFamilyRestroom />,
        },
    ]

    const [faqs, setFaqs] = useState(
        [
            {
                question: "Is it okay to raise money for myself?",
                answer: "Yes, thousands of people have started a fundraiser on FundNepal for themself or their family amidst a financial crisis.",
                showAns: false,
            },
            {
                question: "Can I fundraise for someone else?",
                answer: "Yes, you can start raising fund for someone else and help ensure funds go to them directly and securely.",
                showAns: false,
            },
            {
                question: "Can I create a GoFundMe for a charity?",
                answer: "Yes. Starting a fundraiser for a charity or nonprofit on FundNepal is an easy, powerful, and trusted way to directly support.",
                showAns: false,
            },
            {
                question: "Are there any fees to fundraise?",
                answer: "There is no fee to start fundraising on FundNepal. One standard transaction fee (5%) is automatically deducted per donation—that's it.",
                showAns: false,
            },
            {
                question: "In what countries can I start?",
                answer: "For now, FundNepal only works for nepal and nepali peoples especially. Soon we will go international also.",
                showAns: false,
            },
            {
                question: "How do I withdraw funds?",
                answer: "You can withdraw funds in funds section of your dashboard. You can add your bank details and withdraw funds anytime.",
                showAns: false,
            },
        ]
    )

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

    const handleFaq = (index) => {
        setFaqs((prevFaqs) =>
            prevFaqs.map((faq, i) =>
                i === index ? { ...faq, showAns: !faq.showAns } : faq
            )
        );
    }

    return (
        <main className='fundraise-container'>
            <div className="f-fundraise-first">
                <section className="f-fundraise-first-top">
                    <div className="f-first-left">
                        <h1 className="f-first-left-title">Start Fundraising on FundNepal</h1>
                        <div className="f-first-left-bottom">
                            <p className="f-fundraise-desc">Everything you need to help your fundraiser succeed is here. Start fundraising on FundNepal today</p>
                            <Link href={"/getstarted"} className="f-get-started-btn">
                                <span>Get Started</span>
                            </Link>
                        </div>
                    </div>
                    <picture className="f-first-right">
                        <Image className='fundraise-coverpic' src="https://img.freepik.com/free-photo/family-moving-using-boxes_1157-35481.jpg?uid=R158132741&ga=GA1.1.682701707.1718079406&semt=ais_hybrid" width={500} height={400} priority alt="fundraise-cover" />
                    </picture>
                </section>

                <section className="f-fund-raise-bottom">
                    <div className="f-benefit-card">
                        <div className="f-benefit-icon"><PiClover /></div>
                        <div className="f-benefit-text">Powerful tools to help you raise money</div>
                    </div>
                    <div className="f-benefit-card">
                        <div className="f-benefit-icon"><BiLike /></div>
                        <div className="f-benefit-text">No fee to start your fundraiser on here</div>
                    </div>
                    <div className="f-benefit-card">
                        <div className="f-benefit-icon"><GrShieldSecurity /></div>
                        <div className="f-benefit-text">Secure payment methods to receive your money</div>
                    </div>
                </section>
            </div>

            <section className="f-fundraise-second">
                <Link href={"#howtostart"} className='f-fundraiser-pages'>How to start</Link>
                <Link href={"#fundraiserexamples"} className='f-fundraiser-pages'>Examples of fundraisers</Link>
                <Link href={"#faqs"} className='f-fundraiser-pages'>FAQs</Link>
                <Link href={"#categories"} className='f-fundraiser-pages'>Fundraiser categories</Link>
            </section>

            <section id='howtostart' className="f-how-to-start">
                <h2 className='f-start-title'>How to Start Fundraising</h2>
                <ul className="f-start-container">
                    <li className="f-start-card">
                        <div className="f-step-number">Step 1</div>
                        <picture>
                            <Image className='f-step-image' src="/step_one.png" width={300} height={250} priority alt="step1-image" />
                        </picture>
                        <div className="f-start-card-details">
                            <h3 className="f-start-card-title">Our tools help create your fundraiser</h3>
                            <p className="f-start-card-desc">Click the &apos;Get Started&apos; button to start fundraising journey. You&apos;ll be guided by prompts to add fundraiser details and set your goal, which can be changed anytime.</p>
                        </div>
                    </li>
                    <li className="f-start-card">
                        <div className="f-step-number">Step 2</div>
                        <picture>
                            <Image className='f-step-image' src="/step_two.png" width={300} height={250} priority alt="step2-image" />
                        </picture>
                        <div className="f-start-card-details">
                            <h3 className="f-start-card-title">Share your fundraiser link to reach donors</h3>
                            <p className="f-start-card-desc">Once live, share your fundraiser link with friends and family to start gaining momentum. You&apos;ll also find helpful resources for running your fundraiser in your FundNepal dashboard.</p>
                        </div>
                    </li>
                    <li className="f-start-card">
                        <div className="f-step-number">Step 3</div>
                        <picture>
                            <Image className='f-step-image' src="/bank_info.png" width={300} height={250} priority alt="step3-image" />
                        </picture>
                        <div className="f-start-card-details">
                            <h3 className="f-start-card-title">Securely receive the funds you raise</h3>
                            <p className="f-start-card-desc">Add your bank information, or invite your intended recipient to add theirs, to securely start receiving funds. You don&apos;t need to reach your fundraising goal to start receiving funds.</p>
                        </div>
                    </li>
                </ul>
                <Link href={"/getstarted"} className="f-get-started-btn">
                    <span>Get Started</span>
                </Link>
            </section>
            <section id='fundraiserexamples' className="f-fundraiser-examples">
                <h2 className='f-start-title'>Examples of Fundraisers</h2>
                <ul className="f-example-title-container">
                    {examples && examples.map((fundraiser, index) => (
                        <li
                            key={index}
                            className={`f-example-title ${currentIndex === index ? 'f-active-title' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        >
                            {fundraiser.category}
                        </li>
                    ))}
                </ul>
                <div className="f-example-slider">
                    <div className="f-example-container" style={{ transform: `translateX(${(currentIndex) * - 100}%)` }}>
                        {examples && examples.map((fundraiser, index) => (
                            <div key={fundraiser.id} className={`f-example-card-wrapper`}>
                                <div className="f-example-card">
                                    <div className='f-example-coverpic-cont'>
                                        <Image className='f-example-coverpic' src={getImageUrl(fundraiser.photo)} width={400} height={300} priority alt={`example${index + 1}-image`} />
                                        <span className='f-example-address'>{getAddress(fundraiser.beneficiary)}</span>
                                    </div>
                                    <div className="f-example-details">
                                        <Link className='f-details-title' href={`/fundraisers/${fundraiser.slug}`}>{fundraiser.title}</Link>
                                        <p className='f-details-desc'>{fundraiser.description.slice(0, 400)}...</p>
                                        <div className="f-details-progress">
                                            <div className="f-details-progress-top">
                                                <div className="f-progress-bar" style={{width: `${fundraiser.progress}%`}}></div>
                                            </div>
                                            <div className="f-progress-and-goal">
                                                Rs. {fundraiser.totalDonationAmount} raised of Rs. {fundraiser.goal} goal
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id='faqs' className="f-faqs-container">
                <h2 className='f-start-title'>Questions About Fundraising</h2>
                <ul className="f-faqs-all">
                    {faqs.map((item, index) => {
                        return (
                            <li
                                key={index}
                                className={`f-faq-item`}
                            >
                                <h3
                                    className="f-faq-question"
                                    onClick={() => handleFaq(index)}
                                >
                                    {item.question} <FaChevronDown className={`f-faq-icon ${item.showAns && "f-faq-icon-rotate"}`} />
                                </h3>
                                <p className={`f-faq-answer ${item.showAns ? "animate-faq" : ""}`}>{item.answer}</p>
                            </li>
                        );
                    })}
                </ul>
            </section>
            <section id='categories' className="f-fundraiser-categories">
                <h2 className='f-start-title'>Fundraiser Categories</h2>
                <p className="f-fundraiser-category-desc">FundNepal is the trusted place to fundraise for nearly anything you care about and there is no pressure to reach your fundraising goal. For more inspiration and help fundraising, explore the categories below.</p>
                <ul className="f-category-container">
                    {categories.map((category, index) => {
                        return (
                            <li key={index} className="f-category-item">
                                <Link href={`/categories/${category.name.replace(/\s+/g, '').toLowerCase()}`}>
                                    <div className="f-category-icon">{category.icon}</div>
                                    <div className="f-category-name">{category.name}</div>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </section>
        </main>
    )
}

export default Fundraise
