import React, { useState } from 'react';
import { StoreList } from '../../../store/client/StoreList';
import { StoreMap } from '../../../store/client/StoreMap';
import { Increment1Page } from '../components/Increment1Page';
import { useCustomerSession } from '../context/CustomerSessionContext';
import { FONT_WEIGHT_ACTIVE, FONT_WEIGHT_INACTIVE } from '../../../shared/layout-tokens';

const tabStyle = (active: boolean): React.CSSProperties => ({
  padding: '8px 16px',
  border: '1px solid #ccc',
  borderBottom: active ? '2px solid #111' : '1px solid #ccc',
  background: active ? '#fff' : '#f0f0f0',
  color: active ? '#111' : '#888',
  fontWeight: active ? FONT_WEIGHT_ACTIVE : FONT_WEIGHT_INACTIVE,
  cursor: 'pointer',
});

function StoreLocatorTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: 'map' | 'list';
  onTabChange: (tab: 'map' | 'list') => void;
}) {
  return (
    <div role="tablist" aria-label="store locator tab bar" style={{ marginBottom: 16, display: 'flex' }}>
      <button type="button" role="tab" aria-selected={activeTab === 'map'} onClick={() => onTabChange('map')} style={tabStyle(activeTab === 'map')}>
        map view
      </button>
      <button type="button" role="tab" aria-selected={activeTab === 'list'} onClick={() => onTabChange('list')} style={{ ...tabStyle(activeTab === 'list'), marginLeft: -1 }}>
        list view
      </button>
    </div>
  );
}

export function StoreLocatorPage() {
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('list');
  const { isLoggedIn, isVerified } = useCustomerSession();

  return (
    <Increment1Page title="store locator">
      <div data-testid="store-locator">
        <StoreLocatorTabs activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === 'map' && <StoreMap />}
        {activeTab === 'list' && <StoreList isLoggedIn={isLoggedIn} isVerified={isVerified} />}
      </div>
    </Increment1Page>
  );
}
