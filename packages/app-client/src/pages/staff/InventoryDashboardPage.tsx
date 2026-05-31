import React, { useEffect, useMemo, useState } from 'react';
import { fetchInventoryDashboard } from '../../../../product-catalog/client/inventory-dashboard.api';
import { InventoryDashboardTable } from '../../../../product-catalog/client/InventoryDashboardTable';
import { filterDashboardRows, type InventoryDashboardRowDto } from '../../../../product-catalog/client/inventoryDashboardUtils';
import { Increment1Page } from '../../components/Increment1Page';

export function InventoryDashboardPage() {
  const [rows, setRows] = useState<InventoryDashboardRowDto[]>([]);
  const [threshold, setThreshold] = useState(5);
  const [search, setSearch] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);

  useEffect(() => {
    void fetchInventoryDashboard().then((data) => {
      setRows(data.rows);
      setThreshold(data.lowStockThreshold);
    });
  }, []);

  const visibleRows = useMemo(
    () => filterDashboardRows(rows, { search, lowStockOnly, threshold }),
    [rows, search, lowStockOnly, threshold],
  );

  const handleExport = () => {
    const csv = ['productSku,storeCode,availableToSellQuantity', ...visibleRows.map((r) => `${r.productSku},${r.storeCode},${r.availableToSellQuantity}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'inventory-export.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Increment1Page title="Inventory Dashboard">
      <div data-testid="inventory-dashboard">
        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <button type="button" onClick={handleExport}>Export CSV</button>
          <label htmlFor="inventory-search">search products</label>
          <input id="inventory-search" value={search} onChange={(e) => setSearch(e.target.value)} />
          <label>
            <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />
            {' '}
            low stock only
          </label>
        </div>
        <InventoryDashboardTable rows={visibleRows} threshold={threshold} />
      </div>
    </Increment1Page>
  );
}
