"use client"
import React, { useState, useEffect } from 'react'
import "./ThirdPage.css";

import { BiSolidError } from "react-icons/bi";
import { MdTipsAndUpdates } from "react-icons/md";

const ThirdPage = ({ completed, setCompleted }) => {

    const [thirdData, setThirdData] = useState({ title: '', description: '' });
    const [titleError, setTitleError] = useState('');
    const [descError, setDescError] = useState('');

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('thirdData'));
        if (savedData) {
            setThirdData(savedData);
        }
    }, []);

    useEffect(() => {
        if (thirdData.title !== "" && isValidTitle(thirdData.title) && thirdData.description !== "" && isValidDesc(thirdData.description)) {
            setCompleted(true);
        } else {
            setCompleted(false);
        }
    }, [thirdData]);

    const handleTitleChange = (value) => {
        let myValue = value;

        if (myValue.length > 80) {
            myValue = value.slice(0, 80);
            setTitleError("Title cannot be of more than 80 characters!");
        } else {
            setTitleError('');
        }
        if (!isValidTitle(myValue)) {
            setTitleError("Title must have 10-80 characters without digits and unnecessary characters!")
        }
        let newData = { ...thirdData };
        newData.title = myValue;
        setThirdData(newData);
        localStorage.setItem('thirdData', JSON.stringify(newData));
    }
    const handleDescChange = (value) => {
        let myValue = value;

        if (myValue.length > 2000) {
            myValue = value.slice(0, 2000);
            setDescError("Description cannot be of more than 2000 characters!");
        } else {
            setDescError('');
        }
        if (!isValidDesc(myValue)) {
            setDescError("Description must have total 200-2000 characters!")
        }

        let newData = { ...thirdData };
        newData.description = myValue;
        setThirdData(newData);
        localStorage.setItem('thirdData', JSON.stringify(newData));
    }

    const isValidTitle = (title) => {
        const allowedCharactersRegex = /^[a-zA-Z\s.,!?'"()-]+$/;

        if (title.length < 10 || title.length > 80) {
            return false;
        }
        if (!allowedCharactersRegex.test(title)) {
            return false;
        }

        return true;
    }

    const isValidDesc = (desc) => {
        if (desc.length < 200 || desc.length > 2000) {
            return false;
        }
        return true;
    }

    return (
        <div className='gs3-title-desc-container'>
            <div className="gs3-title-container">
                <h2 className="gs3-title-title">Give a suitable title to your fundraiser:</h2>
                <div className="gs3-inputBox">
                    <input type="text" className={`${thirdData.title !== "" && "gs3-valid"}`} name="title" value={thirdData.title} onChange={(e) => { handleTitleChange(e.target.value); }} required />
                    <span>Fundraiser title</span>
                    <div className="gs3-title-length">{thirdData.title.length} / 80</div>
                </div>
                {titleError != "" ? <div className="gs3-title-error">
                    <BiSolidError /> {titleError}
                </div> : <div className="gs3-title-info">
                    <MdTipsAndUpdates /> A clear, compelling, and captivating title attracts donors!
                </div>}
            </div>

            <div className="gs3-desc-container">
                <h2 className="gs3-title-title">Describe why you are rising funds:</h2>
                <div className="gs3-desc-box">
                    <textarea className={`${thirdData.description !== "" && "gs3-valid-desc"}`} name="description" value={thirdData.description} onChange={(e) => { handleDescChange(e.target.value); }} required></textarea>
                    <span>Add your description here</span>
                    <div className="gs3-character-count">{thirdData.description.length} / 2000</div>
                </div>
                {descError != "" ? <div className="gs3-desc-error">
                    <BiSolidError /> {descError}
                </div> : <div className="gs3-desc-info">
                    <MdTipsAndUpdates /> The more you share, the more they care—let your story inspire!
                </div>}
            </div>
        </div>
    )
}

export default ThirdPage
