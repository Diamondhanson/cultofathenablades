'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

const STORAGE_KEY = 'coab_age_verified_18_plus';

export default function AgeGate() {
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const [denied, setDenied] = useState(false);

  // Only show age gate on the home page
  const shouldGuardThisRoute = pathname === '/';

  useEffect(() => {
    if (!shouldGuardThisRoute) {
      setChecked(true);
      setAllowed(true);
      return;
    }

    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'true') {
      setAllowed(true);
    }
    setChecked(true);
  }, [shouldGuardThisRoute]);

  if (!checked || allowed || !shouldGuardThisRoute) {
    return null;
  }

  const handleAllow = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    }
    setAllowed(true);
  };

  const handleDeny = () => {
    setDenied(true);
  };

  return (
    <div className="age-gate-backdrop">
      <div className="age-gate-card">
        <h2 className="age-gate-title">Are you 18 years or older?</h2>
        <p className="age-gate-text">
          This site offers blades intended for adult collectors and practitioners. Please confirm your age
          to continue.
        </p>

        {denied ? (
          <p className="age-gate-text" style={{ marginTop: '1rem' }}>
            You must be 18 years of age or older to access this site.
          </p>
        ) : (
          <div className="age-gate-actions">
            <button type="button" className="btn btn-primary" onClick={handleAllow}>
              Yes, I am 18+
            </button>
            <button
              type="button"
              className="btn age-gate-secondary"
              onClick={handleDeny}
            >
              No, I&apos;m under 18
            </button>
          </div>
        )}
      </div>
    </div>
  );
}


