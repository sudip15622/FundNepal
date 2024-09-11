"use client"
import React, { useState, useRef } from 'react'
import "./input.css";

const page = () => {

    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [inputErrors, setInputErrors] = useState({ name: '', email: '', password: '', confirmPassword: '' });

    // Define refs as an array of objects
    const inputRefs = useRef({});

    const hasSpecialCharactersOrNumbers = (str) => {
        const nameRegex = /^[A-Za-z\s]+$/;
        if (nameRegex.test(str)) {
            return { success: true };
        } else {
            return { success: false, error: 'Name can only contain alphabets and spaces!' };
        }
    };

    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (regex.test(email)) {
            return { success: true };
        }
        return { success: false, error: "Invalid Email!" };
    };

    const isValidPassword = (pw) => {
        const isValid =
            pw.length >= 8 &&
            /[A-Z]/.test(pw) &&
            /[a-z]/.test(pw) &&
            /\d/.test(pw) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(pw);

        if (isValid) {
            return { success: true };
        } else {
            return { success: false, error: 'Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.' };
        }
    };

    const isSamePassword = (p1, p2) => {
        if (p1 === p2) {
            return { success: true };
        } else {
            return { success: false, error: "Passwords do not match!" };
        }
    };

    const errorFunctions = {
        name: hasSpecialCharactersOrNumbers,
        email: isValidEmail,
        password: isValidPassword,
        confirmPassword: (confirmPassword) => isSamePassword(formData.password, confirmPassword)
    };

    const isPrevFieldsValid = (key) => {
        const fields = ["name", "email", "password", "confirmPassword"];
        const currentIndex = fields.indexOf(key);

        for (let i = 0; i < currentIndex; i++) {
            const prevKey = fields[i];
            const prevFieldValue = formData[prevKey];
            if (prevFieldValue.trim() === "") {
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

        setFormData(prevData => ({ ...prevData, [key]: value }));
    };

    const handleInputErrors = (field, error) => {
        setInputErrors(prevErrors => ({ ...prevErrors, [field]: error }));
    };

    const inputField = (type, name, span) => {
        return (
            <div className="inputBox">
                <input
                    ref={(el) => (inputRefs.current[name] = el)} // Dynamically assign ref to input
                    type={type}
                    className={`${formData[name] !== "" && "valid"}`}
                    name={name}
                    value={formData[name]}
                    onChange={(e) => { handleInputChange(name, e.target.value); }}
                    required
                />
                <span>{span}</span>
                <div className="input-error-div">{(formData[name].length > 0) && inputErrors[name]}</div>
            </div>
        );
    };

    return (
        <>
            {inputField('text', 'name', 'Full Name')}
            {inputField('email', 'email', 'Email')}
            {inputField('password', 'password', 'Password')}
            {inputField('password', 'confirmPassword', 'Confirm Password')}
        </>
    );
};

export default page;
