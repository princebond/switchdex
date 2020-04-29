import { CHAIN_ID } from "../../common/constants";
import { ChainId } from "../types/swap";


export const LENDING_POOL_ADDRESS = (() => {
    switch (CHAIN_ID) {
        case ChainId.Mainnet:
            return '0x398eC7346DcD622eDc5ae82352F02bE94C62d119';
        case ChainId.Ropsten:
            return '0x9E5C7835E4b13368fd628196C4f1c6cEc89673Fa';
        case ChainId.Kovan:
            return '';
        default:
            return '';
    }
})();

export const LENDING_POOL_CORE_ADDRESS = (() => {
    switch (CHAIN_ID) {
        case ChainId.Mainnet:
            return '0x398eC7346DcD622eDc5ae82352F02bE94C62d119';
        case ChainId.Ropsten:
            return '0x9E5C7835E4b13368fd628196C4f1c6cEc89673Fa';
        case ChainId.Kovan:
            return '';
        default:
            return '';
    }
})();



