import { ERC20TokenContract } from '@0x/contract-wrappers';
import { BigNumber } from '@0x/utils';
import { TxData } from '@0x/web3-wrapper';

import { getTokenizedRegistryAddress } from '../util/bzx/contracts';
import { getKnownTokens } from '../util/known_tokens';
import { iTokenData, TokenMetadataBZX } from '../util/types';

import { getContractWrappers } from './contract_wrappers';
import { getWeb3Wrapper } from './web3_wrapper';
import { ATokenData } from '../util/aave/types';
import { LENDING_POOL_ADDRESS } from '../util/aave/constants';

export const getATokenContractWrapper = async (address: string, partialTxData: Partial<TxData>) => {
    const web3Wrapper = await getWeb3Wrapper();
    const ATokenContract = (await import('../util/aave/contract_wrappers/atoken')).AtokenContract;
    return new ATokenContract(address, web3Wrapper.getProvider(), partialTxData);
};

export const getLendingPool = async (partialTxData: Partial<TxData>) => {
    const web3Wrapper = await getWeb3Wrapper();
    const LendingPoolContract = (await import('../util/aave/contract_wrappers/lending_pool')).LendingPoolContract;
    return new LendingPoolContract(LENDING_POOL_ADDRESS.toLowerCase(), web3Wrapper.getProvider(), partialTxData);
};

export const getTokenizedRegistryContractWrapper = async (partialTxData: Partial<TxData>) => {
    const web3Wrapper = await getWeb3Wrapper();
    const TokenizedRegistryContract = (await import('../util/bzx/contract_wrappers/tokenized_registry')).TokenizedRegistryContract;
    return new TokenizedRegistryContract(getTokenizedRegistryAddress(), web3Wrapper.getProvider(), partialTxData);
};

export const getAaveGraphClient = async () => {

} 

/*export const getAllATokens = async (ethAccount: string): Promise<[ATokenData[]]> => {
    
};

export const getToken = async (ethAccount: string, iToken: iTokenData): Promise<iTokenData | undefined> => {
    
};*/
