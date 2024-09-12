"use client"
import React from 'react'

import { IoArrowBackOutline } from "react-icons/io5";

const Buttons = ({params}) => {

    const { phase, setPhase, validPages, completed, setCompleted } = params;

    const index = validPages.indexOf(phase);

    const handleContinueClick = () => {
        if (index < (validPages.length - 1)) {
            setPhase(validPages[index + 1]);
            localStorage.setItem('currentPage', validPages[index + 1]);
        }
    };
    const handleBackClick = () => {
        if (index > 0) {
            setPhase(validPages[index - 1]);
            localStorage.setItem('currentPage', validPages[index - 1]);
        }
    };


    return (
        <div className={`${phase != "first" ? "gs2-button-container" : "gs-btn-cont-first"}`}>
            {phase != "first" && <button className='gs2-below-btn gs2-back-btn' onClick={(e) => { handleBackClick(); }}><IoArrowBackOutline /></button>}
            <button disabled={!completed} className='gs2-below-btn gs2-continue-btn' onClick={(e) => { handleContinueClick(); }}>
                <span>Continue</span>
            </button>
        </div>
    )
}

export default Buttons
