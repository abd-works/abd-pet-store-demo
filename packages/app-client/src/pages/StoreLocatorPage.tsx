import React, { useState } from 'react';
import { StoreList } from '../../../store/client/StoreList';
import { StoreMap } from '../../../store/client/StoreMap';

export function StoreLocatorPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'map'>('list');

  return (
    <div>
      <div role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'map'}
          onClick={() => setActiveTab('map')}
        >
          Map
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'list'}
          onClick={() => setActiveTab('list')}
        >
          List
        </button>
      </div>
      {activeTab === 'map' && <StoreMap />}
      {activeTab === 'list' && <StoreList />}
    </div>
  );
}
