import React, { useState } from 'react';
import type { InventoryDashboardRowDto } from './inventoryDashboardUtils';
import { stockStatusLabel } from './inventoryDashboardUtils';

interface InventoryDashboardTableProps {
  rows: InventoryDashboardRowDto[];
  threshold: number;
  onSaveStock?: (row: InventoryDashboardRowDto, nextLevel: number) => Promise<void>;
}

export function InventoryDashboardTable({ rows, threshold, onSaveStock }: InventoryDashboardTableProps) {
  const [editSku, setEditSku] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (row: InventoryDashboardRowDto) => {
    const parsed = Number(editValue);
    if (!Number.isFinite(parsed) || parsed < 0) {
      setError('invalid stock level');
      return;
    }
    setError(null);
    if (onSaveStock) await onSaveStock(row, parsed);
    setEditSku(null);
  };

  return (
    <div data-testid="inventory-dashboard-table">
      {error && <p role="alert">{error}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>product name</th>
            <th>category</th>
            <th>stock level</th>
            <th>status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = stockStatusLabel(row, threshold);
            return (
              <tr key={`${row.productSku}-${row.storeCode}`} data-testid={`inventory-row-${row.productSku}`}>
                <td>{row.productSku}</td>
                <td>{row.storeName}</td>
                <td>
                  {editSku === row.productSku ? (
                    <>
                      <input
                        aria-label={`stock level for ${row.productSku}`}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                      />
                      <button type="button" onClick={() => void handleSave(row)}>Save</button>
                    </>
                  ) : (
                    <>
                      {row.availableToSellQuantity}
                      <button type="button" onClick={() => { setEditSku(row.productSku); setEditValue(String(row.availableToSellQuantity)); }}>edit</button>
                    </>
                  )}
                </td>
                <td>
                  {status === 'Low stock' && (
                    <span data-testid={`low-stock-badge-${row.productSku}`}>Low stock ({row.availableToSellQuantity})</span>
                  )}
                  {status === 'Out of stock' && <span data-testid={`out-of-stock-${row.productSku}`}>Out of stock</span>}
                  {status === 'In stock' && <span>In stock</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
