import React, { useState, useEffect } from 'react'
import "./SecondPage.css";
import Image from 'next/image';

import { MdChangeCircle, MdCloudUpload, MdDelete } from 'react-icons/md';
import { CiImageOn } from "react-icons/ci";
import { BiSolidError } from "react-icons/bi";
import { MdTipsAndUpdates } from "react-icons/md";

const SecondPage = ({ completed, setCompleted }) => {

    const [secondData, setSecondData] = useState({ goal: '', photo: null });
    const [goalError, setGoalError] = useState('');
    const [photoError, setPhotoError] = useState('');

    const validType = ["image/png", "image/jpeg", "image/jpg"];

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('secondData'));
        if (savedData) {
            setSecondData(savedData);
        }
    }, []);

    useEffect(() => {
        if (secondData.goal != "" && isValidAmount(secondData.goal) && secondData.photo != null) {
            setCompleted(true);
        } else {
            setCompleted(false);
        }
    }, [secondData]);

    const bytesToString = async (file) => {
        const buffer = await file.arrayBuffer();
        const bufferData = Buffer.from(buffer);
        return bufferData.toString('base64')
    }

    const getImageUrl = (myfile) => {
        const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
        return imageUrl;
    }

    const isValidAmount = (input) => {
        const regex = /^\d+$/;
        return regex.test(input) && (parseInt(input, 10) >= 1000) && (parseInt(input, 10) <= 1000000);
    }

    const handleGoalChange = (value) => {
        let numericValue = value.replace(/\D/g, '');

        if (parseFloat(numericValue) > 1000000) {
            numericValue = '1000000';
            setGoalError("Starting goal cannot exceed 1,000,000!");
        } else {
            setGoalError('');
        }
        if (!isValidAmount(numericValue)) {
            setGoalError("Starting goal must be in digit and from 1K to 10L!");
        }
        let newData = { ...secondData };
        newData.goal = numericValue;
        setSecondData(newData);
        localStorage.setItem('secondData', JSON.stringify(newData));
    }

    const handlePhotoChange = async (value) => {
        if (value) {
            const myfile = {
                fileName: value.name,
                fileContentType: value.type,
                fileData: await bytesToString(value),
                fileSize: value.size,
            }

            const sizeInKB = value.size / (1024);
            if (validType.includes(myfile.fileContentType)) {
                if (sizeInKB <= 600) {
                    let newData = { ...secondData };
                    newData.photo = myfile;
                    setSecondData(newData);
                    localStorage.setItem('secondData', JSON.stringify(newData));
                    setPhotoError('');
                }
                else {
                    let newData = { ...secondData };
                    newData.photo = null;
                    setSecondData(newData);
                    localStorage.setItem('secondData', JSON.stringify(newData));
                    setPhotoError("File size must be less than 600 KB");
                    document.getElementById('fileInput').value = null;
                }
            } else {
                let newData = { ...secondData };
                newData.photo = null;
                setSecondData(newData);
                localStorage.setItem('secondData', JSON.stringify(newData));
                setPhotoError("Supported file type are png, jpg, jpeg only!");
                document.getElementById('fileInput').value = null;
            }

        }
    }

    const handleRemoveFile = () => {
        let newData = { ...secondData };
        newData.photo = null;
        setSecondData(newData);
        localStorage.setItem('secondData', JSON.stringify(newData));
        document.getElementById('fileInput').value = null;
    };

    return (
        <>
            <div className="gs2-photo-goal-container">
                <div className="gs2-goal-container">
                    <h2 className="gs2-goal-title">Set your starting goal:</h2>
                    <div className="gs2-inputBox">
                        <input type="text" className={`${secondData.goal !== "" && "gs2-valid"}`} name="goal" value={secondData.goal} onChange={(e) => { handleGoalChange(e.target.value); }} pattern="\d*" required />
                        <span>Starting goal</span>
                        <div className="gs2-currency">NRS</div>
                    </div>
                    {goalError ? <div className="gs2-goal-error">
                        <BiSolidError /> {goalError}
                    </div> : <div className="gs2-goal-info">
                        <MdTipsAndUpdates /> You can always change this later!
                    </div>}
                </div>
                <div className="gs2-photo-container">
                    <h2 className="gs2-goal-title">Choose a cover image:</h2>
                    <div className="gs2-photo-container-bottom">
                        <div className="gs2-upload-photo-section">
                            {secondData.photo && <picture className='gs2-uploaded-picture'>
                                <Image className='gs2-uploaded-cover-image' src={getImageUrl(secondData.photo)} width={300} height={200} priority alt="" />
                            </picture>}
                        </div>
                        <div className={`gs2-no-uploads ${!secondData.photo && "gs2-no-uploads-after"}`}>
                            {secondData.photo && <button className="gs2-custom-file-input gs2-remove-photo" onClick={(e) => { handleRemoveFile(); }}>
                                <div className="gs2-fileInput-icon"><MdDelete /></div>
                                <div className="gs2-fileInput-text">Remove</div>
                            </button>}
                            <div className="gs2-no-uploads-main">
                                {!(secondData.photo) && <div className='gs2-image-icon-picture'>
                                    <CiImageOn />
                                </div>}
                                <input
                                    type="file"
                                    id="fileInput"
                                    onChange={(e) => { handlePhotoChange(e.target.files[0]) }}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="fileInput" className={`gs2-custom-file-input ${!secondData.photo && "gs2-upload-btn"}`}>
                                    <div className="gs2-fileInput-icon">{secondData.photo ? <MdChangeCircle /> : <MdCloudUpload />}</div>
                                    <div className="gs2-fileInput-text">{secondData.photo ? 'Change' : 'Upload'}</div>
                                </label>

                                {photoError && <div className="gs2-photo-error">
                                    <BiSolidError /> {photoError}
                                </div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SecondPage
