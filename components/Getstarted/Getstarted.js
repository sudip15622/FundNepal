"use client"
import React, { useState, useEffect } from 'react'
import "./Getstarted.css";
import FirstPage from './FirstPage/FirstPage';
import SecondPage from './SecondPage/SecondPage';
import ThirdPage from './ThirdPage/ThirdPage';
import FourthPage from './FourthPage/FourthPage';
import FifthPage from './FifthPage/FifthPage';
import Buttons from './Buttons/Buttons';

import { MoonLoader } from 'react-spinners';

import { FaHandHoldingHeart } from "react-icons/fa";

const Getstarted = ({user}) => {

  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState('first');

  const validPages = ['first', 'second', 'third', 'fourth', 'fifth'];

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
    loading ? <div className="gs-loading">
      <MoonLoader size={100} color='var(--btn-secondary)' />
    </div> : <main className='getstarted-container'>
      {phase === 'fifth' ? <aside className="gs-aside-content">
        <div className="gs-aside-icon"><FaHandHoldingHeart /></div>
        <div className="gs-page-count">{validPages.indexOf(phase) + 1} / {validPages.length}</div>
        <h1 className="gs-getstarted-title">Provide details of beneficiary and publish</h1>
        <p className="gs-aside-desc">You must provide the personal details of beneficiary (who is going to benefit by this fundraiser) in order to publish this fundraiser.</p>
      </aside> : <aside className="gs-aside-content">
        <div className="gs-aside-icon"><FaHandHoldingHeart /></div>
        <div className="gs-page-count">{validPages.indexOf(phase) + 1} / {validPages.length}</div>
        <h1 className="gs-getstarted-title">Let&apos;s get started in your fundraising journey</h1>
        <p className="gs-aside-desc">We are here to assist you in every step of the way.</p>
      </aside>}

      {phase === 'fifth' ? <section className='gs-fundraiser-details'>
        <FifthPage phase={phase} setPhase={setPhase} user={user}/>
      </section> : <section className='gs-fundraiser-details'>
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
          <FourthPage completed={completed} setCompleted={setCompleted} phase={phase} setPhase={setPhase} />
        )}

        <Buttons params={btnParams} />

      </section>}
    </main>
  )
}

export default Getstarted
