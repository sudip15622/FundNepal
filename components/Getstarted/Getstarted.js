"use client"
import React, { useState, useEffect } from 'react'
import "./Getstarted.css";
import { useSearchParams } from 'next/navigation';
import FirstPage from './FirstPage/FirstPage';
import SecondPage from './SecondPage/SecondPage';
import Buttons from './Buttons/Buttons';

import { FaHandHoldingHeart } from "react-icons/fa";

const Getstarted = () => {

  const searchParams = useSearchParams();

  const page = searchParams.get('page') || 'first';

  const [validPage, setValidPage] = useState(true);
  const [phase, setPhase] = useState(page);

  const validPages = ['first', 'second', 'third'];

  const [completed, setCompleted] = useState(false);

  const btnParams = {
    phase: phase,
    setPhase: setPhase,
    validPages: validPages,
    completed: completed,
    setCompleted: setCompleted,
  }

  useEffect(() => {
    if (validPages.includes(page)) {
      setPhase(page);
      setValidPage(true);
    } else {
      setValidPage(false);
    }
  }, [page]);

  return (
    <main className='getstarted-container'>
      <aside className="gs-aside-content">
        <div className="gs-aside-icon"><FaHandHoldingHeart /></div>
        <h1 className="gs-getstarted-title">Let&apos;s get started in your fundraising journey</h1>
        <p className="gs-aside-desc">We are here to assist you in every step of the way.</p>
      </aside>

      {validPage ? <section className='gs-fundraiser-details'>
        {phase === "first" && (
          <FirstPage completed={completed} setCompleted={setCompleted}/>
        )}

        {phase === "second" && (
          <SecondPage completed={completed} setCompleted={setCompleted}/>
        )}

        <Buttons params={btnParams}/>

      </section> : <div className="invalid-page">
        <h1>Invalid Page</h1>
        <p>The page you are looking for does not exist.</p>
      </div>}
    </main>
  )
}

export default Getstarted
