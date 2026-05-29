import React from 'react';
import { panelStyle, splitStyle, storePlaceholderStyle } from './storeLocatorStyles';

export function SplitScreenLayout({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div style={splitStyle}>
      <div style={panelStyle}>{left}</div>
      <div>{right}</div>
    </div>
  );
}

export function StorePlaceholderPanel() {
  return (
    <div style={storePlaceholderStyle}>
      Select a store to view address, operating hours, and contact details.
    </div>
  );
}
