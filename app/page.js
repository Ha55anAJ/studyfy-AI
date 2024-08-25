"use client";
import { useState } from 'react';
import LandingPage from './landing/page';
import HomePage from './home-page/page';

const Page = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const handleSignInSuccess = () => {
    setIsSignedIn(true);
  };
  if (!isSignedIn) {
    return <LandingPage onSignInSuccess={handleSignInSuccess} />;
  }

  return <HomePage />;

};

export default Page;
