import { CollectibleCollection } from "../util/types";
import { collectibleCollectionConfig } from "../config";
import { CHAIN_ID } from "./constants";



let collectibleCollection: CollectibleCollection[] = [];

const getContractFromChainId = (addresses: Addresses) => {
    switch (CHAIN_ID) {
        case 1:
            return addresses.mainnet;
        case 3:
            return addresses.ropsten;
        case 42:
             return addresses.kovan;
        default:
           return null;
    }
}

collectibleCollection = collectibleCollectionConfig.collections.filter(c=> getContractFromChainId(c.addresses) !== null).map(c => {
    return {
        name: c.name,
        address: getContractFromChainId(c.addresses) || '0x',
        description: c.description,
        icon: c.icon,
        symbol: c.symbol || c.name.toLowerCase(),
    }
})

interface Addresses{
    mainnet?: string;
    ropsten?: string;
    kovan?: string;
}

export const getCollectibleCollections = (): CollectibleCollection[] => {
    return collectibleCollection;
}


