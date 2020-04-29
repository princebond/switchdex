import { ERC20TokenContract } from '@0x/contract-wrappers';
import { BigNumber } from '@0x/utils';
import { TxData } from '@0x/web3-wrapper';

import { getTokenizedRegistryAddress } from '../../util/bzx/contracts';
import { getKnownTokens } from '../../util/known_tokens';
import { iTokenData, TokenMetadataBZX } from '../../util/types';

import { getContractWrappers } from '../contract_wrappers';
import { getWeb3Wrapper } from '../web3_wrapper';
import { ATokenData, AaveReserveGQLResponse } from '../../util/aave/types';
import { LENDING_POOL_ADDRESS, LENDING_POOL_CORE_ADDRESS } from '../../util/aave/constants';
import ApolloClient from 'apollo-boost';

export const getATokenContractWrapper = async (address: string, partialTxData: Partial<TxData>) => {
    const web3Wrapper = await getWeb3Wrapper();
    const ATokenContract = (await import('../../util/aave/contract_wrappers/atoken')).AtokenContract;
    return new ATokenContract(address, web3Wrapper.getProvider(), partialTxData);
};

export const getLendingPool = async (partialTxData: Partial<TxData>) => {
    const web3Wrapper = await getWeb3Wrapper();
    const LendingPoolContract = (await import('../../util/aave/contract_wrappers/lending_pool')).LendingPoolContract;
    return new LendingPoolContract(LENDING_POOL_ADDRESS.toLowerCase(), web3Wrapper.getProvider(), partialTxData);
};

export const getTokenizedRegistryContractWrapper = async (partialTxData: Partial<TxData>) => {
    const web3Wrapper = await getWeb3Wrapper();
    const TokenizedRegistryContract = (await import('../../util/bzx/contract_wrappers/tokenized_registry')).TokenizedRegistryContract;
    return new TokenizedRegistryContract(getTokenizedRegistryAddress(), web3Wrapper.getProvider(), partialTxData);
};
let client: ApolloClient<any>;
export const getAaveGraphClient = (): ApolloClient<any> => {
    if(!client){
        client = new ApolloClient({  uri: 'https://api.thegraph.com/subgraphs/name/aave/protocol-raw'});
    }
    return client;

} 


export const getAllATokens = async (aaveReservesGQL: AaveReserveGQLResponse[], ethAccount?: string,): Promise<ATokenData[]> => {

    const aTokens: ATokenData[] = [];
    const known_tokens = getKnownTokens();

    for (const tk of aaveReservesGQL) {
        try {
            const contractWrappers = await getContractWrappers();
          
            const token = known_tokens.getTokenByAddress(tk.id);
            const erc20Token = new ERC20TokenContract(token.address, contractWrappers.getProvider());
            let aTokenBalance;
            let isUnlocked;        
            if(ethAccount){
                const tkContract = await getATokenContractWrapper(tk.aToken.id, { from: ethAccount });
                aTokenBalance = await tkContract.balanceOf(ethAccount).callAsync();
                const allowance = await erc20Token.allowance(ethAccount, LENDING_POOL_CORE_ADDRESS).callAsync();
                isUnlocked = allowance.isGreaterThan('10000e18');
            }
            aTokens.push({
                address: tk.id,
                name: tk.name,
                symbol: tk.symbol,
                token,
                isUnlocked,
                balance: aTokenBalance,
                borrowBalance: new BigNumber(0),
                liquidityRate: new BigNumber(tk.liquidityRate),
                variableBorrowRate: new BigNumber(tk.variableBorrowRate),
                stableBorrowRate:  new BigNumber(tk.stableBorrowRate),
                
            });
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error(`There was a problem with Itoken wrapper  ${tk.name}`, e);
        }
    }
    return aTokens;
};


/*export const getAllATokens = async (ethAccount: string): Promise<[ATokenData[]]> => {
    
};

export const getToken = async (ethAccount: string, iToken: iTokenData): Promise<iTokenData | undefined> => {
    
};*/
