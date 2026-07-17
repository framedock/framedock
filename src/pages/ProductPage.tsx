import React from 'react';
import { Navbar } from '../components/Navbar';

export function ProductPage() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#163437]">
      <Navbar ctaLabel="Launch Dashboard" ctaHref="/dashboard" />
      <main className="px-5 pb-20 pt-32 sm:px-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-[#4f46e5]">Product</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.03em] sm:text-6xl">
            FrameDock
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4b5563]">
            This is the new product page. Use it as a blank landing area for your product experience.
          </p>
        </div>
      </main>
    </div>
  );
}
