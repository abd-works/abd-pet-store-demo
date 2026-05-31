import { httpJson } from '../../shared/http-client';

export interface MyStoreResponse {
  storeCode: string | null;
}

export async function fetchMyStore(): Promise<MyStoreResponse> {
  return httpJson<MyStoreResponse>('/api/account/my-store');
}

export async function setMyStore(storeCode: string): Promise<MyStoreResponse> {
  return httpJson<MyStoreResponse>('/api/account/my-store', {
    method: 'PUT',
    body: JSON.stringify({ storeCode }),
  });
}

export async function clearMyStore(): Promise<MyStoreResponse> {
  return httpJson<MyStoreResponse>('/api/account/my-store', {
    method: 'DELETE',
  });
}
