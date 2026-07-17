import React, { Suspense, lazy } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';

const Dashboard = lazy(() => import('./pages/DashboardPage'));
const LandingPage = lazy(() => import('./pages/LandingPage').then((module) => ({ default: module.LandingPage })));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage').then((module) => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/TermsPage').then((module) => ({ default: module.TermsPage })));
const ProductPage = lazy(() => import('./pages/ProductPage').then((module) => ({ default: module.ProductPage })));

const PageFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#f6f7fb] text-sm font-medium text-[#5b5f75]">
    Loading page...
  </div>
);

export function App() {
  return (
    <HashRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}