"use client"
import React, {useState, useEffect} from 'react'
import "./InputBox.css";

const InputBox = ({ type, value, name, label, error, changeFunction }) => {

    return (
        <div className="fn-inputBox">
            <input
                type={type}
                className={`${value !== "" && "valid"} ${error !== "" && "error"}`}
                name={name}
                value={value}
                onChange={(e) => { changeFunction(name, e.target.value); }}
                required
            />
            <span>{label}</span>

            {error !== "" && <div className="fn-input-error">{error}</div>}
        </div>
    )
}

export default InputBox
