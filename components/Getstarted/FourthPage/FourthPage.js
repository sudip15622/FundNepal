"use client"
import React, { useState, useEffect } from 'react'
import "./FourthPage.css";
import Image from 'next/image';

const FourthPage = ({ completed, setCompleted, phase, setPhase }) => {

  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    const savedData1 = JSON.parse(localStorage.getItem('firstData'));
    const savedData2 = JSON.parse(localStorage.getItem('secondData'));
    const savedData3 = JSON.parse(localStorage.getItem('thirdData'));

    if (savedData1 && savedData2 && savedData3) {
      const allData = {
        imageAddress: getImageUrl(savedData2.photo),
        title: savedData3.title,
        goal: savedData2.goal,
        category: savedData1.category,
        type: savedData1.type,
        description: savedData3.description,
      }
      setPreviewData(allData);
    }
  }, []);

  useEffect(() => {
    if (previewData) {
      setCompleted(true);
    } else {
      setCompleted(false);
    }
  }, [previewData]);

  const getImageUrl = (myfile) => {
    const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
    return imageUrl;
  }

  const handleEditClick = (page) => {
    setPhase(page);
  }

  return (
    <div className='gs4-preview-container'>
      <h2 className="gs4-preview-title">Preview:</h2>
      {previewData ? <ul className="gs4-preview-lists">
        <li className="gs4-preview-item">
          <div className="gs4-title-field">
            <h3 className="gs4-item-title">Cover Image</h3>
            <button className='gs4-edit-btn' onClick={(e) => { handleEditClick('second') }}>Edit</button>
          </div>
          <picture>
            <Image className='gs4-preview-photo' src={previewData.imageAddress} width={400} height={300} alt="" />
          </picture>
        </li>

        <li className="gs4-preview-item">
          <div className="gs4-title-field">
            <h3 className="gs4-item-title">Title</h3>
            <button className='gs4-edit-btn' onClick={(e) => { handleEditClick('third') }}>Edit</button>
          </div>
          <p className="gs4-item-desc">{previewData.title}</p>
        </li>

        <li className="gs4-preview-line"></li>

        <li className="gs4-preview-item">
          <div className="gs4-title-field">
            <h3 className="gs4-item-title">Starting Goal</h3>
            <button className='gs4-edit-btn' onClick={(e) => { handleEditClick('second') }}>Edit</button>
          </div>
          <p className="gs4-item-desc">Rs. {previewData.goal}</p>
        </li>

        <li className="gs4-preview-line"></li>

        <li className="gs4-preview-item">
          <div className="gs4-title-field">
            <h3 className="gs4-item-title">Category</h3>
            <button className='gs4-edit-btn' onClick={(e) => { handleEditClick('first') }}>Edit</button>
          </div>
          <p className="gs4-item-desc">{previewData.category}</p>
        </li>

        <li className="gs4-preview-line"></li>

        <li className="gs4-preview-item">
          <div className="gs4-title-field">
            <h3 className="gs4-item-title">Fundraising for</h3>
            <button className='gs4-edit-btn' onClick={(e) => { handleEditClick('first') }}>Edit</button>
          </div>
          <p className="gs4-item-desc">{previewData.type}</p>
        </li>

        <li className="gs4-preview-line"></li>

        <li className="gs4-preview-item">
          <div className="gs4-title-field">
            <h3 className="gs4-item-title">Description</h3>
            <button className='gs4-edit-btn' onClick={(e) => { handleEditClick('third') }}>Edit</button>
          </div>
          <p className="gs4-item-desc gs4-desc-box">{previewData.description.slice(0, 200)}......</p>
        </li>
      </ul> : <div>Provide all details for preview and continue!</div>}
    </div>
  )
}

export default FourthPage
