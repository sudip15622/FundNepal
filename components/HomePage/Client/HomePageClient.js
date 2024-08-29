"use client"
import React from 'react'
import "./HomePageClient.css";
import Image from 'next/image';

const HomePageClient = () => {
  return (
    <main className='homepage-container'>
      <div className="cover-image-container">
        <Image className='homepage-cover-image' src="/cover_image.png" width={1000} height={350} priority alt="cover-image" />
        <Image className='homepage-cover-image-shadow' src="/cover_shadow.png" width={1000} height={200} priority alt="cover-image-shadow" />
      </div>
    </main>
  )
}

export default HomePageClient
