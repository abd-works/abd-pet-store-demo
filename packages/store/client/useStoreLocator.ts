import { useStoreLocatorData } from './useStoreLocatorData';
import {
  createClearLocationHandler,
  createFindByPostcodeHandler,
  createShareLocationHandler,
} from './storeLocatorHandlers';

export function useStoreLocator() {
  const storeLocatorData = useStoreLocatorData();

  return {
    stores: storeLocatorData.stores,
    selectedStore: storeLocatorData.selectedStore,
    postcode: storeLocatorData.postcode,
    hasLocation: storeLocatorData.hasLocation,
    loading: storeLocatorData.loading,
    setSelectedStore: storeLocatorData.setSelectedStore,
    setPostcode: storeLocatorData.setPostcode,
    handleShareLocation: createShareLocationHandler(storeLocatorData),
    handleFindByPostcode: createFindByPostcodeHandler(storeLocatorData),
    handleClearLocation: createClearLocationHandler(storeLocatorData),
  };
}

export type StoreLocatorState = ReturnType<typeof useStoreLocator>;
