import { CHAIN_ID } from "../../common/constants";
import { ChainId } from "../types/swap";


export const LENDING_POOL_ADDRESS = (() => {
    switch (CHAIN_ID) {
        case ChainId.Mainnet:
            return '';
        case ChainId.Ropsten:
            return '';
        case ChainId.Kovan:
            return '';
        default:
            return '';
    }
})();


