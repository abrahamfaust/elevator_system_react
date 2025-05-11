export const MIN_FLOORS = 2;
export const MAX_FLOORS = 20;
export const MIN_ELEVATORS = 1;
export const MAX_ELEVATORS = 5;
export const DEFAULT_FLOORS = 10;
export const DEFAULT_ELEVATORS = 2;

export const FLOOR_HEIGHT = 110; // גובה הקומה בפיקסלים
export const ELEVATOR_WIDTH = 80; // רוחב המעלית בפיקסלים

/**
 * Sets all system settings as CSS variables
 * This can be called directly for non-React contexts
 */
export function setCssSystemVars(): void {
  document.documentElement.style.setProperty('--elevator-width', `${ELEVATOR_WIDTH}px`);
  document.documentElement.style.setProperty('--floor-height', `${FLOOR_HEIGHT}px`);
  document.documentElement.style.setProperty('--min-floors', `${MIN_FLOORS}`);
  document.documentElement.style.setProperty('--max-floors', `${MAX_FLOORS}`);
    document.documentElement.style.setProperty('--min-elevators', `${MIN_ELEVATORS}`);
    document.documentElement.style.setProperty('--max-elevators', `${MAX_ELEVATORS}`);
    document.documentElement.style.setProperty('--default-floors', `${DEFAULT_FLOORS}`);
    document.documentElement.style.setProperty('--default-elevators', `${DEFAULT_ELEVATORS}`);
}

// Need to import React to define hook properly
import { useEffect } from 'react';

/**
 * React hook to set CSS variables from system settings
 * Use this in React components
 */
export function useSystemCssVars(): void {
  useEffect(() => {
    setCssSystemVars();
    
    // This will run once when the component mounts
    // No cleanup needed since we're just setting CSS variables
  }, []); // Empty dependency array means this runs once on mount
}
