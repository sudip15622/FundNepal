"use client"
import React, { useState, useEffect } from 'react'
import "./EditBox.css";
import Image from 'next/image';
import { MoonLoader, PulseLoader } from 'react-spinners';
import { isValidDesc, isValidGoal, isValidPhoto, isValidType, isValidCategory, isValidTitle, isValidName, isValidAddress, isValidWardNo, isValidPhone } from '@/utils/validateFundraiser';
import { updateFundraiser, updateBeneficiary } from '@/actions/handleFundraiser';

import { CiImageOn } from "react-icons/ci";
import { BiSolidError, BiSolidDonateHeart } from "react-icons/bi";
import { MdChangeCircle, MdCloudUpload, MdCastForEducation, MdFamilyRestroom, MdError } from "react-icons/md";
import { FaHandHoldingMedical, FaHandHoldingHeart, FaCheckCircle } from "react-icons/fa";
import { TbEmergencyBed } from "react-icons/tb";
import { HiMiniHandRaised } from "react-icons/hi2";
import { FaPeopleGroup } from "react-icons/fa6";


const EditBox = ({ nowEditing, id, setStates }) => {

    const [editData, setEditData] = useState({ photo: null, title: '', goal: 0, category: '', type: '', description: '', name: '', phone: '', address: { street: '', wardNo: '', city: '', district: '' } });
    const [editError, setEditError] = useState('');

    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveInfo, setSaveInfo] = useState('');
    const [saveError, setSaveError] = useState('');

    useEffect(() => {
        const myData = { ...editData };
        myData[nowEditing.key] = nowEditing.value;
        setEditData(myData);
        setTimeout(() => {
            setLoading(false);
        }, 200);
    }, [])


    const validType = ["image/png", "image/jpeg", "image/jpg"];

    const bytesToString = async (file) => {
        const buffer = await file.arrayBuffer();
        const bufferData = Buffer.from(buffer);
        return bufferData.toString('base64')
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
                    let newData = { ...editData };
                    newData.photo = myfile;
                    setEditData(newData);
                    setEditError('');
                }
                else {
                    let newData = { ...editData };
                    newData.photo = null;
                    setEditData(newData);
                    setEditError("File size must be less than 600 KB");
                    document.getElementById('fileInput').value = null;
                }
            } else {
                let newData = { ...editData };
                newData.photo = null;
                setEditData(newData);
                setEditError("Supported file type are png, jpg, jpeg only!");
                document.getElementById('fileInput').value = null;
            }
        }
    }

    const handleTitleChange = (value) => {
        let myValue = value;

        if (myValue.length > 80) {
            myValue = value.slice(0, 80);
            setEditError("Title cannot be of more than 80 characters!");
        } else {
            setEditError('');
        }
        if (!(isValidTitle(myValue).success)) {
            setEditError(isValidTitle(myValue).error);
        }
        let newData = { ...editData };
        newData.title = myValue;
        setEditData(newData);
    }
    const handleGoalChange = (value) => {
        let numericValue = value.replace(/\D/g, '');

        if (parseFloat(numericValue) > 1000000) {
            numericValue = '1000000';
            setEditError("Starting goal cannot exceed 1,000,000!");
        } else {
            setEditError('');
        }
        if (!isValidGoal(numericValue).success) {
            setEditError(isValidGoal(numericValue).error);
        }
        let newData = { ...editData };
        newData.goal = numericValue;
        setEditData(newData);
    }

    const handleCategoryChange = (value) => {
        let newData = { ...editData };
        newData["category"] = value;
        setEditData(newData);
    };

    const handleTypeChange = (value) => {
        let newData = { ...editData };
        newData["type"] = value;
        setEditData(newData);
    };

    const handleDescChange = (value) => {
        let myValue = value;

        if (myValue.length > 2000) {
            myValue = value.slice(0, 2000);
            setEditError("Description cannot be of more than 2000 characters!");
        } else {
            setEditError('');
        }
        if (!isValidDesc(myValue).success) {
            setEditError(isValidDesc(myValue).error);
        }

        let newData = { ...editData };
        newData.description = myValue;
        setEditData(newData);
    }

    const handleNameChange = (value) => {
        let myValue = value;
        if (!(isValidName(myValue).success)) {
            setEditError(isValidName(myValue).error);
        } else {
            setEditError('');
        }
        let newData = { ...editData };
        newData.name = myValue;
        setEditData(newData);
    }

    const handlePhoneChange = (value) => {
        let myValue = value;
        if (!(isValidPhone(myValue).success)) {
            setEditError(isValidPhone(myValue).error);
        } else {
            setEditError('');
        }
        let newData = { ...editData };
        newData.phone = myValue;
        setEditData(newData);
    }

    const handleAddressChange = (key, value) => {
        let newValue = value;
        const validate = validateDetailsBeneficiary[key](newValue);
        if (!validate.success) {
            setEditError(validate.error);
        } else {
            setEditError('');
        }

        let newData = { ...editData };
        newData.address[key] = newValue;
        setEditData(newData);
    }

    const validateDetails = {
        photo: isValidPhoto,
        title: isValidTitle,
        goal: isValidGoal,
        category: isValidCategory,
        type: isValidType,
        description: isValidDesc,
    }

    const validateDetailsBeneficiary = {
        name: isValidName,
        phone: isValidPhone,
        street: (str) => isValidAddress('street', str),
        city: (str) => isValidAddress('city', str),
        district: (str) => isValidAddress('district', str),
        wardNo: isValidWardNo,
    }

    const resetError = () => {
        setTimeout(() => {
            setSaveError('');
        }, 4000);
    }

    const handleSaveClick = async (key, data) => {
        if (saveLoading) {
            return;
        }
        setSaveLoading(true);
        setSaveInfo('');
        setSaveError('');

        const validate = validateDetails[key](data[key]);
        if (!validate.success) {
            setSaveError(validate.error);
            resetError();
            return;
        }
        const save = await updateFundraiser(id.fundraiserId, data);
        if (save.error) {
            setSaveError(save.error);
            resetError();
            return;
        }
        if (save.nextError) {
            setSaveError(save.nextError);
            resetError();
            return;
        }

        setSaveInfo('Changes saved successfully!');
        setStates.setIsDataSaved(true);

        setTimeout(() => {
            setEditData({ photo: null, title: '', goal: 0, category: '', type: '', description: '', name: '', phone: '', address: { street: '', wardNo: '', city: '', district: '' } });
            setEditError('');
            setSaveInfo('');
            setSaveError('');
            setSaveLoading(false);
            setStates.setShowEdit(false);
            setStates.setNowEditing(null);
            setStates.setIsDataSaved(false);
        }, 3000);

    }

    const handleSaveBeneficiaryClick = async (key, data) => {
        if (saveLoading) {
            return;
        }
        setSaveLoading(true);
        setSaveInfo('');
        setSaveError('');

        const validate = validateDetailsBeneficiary[key](data[key]);
        if (!validate.success) {
            setSaveError(validate.error);
            resetError();
            return;
        }
        const save = await updateBeneficiary(id.beneficiaryId, data);
        if (save.error) {
            setSaveError(save.error);
            resetError();
            return;
        }
        if (save.nextError) {
            setSaveError(save.nextError);
            resetError();
            return;
        }

        setSaveInfo('Changes saved successfully!');
        setStates.setIsDataSaved(true);

        setTimeout(() => {
            setEditData({ photo: null, title: '', goal: 0, category: '', type: '', description: '', name: '', phone: '', address: { street: '', wardNo: '', city: '', district: '' } });
            setEditError('');
            setSaveInfo('');
            setSaveError('');
            setSaveLoading(false);
            setStates.setShowEdit(false);
            setStates.setNowEditing(null);
            setStates.setIsDataSaved(false);
        }, 3000);

    }
    const districUpper = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    const handleSaveAddressClick = async (data) => {
        if (saveLoading) {
            return;
        }
        setSaveLoading(true);
        setSaveInfo('');
        setSaveError('');

        let newData = { ...data };
        newData.district = districUpper(data.district);

        const validateStreet = validateDetailsBeneficiary.street(newData.street);
        const validateWardNo = validateDetailsBeneficiary.wardNo(newData.wardNo);
        const validateCity = validateDetailsBeneficiary.city(newData.city);
        const validateDistrict = validateDetailsBeneficiary.district(newData.district);
        if (!validateStreet.success) {
            setSaveError(validateStreet.error);
            resetError();
            return;
        }
        if (!validateWardNo.success) {
            setSaveError(validateWardNo.error);
            resetError();
            return;
        }
        if (!validateCity.success) {
            setSaveError(validateCity.error);
            resetError();
            return;
        }
        if (!validateDistrict.success) {
            setSaveError(validateDistrict.error);
            resetError();
            return;
        }
        const save = await updateBeneficiary(id.beneficiaryId, { address: newData });
        if (save.error) {
            setSaveError(save.error);
            resetError();
            return;
        }
        if (save.nextError) {
            setSaveError(save.nextError);
            resetError();
            return;
        }

        setSaveInfo('Changes saved successfully!');
        setStates.setIsDataSaved(true);

        setTimeout(() => {
            setEditData({ photo: null, title: '', goal: 0, category: '', type: '', description: '', name: '', phone: '', address: { street: '', wardNo: '', city: '', district: '' } });
            setEditError('');
            setSaveInfo('');
            setSaveError('');
            setSaveLoading(false);
            setStates.setShowEdit(false);
            setStates.setNowEditing(null);
            setStates.setIsDataSaved(false);
        }, 3000);

    }

    // const isFormValid = () => {
    //     return (
    //       editError !== '' &&
    //       Object.values(edit).every(value => value.trim() !== '')
    //     );
    //   };

    const getImageUrl = (myfile) => {
        const imageUrl = `data:${myfile.fileContentType};base64,${myfile.fileData}`;
        return imageUrl;
    }

    const handleCancelClick = () => {
        setLoading(true);
        setEditData({ photo: null, title: '', goal: 0, category: '', type: '', description: '', name: '', phone: '', address: { street: '', wardNo: '', city: '', district: '' } });
        setEditError('');
        setTimeout(() => {
            setStates.setShowEdit(false);
            setStates.setNowEditing(null);
            setStates.setIsDataSaved(false);
            setLoading(false);
        }, 200);
    }

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
            name: "Education",
            icon: <MdCastForEducation />,
        },
        {
            name: "Family",
            icon: <MdFamilyRestroom />,
        },
        {
            name: "Non Profit",
            icon: <BiSolidDonateHeart />,
        },
    ]
    const fundraiserTypes = [
        {
            name: "Yourself",
            description: "Funds are delivered to your bank account for your own use.",
            icon: <HiMiniHandRaised />,
        },
        {
            name: "Someone else",
            description: "You will invite a beneficiary to recieve funds or distribute them yourself.",
            icon: <FaPeopleGroup />,
        },
        {
            name: "Charity",
            description: "Funds are delivered to your choosen nonprofit for you.",
            icon: <FaHandHoldingHeart />,
        },
    ]

    const isAddressValid = () => {
        return (
            Object.values(editData.address).every(value => value.trim() !== '')
        );
    };

    return (

        loading ? <div className="fs-loading">
            <MoonLoader size={100} color='var(--btn-secondary)' />
        </div> : <div className="fs-edit-container">

            <div className={`notifyme ${saveError && "notifyme-active"}`}>
                <div className="notifyme-top">
                    <div className="notifyme-left">
                        <button className='notifyme-btn uncheck'><MdError /></button>
                        <div className="notifyme-text" style={{ color: "rgb(180, 4, 4)" }}>{saveError}</div>
                    </div>
                </div>
                {saveError && <div className="notifyme-buttom" style={{ backgroundColor: "rgb(180, 4, 4)" }}></div>}
            </div>
            <div className={`notifyme ${saveInfo && "notifyme-active"}`}>
                <div className="notifyme-top">
                    <div className="notifyme-left">
                        <button className='notifyme-btn check'><FaCheckCircle /></button>
                        <div className="notifyme-text" style={{ color: "rgb(1, 126, 8)" }}>{saveInfo}</div>
                    </div>
                </div>
                {saveInfo && <div className="notifyme-buttom" style={{ backgroundColor: "rgb(1, 126, 8)" }}></div>}
            </div>
            {nowEditing.key === 'photo' && <div className="fs-edit-photo">
                <h2 className="fs-edit-box-title">Change Cover Image</h2>

                <div className="fs-no-uploads-main">
                    {editData.photo && <picture className='fs-uploaded-picture'>
                        <Image className='fs-uploaded-cover-image' src={getImageUrl(editData.photo)} width={300} height={200} priority alt="uploaded-cover" />
                    </picture>}
                    {!(editData.photo) && <div className='fs-image-icon-picture'>
                        <CiImageOn />
                    </div>}
                    <input
                        type="file"
                        id="fileInput"
                        onChange={(e) => { handlePhotoChange(e.target.files[0]) }}
                        style={{ display: 'none' }}
                    />
                    <label htmlFor="fileInput" className={`fs-custom-file-input ${!editData.photo && "fs-upload-btn"}`}>
                        <div className="fs-fileInput-icon">{editData.photo ? <MdChangeCircle /> : <MdCloudUpload />}</div>
                        <div className="fs-fileInput-text">{editData.photo ? 'Change Image' : 'Choose Image'}</div>
                    </label>

                    {editError && <div className="fs-photo-error">
                        <BiSolidError /> {editError}
                    </div>}
                </div>

                <div className="fs-save-and-cancel">
                    <button type="button" className='fs-sc-edit-btns fs-cancel-edit-btn' onClick={(e) => { handleCancelClick(); }}>Cancel</button>
                    <button disabled={editData.phone === null || saveError !== '' || editError !== '' || saveLoading} type="button" className='fs-sc-edit-btns fs-save-edit-btn' onClick={(e) => { handleSaveClick('photo', { photo: editData.photo }); }}>{saveLoading ? <PulseLoader size={10} margin={4} color='var(--text-light)' /> : "Save"}</button>
                </div>

            </div>}

            {nowEditing.key === 'title' && <div className="fs-edit-photo">
                <h2 className="fs-edit-box-title">Edit Title</h2>

                <div className="fs-title-container">
                    <div className="fs-inputBox">
                        <input type="text" className={`${editData.title !== "" && "fs-valid"}`} name="title" value={editData.title} onChange={(e) => { handleTitleChange(e.target.value); }} required />
                        <span>Fundraiser title</span>
                        <div className="fs-title-length">{editData.title.length} / 80</div>
                    </div>
                    {editError != "" && <div className="fs-title-error">
                        <BiSolidError /> {editError}
                    </div>}
                </div>

                <div className="fs-save-and-cancel">
                    <button type="button" className='fs-sc-edit-btns fs-cancel-edit-btn' onClick={(e) => { handleCancelClick(); }}>Cancel</button>
                    <button disabled={editData.title.trim() === '' || saveError !== '' || editError !== '' || saveLoading} type="button" className='fs-sc-edit-btns fs-save-edit-btn' onClick={(e) => { handleSaveClick('title', { title: editData.title }); }}>{saveLoading ? <PulseLoader size={10} margin={4} color='var(--text-light)' /> : "Save"}
                    </button>
                </div>
            </div>}

            {nowEditing.key === 'goal' && <div className="fs-edit-photo">
                <h2 className="fs-edit-box-title">Set New Goal</h2>
                <div className="fs-title-container">
                    <div className="fs-inputBox">
                        <input type="number" className={`${editData.goal !== "" && "fs-valid"}`} name="goal" value={editData.goal} onChange={(e) => { handleGoalChange(e.target.value); }} required />
                        <span>Starting Goal</span>
                        <div className="fs-currency">NRS</div>
                    </div>
                    {editError != "" && <div className="fs-title-error">
                        <BiSolidError /> {editError}
                    </div>}
                </div>

                <div className="fs-save-and-cancel">
                    <button type="button" className='fs-sc-edit-btns fs-cancel-edit-btn' onClick={(e) => { handleCancelClick(); }}>Cancel</button>
                    <button disabled={editData.goal.trim() === '' || saveError !== '' || editError !== '' || saveLoading} type="button" className='fs-sc-edit-btns fs-save-edit-btn' onClick={(e) => { handleSaveClick('goal', { goal: editData.goal }); }}>{saveLoading ? <PulseLoader size={10} margin={4} color='var(--text-light)' /> : "Save"}</button>
                </div>
            </div>}

            {nowEditing.key == 'category' && <div className="fs-edit-photo">
                <h2 className="fs-edit-box-title">Select Category</h2>

                <ul className="gs-select-category-lists">
                    {categories.map((item, index) => {
                        return (
                            <li key={index} className={`gs-category-item ${(editData.category == item.name) && "category-active"}`} onClick={(e) => { (editData.category == item.name) ? handleCategoryChange('') : handleCategoryChange(item.name) }}>
                                <div className="gs-category-icon">{item.icon}</div>
                                <div className="gs-category-name">{item.name}</div>
                            </li>
                        )
                    })}
                </ul>
                <div className="fs-save-and-cancel">
                    <button type="button" className='fs-sc-edit-btns fs-cancel-edit-btn' onClick={(e) => { handleCancelClick(); }}>Cancel</button>
                    <button disabled={editData.category.trim() === '' || saveError !== '' || editError !== '' || saveLoading} type="button" className='fs-sc-edit-btns fs-save-edit-btn' onClick={(e) => { handleSaveClick('category', { category: editData.category }); }}>{saveLoading ? <PulseLoader size={10} margin={4} color='var(--text-light)' /> : "Save"}</button>
                </div>
            </div>}

            {nowEditing.key == 'type' && <div className="fs-edit-photo">
                <h2 className="fs-edit-box-title">Fundraising For</h2>

                <ul className="gs-select-type-lists">
                    {fundraiserTypes.map((item, index) => {
                        return (
                            <li key={index} className={`gs-type-item ${(editData.type == item.name) && "category-active"}`} onClick={(e) => { (editData.type == item.name) ? handleTypeChange('') : handleTypeChange(item.name) }}>
                                <div className="gs-type-icon">{item.icon}</div>
                                <div className="gs-type-details">
                                    <h3 className="gs-type-name">{item.name}</h3>
                                    <p className="gs-type-desc">{item.description}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
                <div className="fs-save-and-cancel">
                    <button type="button" className='fs-sc-edit-btns fs-cancel-edit-btn' onClick={(e) => { handleCancelClick(); }}>Cancel</button>
                    <button disabled={editData.type.trim() === '' || saveError !== '' || editError !== '' || saveLoading} type="button" className='fs-sc-edit-btns fs-save-edit-btn' onClick={(e) => { handleSaveClick('type', { type: editData.type }); }}>{saveLoading ? <PulseLoader size={10} margin={4} color='var(--text-light)' /> : "Save"}</button>
                </div>
            </div>}

            {nowEditing.key === 'description' && <div className="fs-edit-photo">
                <h2 className="fs-edit-box-title">Edit Description</h2>

                <div className="fs-desc-container">
                    <div className="gs3-desc-box">
                        <textarea className={`${editData.description !== "" && "gs3-valid-desc"}`} name="description" value={editData.description} onChange={(e) => { handleDescChange(e.target.value); }} required></textarea>
                        <span>Add your description here</span>
                        <div className="gs3-character-count">{editData.description.length} / 2000</div>
                    </div>
                    {editError != "" && <div className="gs3-desc-error">
                        <BiSolidError /> {editError}
                    </div>}
                </div>

                <div className="fs-save-and-cancel">
                    <button type="button" className='fs-sc-edit-btns fs-cancel-edit-btn' onClick={(e) => { handleCancelClick(); }}>Cancel</button>
                    <button disabled={editData.description.trim() === '' || saveError !== '' || editError !== '' || saveLoading} type="button" className='fs-sc-edit-btns fs-save-edit-btn' onClick={(e) => { handleSaveClick('description', { description: editData.description }); }}>{saveLoading ? <PulseLoader size={10} margin={4} color='var(--text-light)' /> : "Save"}</button>
                </div>
            </div>}

            {nowEditing.key === 'name' && <div className="fs-edit-photo">
                <h2 className="fs-edit-box-title">Edit Beneficiary's Name</h2>

                <div className="fs-title-container">
                    <div className="fs-inputBox">
                        <input type="text" className={`${editData.name !== "" && "fs-valid"}`} name="name" value={editData.name} onChange={(e) => { handleNameChange(e.target.value); }} required />
                        <span>Full Name</span>
                        {/* <div className="fs-title-length">{editData.title.length} / 80</div> */}
                    </div>
                    {editError != "" && <div className="fs-title-error">
                        <BiSolidError /> {editError}
                    </div>}
                </div>

                <div className="fs-save-and-cancel">
                    <button type="button" className='fs-sc-edit-btns fs-cancel-edit-btn' onClick={(e) => { handleCancelClick(); }}>Cancel</button>
                    <button disabled={editData.name.trim() === '' || saveError !== '' || editError !== '' || saveLoading} type="button" className='fs-sc-edit-btns fs-save-edit-btn' onClick={(e) => { handleSaveBeneficiaryClick('name', { name: editData.name }); }}>{saveLoading ? <PulseLoader size={10} margin={4} color='var(--text-light)' /> : "Save"}
                    </button>
                </div>
            </div>}

            {nowEditing.key === 'phone' && <div className="fs-edit-photo">
                <h2 className="fs-edit-box-title">Edit Beneficiary's Phone</h2>

                <div className="fs-title-container">
                    <div className="fs-inputBox">
                        <input type="number" className={`${editData.phone !== "" && "fs-valid"}`} name="phone" value={editData.phone} onChange={(e) => { handlePhoneChange(e.target.value); }} required />
                        <span>Phone Number</span>
                        {/* <div className="fs-title-length">{editData.title.length} / 80</div> */}
                    </div>
                    {editError != "" && <div className="fs-title-error">
                        <BiSolidError /> {editError}
                    </div>}
                </div>

                <div className="fs-save-and-cancel">
                    <button type="button" className='fs-sc-edit-btns fs-cancel-edit-btn' onClick={(e) => { handleCancelClick(); }}>Cancel</button>
                    <button disabled={editData.phone.trim() === '' || saveError !== '' || editError !== '' || saveLoading} type="button" className='fs-sc-edit-btns fs-save-edit-btn' onClick={(e) => { handleSaveBeneficiaryClick('phone', { phone: editData.phone }); }}>{saveLoading ? <PulseLoader size={10} margin={4} color='var(--text-light)' /> : "Save"}
                    </button>
                </div>
            </div>}

            {nowEditing.key === 'address' && <div className="fs-edit-photo">
                <h2 className="fs-edit-box-title">Edit Beneficiary's Address</h2>

                <div className="fs-title-container">
                    <div className="fs-inputBox fs-address-input">
                        <input type="text" className={`${editData.address.street !== "" && "fs-valid"}`} name="phone" value={editData.address.street} onChange={(e) => { handleAddressChange('street', e.target.value); }} required />
                        <span>Street</span>
                    </div>
                    <div className="fs-inputBox fs-address-input">
                        <input type="number" className={`${editData.address.wardNo !== "" && "fs-valid"}`} name="phone" value={editData.address.wardNo} onChange={(e) => { handleAddressChange('wardNo', e.target.value); }} required />
                        <span>Ward No.</span>
                    </div>
                    <div className="fs-inputBox fs-address-input">
                        <input type="text" className={`${editData.address.city !== "" && "fs-valid"}`} name="phone" value={editData.address.city} onChange={(e) => { handleAddressChange('city', e.target.value); }} required />
                        <span>City</span>
                    </div>
                    <div className="fs-inputBox">
                        <input type="text" className={`${editData.address.district !== "" && "fs-valid"}`} name="phone" value={editData.address.district} onChange={(e) => { handleAddressChange('district', e.target.value); }} required />
                        <span>District</span>
                    </div>
                    {editError != "" && <div className="fs-title-error">
                        <BiSolidError /> {editError}
                    </div>}
                </div>

                <div className="fs-save-and-cancel">
                    <button type="button" className='fs-sc-edit-btns fs-cancel-edit-btn' onClick={(e) => { handleCancelClick(); }}>Cancel</button>
                    <button type="button" className='fs-sc-edit-btns fs-save-edit-btn' disabled={!isAddressValid() || saveError !== '' || editError !== '' || saveLoading} onClick={(e) => { handleSaveAddressClick(editData.address); }}>{saveLoading ? <PulseLoader size={10} margin={4} color='var(--text-light)' /> : "Save"}
                    </button>
                </div>
            </div>}
        </div>
    )
}

export default EditBox
