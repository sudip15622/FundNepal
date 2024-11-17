// This is loading skeleton for the fundraiser cards.
import React from 'react'
import './Skeleton.css';

const Skeleton = () => {
    return (
        <ul className="skeleton-container">
            <li className='skeleton first'>
                <div className="image-skeleton image-first"></div>
                <div className="title-skeleton"></div>
                <div className="progress-skeleton">
                    <div className="progress-bar-skeleton"></div>
                </div>
                <div className="amount-skeleton"></div>
            </li>
            <li className='skeleton'>
                <div className="image-skeleton"></div>
                <div className="title-skeleton"></div>
                <div className="progress-skeleton">
                    <div className="progress-bar-skeleton"></div>
                </div>
                <div className="amount-skeleton"></div>
            </li>
            <li className='skeleton'>
                <div className="image-skeleton"></div>
                <div className="title-skeleton"></div>
                <div className="progress-skeleton">
                    <div className="progress-bar-skeleton"></div>
                </div>
                <div className="amount-skeleton"></div>
            </li>
            <li className='skeleton'>
                <div className="image-skeleton"></div>
                <div className="title-skeleton"></div>
                <div className="progress-skeleton">
                    <div className="progress-bar-skeleton"></div>
                </div>
                <div className="amount-skeleton"></div>
            </li>
            <li className='skeleton'>
                <div className="image-skeleton"></div>
                <div className="title-skeleton"></div>
                <div className="progress-skeleton">
                    <div className="progress-bar-skeleton"></div>
                </div>
                <div className="amount-skeleton"></div>
            </li>
        </ul>
    )
}

export default Skeleton
