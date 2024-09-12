"use client"
import React, { useState, useEffect } from 'react'
import "./Getstarted.css";
import FirstPage from './FirstPage/FirstPage';
import SecondPage from './SecondPage/SecondPage';
import ThirdPage from './ThirdPage/ThirdPage';
import FourthPage from './FourthPage/FourthPage';
import Buttons from './Buttons/Buttons';

import { MoonLoader } from 'react-spinners';

import { FaHandHoldingHeart } from "react-icons/fa";

const Getstarted = () => {

  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState('first');

  const validPages = ['first', 'second', 'third', 'fourth'];

  const [completed, setCompleted] = useState(false);

  const btnParams = {
    phase: phase,
    setPhase: setPhase,
    validPages: validPages,
    completed: completed,
    setCompleted: setCompleted,
  }

  useEffect(() => {
    const currentPage = localStorage.getItem('currentPage');
    if (currentPage) {
      setPhase(currentPage)
    }

    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [])

  return (
    <main className='getstarted-container'>
      <aside className="gs-aside-content">
        <div className="gs-aside-icon"><FaHandHoldingHeart /></div>
        <div className="gs-page-count">{validPages.indexOf(phase) + 1} / {validPages.length}</div>
        <h1 className="gs-getstarted-title">Let&apos;s get started in your fundraising journey</h1>
        <p className="gs-aside-desc">We are here to assist you in every step of the way.</p>
      </aside>

      <section className='gs-fundraiser-details'>
        {loading ? <div className="gs-loading">
          <MoonLoader size={80} color='var(--text-medium)' />
        </div> : <>
          {phase === "first" && (
            <FirstPage completed={completed} setCompleted={setCompleted} />
          )}

          {phase === "second" && (
            <SecondPage completed={completed} setCompleted={setCompleted} />
          )}

          {phase === "third" && (
            <ThirdPage completed={completed} setCompleted={setCompleted} />
          )}

          {phase === "fourth" && (
            <FourthPage completed={completed} setCompleted={setCompleted} phase={phase} setPhase={setPhase}/>
          )}
        </>}

        <Buttons params={btnParams} />

      </section>
    </main>
  )
}

export default Getstarted
