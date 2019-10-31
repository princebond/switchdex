import { NETWORK_ID } from '../../common/constants';
import { Network } from '../types';

const TOKENIZED_REGISTRY_ADDRESS: { [key: number]: string } = {
    [Network.Mainnet]: '0x100157a893503B3b27112AB602f8d80e6d0DF9a8',
    [Network.Ropsten]: '0xd03eea21041a19672e451bcbb413ce8be72d0381',
    [Network.Kovan]: '0xF1C87dD61BF8a4e21978487e2705D52AA687F97E',
};

export const getTokenizedRegistryAddress = (): string => {
    return `${TOKENIZED_REGISTRY_ADDRESS[NETWORK_ID].toLowerCase()}`;
};
