"use client"
import React, { useState, useEffect, useRef } from 'react'
import "./FifthPage.css";
import { isValidDetails } from '@/utils/validateFundraiser';
import { handleFundraiser } from '@/actions/handleFundraiser';
import { useRouter } from 'next/navigation';

import { PulseLoader } from "react-spinners";
import { IoArrowBackOutline } from "react-icons/io5";
import { IoTriangleSharp } from "react-icons/io5";
import { ImRadioUnchecked, ImRadioChecked2 } from "react-icons/im";
import { FaCheckCircle } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { BiSolidError } from "react-icons/bi";

const FifthPage = ({ phase, setPhase, user }) => {

    const router = useRouter();

    const [formData, setFormData] = useState({ name: '', phone: '', street: '', city: '', wardNo: '', district: '' })
    const [inputErrors, setInputErrors] = useState({ name: '', phone: '', street: '', city: '', wardNo: '', district: '' })
    const [cityType, setCityType] = useState('Municipality');
    const [previewData, setPreviewData] = useState(null);

    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [showDistrict, setShowDistrict] = useState(false);
    const districtRef = useRef(null);

    const inputRefs = useRef({});
    const [focusedField, setFocusedField] = useState(null);

    const cities = ["Muni", "Metro", "Sub-metro", "VDC"];
    const citySpans = ["Municipality", "Metropolitancity", "Sub-metropolitancity", "VDC"];

    const districts = [
        "Achham",
        "Arghakhanchi",
        "Baglung",
        "Baitadi",
        "Bajhang",
        "Bajura",
        "Banke",
        "Bara",
        "Bardiya",
        "Bhaktapur",
        "Bhojpur",
        "Chitwan",
        "Dailekh",
        "Dang",
        "Darchula",
        "Dadeldhura",
        "Dhading",
        "Dhanusha",
        "Dhankuta",
        "Dolakha",
        "Dolpa",
        "Doti",
        "Eastern Rukum",
        "Gorkha",
        "Gulmi",
        "Humla",
        "Ilam",
        "Jajarkot",
        "Jhapa",
        "Jumla",
        "Kailali",
        "Kalikot",
        "Kanchanpur",
        "Kapilavastu",
        "Kaski",
        "Kathmandu",
        "Kavrepalanchok",
        "Khotang",
        "Lalitpur",
        "Lamjung",
        "Mahottari",
        "Manang",
        "Makwanpur",
        "Mugu",
        "Morang",
        "Mustang",
        "Myagdi",
        "Nawalpur",
        "Nuwakot",
        "Okhaldhunga",
        "Panchthar",
        "Parasi",
        "Parbat",
        "Parsa",
        "Pyuthan",
        "Rajanpur",
        "Ramechhap",
        "Rasuwa",
        "Rautahat",
        "Rolpa",
        "Rupandehi",
        "Salyan",
        "Sankhuwasabha",
        "Saptari",
        "Sarlahi",
        "Siraha",
        "Solukhumbu",
        "Sindhuli",
        "Sindhupalchok",
        "Sunari",
        "Surkhet",
        "Syangja",
        "Tanahun",
        "Taplejung",
        "Tehrathum",
        "Udayapur",
        "Western Rukum"
    ];

    useEffect(() => {
        const savedData = JSON.parse(localStorage.getItem('formData'));
        if (savedData) {
            setFormData(savedData);
        }

        const savedData1 = JSON.parse(localStorage.getItem('firstData'));
        const savedData2 = JSON.parse(localStorage.getItem('secondData'));
        const savedData3 = JSON.parse(localStorage.getItem('thirdData'));

        if (savedData1 && savedData2 && savedData3) {
            const allData = {
                photo: savedData2.photo,
                title: savedData3.title.trim(),
                goal: savedData2.goal.trim(),
                category: savedData1.category.trim(),
                type: savedData1.type.trim(),
                description: savedData3.description.trim(),
            }
            setPreviewData(allData);
        }

        console.log(user);
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (districtRef.current && !districtRef.current.contains(event.target)) {
                setShowDistrict(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [showDistrict]);

    const resetFields = () => {
        setFormData({ name: '', phone: '', street: '', city: '', wardNo: '', district: '' })
        setInputErrors({ name: '', phone: '', street: '', city: '', wardNo: '', district: '' })
        setCityType('Municipality');
        setPreviewData(null);
        setError('');
        setInfo('');
        setIsLoading(false);
        setFilteredDistricts([]);
        setShowDistrict(false);
        setFocusedField(null);
    }

    const filterDistricts = (searchTerm) => {
        if (searchTerm.trim() === '') {
            setFilteredDistricts([]);
        } else {
            const filteredList = districts.filter((district) =>
                district.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDistricts(filteredList);
        }
    };

    const handleBackClick = () => {
        setPhase('fourth');
        localStorage.setItem('currentPage', 'fourth');
    }

    const isValidAddress = (name, str) => {
        const nameRegex = /^[A-Za-z\s]+$/;
        if (nameRegex.test(str)) {
            if (name == 'District') {
                if (districts.includes(str)) {
                    return { success: true };
                } else {
                    return { success: false, error: 'Invalid district!' };
                }
            }
            return { success: true };
        } else {
            return { success: false, error: `${name} can only contain alphabets!` };
        }
    };

    const isValidPhone = (phoneNumber) => {
        const isValid = /^(97|98)\d{8}$/.test(phoneNumber);
        if (isValid) {
            return { success: true };
        } else {
            return { success: false, error: 'Invalid phone no.!' };
        }
    }
    const isValidWardNo = (wardNo) => {
        const isValid = /^\d{1,2}$/.test(wardNo);
        if (isValid) {
            return { success: true };
        } else {
            return { success: false, error: 'Invalid ward no.!' };
        }
    }

    const isValidName = (name) => {
        const isValid = /^[A-Za-z\s]+$/.test(name);
        if (isValid) {
            return { success: true };
        } else {
            return { success: false, error: 'Name can only contain alphabets!' };
        }
    }

    const isPrevFieldsValid = (key) => {
        const fields = ["name", "phone", "street", "wardNo", "city", "district"];
        const currentIndex = fields.indexOf(key);

        for (let i = 0; i < currentIndex; i++) {
            const prevKey = fields[i];
            const prevFieldValue = formData[prevKey];

            const validation = errorFunctions[prevKey](prevFieldValue);

            if (prevFieldValue.trim() === "" || !validation.success) {
                setInputErrors(prevErrors => ({
                    ...prevErrors,
                    [prevKey]: prevFieldValue.trim() === "" ? "First fill out this field!" : validation.error
                }));
                inputRefs.current[prevKey].focus();
                return false;
            }
        }
        return true;
    };

    const handleInputChange = (key, value) => {
        if (!isPrevFieldsValid(key)) {
            return;
        }

        const validation = errorFunctions[key](value);
        if (!validation.success) {
            handleInputErrors(key, validation.error);
        } else {
            handleInputErrors(key, '');
        }

        let newData = { ...formData };
        newData[key] = value;
        setFormData(newData);
        localStorage.setItem('formData', JSON.stringify(newData));

        if (key == 'district') {
            filterDistricts(value);
        }
    };

    const handleInputErrors = (field, error) => {
        setInputErrors(prevErrors => ({ ...prevErrors, [field]: error }));
    };

    const handleInputFocus = (key) => {
        setFocusedField(key);
        isPrevFieldsValid(key);
        if (key == 'district') {
            isPrevFieldsValid(key) && setShowDistrict(true);
        }
    };

    const handleInputBlur = () => {
        setFocusedField(null);
    };

    const errorFunctions = {
        name: isValidName,
        phone: isValidPhone,
        street: (str) => isValidAddress('Street', str),
        city: (str) => isValidAddress('City', str),
        district: (str) => isValidAddress('District', str),
        wardNo: isValidWardNo,
    };

    const inputField = (type, name, span) => {
        return (
            <div className="gs5-inputBox">
                <input
                    ref={(el) => (inputRefs.current[name] = el)}
                    type={type}
                    className={`${formData[name] !== "" && "valid"} ${inputErrors[name] !== "" && "error"}`}
                    name={name}
                    value={formData[name]}
                    onChange={(e) => { handleInputChange(name, e.target.value); }}
                    onFocus={() => handleInputFocus(name)}
                    onBlur={handleInputBlur}
                    required
                />
                <span>{span}</span>
                {(focusedField === name && inputErrors[name]) && (
                    <div className="gs5-input-error-div">
                        <div className="gs5-pointer-icon"><IoTriangleSharp /></div>{inputErrors[name]}
                    </div>
                )}
            </div>
        );
    };

    const isFormValid = () => {
        return (
            Object.values(inputErrors).every(error => error === '') &&
            Object.values(formData).every(value => value.trim() !== '')
        );
    };

    const handleDistrictClick = (district) => {
        handleInputChange('district', district);
        setShowDistrict(false);
    }

    const resetError = () => {
        setTimeout(() => {
            setError('');
        }, 4000);
    }

    const RemoveLocalStorage = () => {
        localStorage.removeItem('firstData');
        localStorage.removeItem('secondData');
        localStorage.removeItem('thirdData');
        localStorage.removeItem('formData');
        localStorage.removeItem('currentPage');
    }

    const handleFundraiserSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError('');
        setInfo('');

        if (!isFormValid()) {
            setError("Please provide all fields!");
            setIsLoading(false);
            resetError();
            return;
        }

        const validName = isValidName(formData.name);
        if (!validName?.success) {
            setError(validName.error);
            setIsLoading(false);
            resetError();
            return;
        }

        const ValidPhone = isValidPhone(formData.phone);
        if (!ValidPhone?.success) {
            setError(ValidPhone.error);
            setIsLoading(false);
            resetError();
            return;
        }

        const validStreet = isValidAddress('Street', formData.street);
        if (!validStreet?.success) {
            setError(validStreet.error);
            setIsLoading(false);
            resetError();
            return;
        }
        const ValidWardNo = isValidWardNo(formData.wardNo);
        if (!ValidWardNo?.success) {
            setError(ValidWardNo.error);
            setIsLoading(false);
            resetError();
            return;
        }
        const validCity = isValidAddress('City', formData.city);
        if (!validCity?.success) {
            setError(validCity.error);
            setIsLoading(false);
            resetError();
            return;
        }
        const validDistrict = isValidAddress('District', formData.district);
        if (!validDistrict?.success) {
            setError(validDistrict.error);
            setIsLoading(false);
            resetError();
            return;
        }

        const detailsValidation = isValidDetails(previewData);
        if (!detailsValidation.success) {
            setError(detailsValidation?.error);
            setIsLoading(false);
            resetError();
            return;
        }

        const personalInfo = {
            ...formData,
            organizerId: user?.id,
        }

        const details = {
            ...previewData,
        }

        const fundraiser = await handleFundraiser(details, personalInfo);

        setIsLoading(false);

        if (fundraiser?.success) {
            setInfo("Fundraiser successfully published!");

            setTimeout(() => {
                router.push('/');
                router.refresh();
                RemoveLocalStorage();
                resetFields();
            }, 1000);

            return;
        }

        if (fundraiser?.error) {
            setError(fundraiser.error);
            resetError();
            return;
        }

        if (fundraiser?.nextError) {
            setError("Something went wrong!");
            resetError();
            return;
        }

    }

    return (
        <>
            <form onSubmit={(e) => { handleFundraiserSubmit(e); }} className="gs5-complete-form-container">

                <div className='gs5-primary-details-container'>
                    <p className="gs5-note-section"><i><b>Note:</b>Please provide details of the beneficiary.</i></p>
                    <div className="gs5-address-fields">
                        <h2 className="gs5-address-title">Name & Contact:</h2>
                        <div className="gs5-address-inputs">
                            <div className="gs5-input-container">{inputField('text', 'name', 'Full Name')}</div>
                            <div className="gs5-input-container">{inputField('number', 'phone', 'Phone No.')}</div>
                        </div>
                    </div>
                    <div className="gs5-address-fields">
                        <h2 className="gs5-address-title">Address:</h2>
                        <div className="gs5-address-inputs">
                            <div className='gs5-input-container'>
                                {inputField('text', 'street', 'Street')}
                            </div>
                            <div className="gs5-input-container">
                                {inputField('number', 'wardNo', 'Ward No.')}
                            </div>
                            <div className="gs5-input-container gs5-input-city">
                                <ul className="gs5-cities-container">
                                    {cities.map((city, index) => {
                                        return (
                                            <li key={index} className='gs5-cities-item' onClick={(e) => { setCityType(citySpans[index]) }}>
                                                <div className="gs5-city-icon">{index == citySpans.indexOf(cityType) ? <FaCheckCircle /> : <ImRadioUnchecked />}</div>
                                                <div className="gs5-city-name">{city}</div>
                                            </li>
                                        )
                                    })}
                                </ul>
                                {inputField('text', 'city', cityType)}
                            </div>
                            <div ref={districtRef} className="gs5-input-container gs5-input-district">
                                {inputField('text', 'district', 'District')}
                                {(showDistrict && filteredDistricts.length > 0) && <ul className="gs5-districts-container">
                                    {filteredDistricts.map((item, index) => {
                                        return (
                                            <li key={index} className='gs5-districts-item' onClick={(e) => { handleDistrictClick(item); }}>{item}</li>
                                        )
                                    })}
                                </ul>}
                            </div>
                        </div>
                    </div>
                    {/* <div className="gs5-verify-email-container">
                        <button type='button' className="gs5-verify-email-btn">
                            <div className="gs5-verify-email-icon"><MdMarkEmailRead /></div>
                            <div className="gs5-verify-email-text">Verify Email</div>
                        </button>
                        <p className="gs5-verify-email-info">You email is not verified, Please verify to continue</p>
                    </div> */}

                </div>

                <div className={`gs5-notifyme ${error && "gs5-notifyme-active"}`}>
                    {error && <div className="gs5-notifyme-buttom" style={{ backgroundColor: "rgb(180, 4, 4)" }}></div>}
                    <div className="gs5-notifyme-top">
                        <button className='gs5-notifyme-btn uncheck'><BiSolidError /></button>
                        <div className="gs5-notifyme-text" style={{ color: "rgb(180, 4, 4)" }}>{error}</div>
                    </div>
                </div>
                <div className={`gs5-notifyme ${info && "gs5-notifyme-active"}`}>
                    {info && <div className="gs5-notifyme-buttom" style={{ backgroundColor: "rgb(1, 126, 8)" }}></div>}
                    <div className="gs5-notifyme-top">
                        <button className='gs5-notifyme-btn check'><FaCheckCircle /></button>
                        <div className="gs5-notifyme-text" style={{ color: "rgb(1, 126, 8)" }}>{info}</div>
                    </div>
                </div>

                <div className='gs5-button-container'>
                    <button type='button' className='gs5-below-btn gs5-back-btn' onClick={(e) => { handleBackClick(); }}><IoArrowBackOutline /></button>

                    <button type='submit' className='gs5-below-btn gs5-continue-btn' disabled={isLoading || !isFormValid() || error !== ''}>
                        <span>{isLoading ? <PulseLoader size={10} margin={4} /> : "Publish"}</span>
                    </button>
                </div>
            </form>
        </>
    )
}

export default FifthPage
