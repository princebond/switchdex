import { BigNumber } from '@0x/utils';
import { createAction } from 'typesafe-actions';

import { getAllITokens, getToken } from '../../services/bzx';
import { getLogger } from '../../util/logger';
import { getTransactionOptions } from '../../util/transactions';
import { BZXLoadingState, BZXState, iTokenData, NotificationKind, ThunkCreator, Token } from '../../util/types';
import { addNotifications, updateTokenBalances } from '../actions';
import { getEthAccount, getGasPriceInWei } from '../selectors';
import { ATokenData, AaveLoadingState, AaveState } from '../../util/aave/types';
import { getATokenContractWrapper, getLendingPool } from '../../services/aave';


const logger = getLogger('Aave::Actions');

export const initializeAaveData = createAction('aave/init', resolve => {
    return (aaveData: Partial<AaveState>) => resolve(aaveData);
});

export const setAaveLoadingState = createAction('aave/AAVE_LOADING_STATE_set', resolve => {
    return (aaveLoadingState: AaveLoadingState) => resolve(aaveLoadingState);
});

export const setATokenBalance = createAction('aave/ATOKEN_BALANCE_set', resolve => {
    return (token: ATokenData) => resolve(token);
});

export const setATokenBalances = createAction('aave/ATOKEN_BALANCES_set', resolve => {
    return (token: ATokenData[]) => resolve(token);
});

export const initAave: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        dispatch(setAaveLoadingState(AaveLoadingState.Loading));
        try {
        /*    const [iTokens, tokens] = await getAllATokens(ethAccount);
            await dispatch(updateTokenBalances());
            dispatch(
                initializeAaveData({
                    TokensList: tokens,
                    iTokensData: iTokens,
                }),
            );
            dispatch(setAaveLoadingState(AaveLoadingState.Done));*/
        } catch (error) {
            logger.error('There was an error when initializing bzx smartcontracts', error);
            dispatch(setAaveLoadingState(AaveLoadingState.Error));
        }
    };
};

export const fetchAave: ThunkCreator<Promise<any>> = () => {
    return async (dispatch, getState) => {
     /*   const state = getState();
        const ethAccount = getEthAccount(state);
        try {
            const [iTokens, tokens] = await getAllITokens(ethAccount);
            dispatch(
                initializeAaveData({
                    TokensList: tokens,
                    iTokensData: iTokens,
                }),
            );
        } catch (error) {
            logger.error('There was an error when fetching aave smartcontracts', error);
        }*/
    };
};

export const lendingAToken: ThunkCreator<Promise<any>> = (
    token: Token,
    aToken: ATokenData,
    amount: BigNumber,
    isEth: boolean,
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);

        const lendingPoolWrapper = await getLendingPool( {
            from: ethAccount.toLowerCase(),
            gas: '2000000',
        });
        const web3Wrapper = await getWeb3Wrapper();
        let txHash: string;
        if (isEth) {
            txHash = await lendingPoolWrapper.deposit(aToken.token.address, amount, 0).sendTransactionAsync({
                from: ethAccount.toLowerCase(),
                value: amount.toString(),
                gasPrice: getTransactionOptions(gasPrice).gasPrice,
            });
        } else {
            txHash = await lendingPoolWrapper.deposit(aToken.token.address, amount, 0).sendTransactionAsync({
                from: ethAccount.toLowerCase(),
                gasPrice: getTransactionOptions(gasPrice).gasPrice,
            });
        }

        const tx = web3Wrapper.awaitTransactionSuccessAsync(txHash);

        dispatch(
            addNotifications([
                {
                    id: txHash,
                    kind: NotificationKind.LendingComplete,
                    amount,
                    token,
                    tx,
                    timestamp: new Date(),
                },
            ]),
        );
        /*web3Wrapper.awaitTransactionSuccessAsync(tx).then(() => {
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateTokenBalancesOnToggleTokenLock(token, isUnlocked));
        });*/

        return txHash;
    };
};

export const unLendingAToken: ThunkCreator<Promise<any>> = (
    token: Token,
    aToken: ATokenData,
    amount: BigNumber,
    isEth: boolean,
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);
        const aTokenWrapper = await getATokenContractWrapper(aToken.address, {
            from: ethAccount.toLowerCase(),
            gas: '2000000',
        });
        const web3Wrapper = await getWeb3Wrapper();

        const txHash = await aTokenWrapper.redeem(amount).sendTransactionAsync({
            from: ethAccount.toLowerCase(),
            gasPrice: getTransactionOptions(gasPrice).gasPrice,
        });


        const tx = web3Wrapper.awaitTransactionSuccessAsync(txHash);

        dispatch(
            addNotifications([
                {
                    id: txHash,
                    kind: NotificationKind.UnLendingComplete,
                    amount,
                    token,
                    tx,
                    timestamp: new Date(),
                },
            ]),
        );

        /*web3Wrapper.awaitTransactionSuccessAsync(tx).then(() => {
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateTokenBalancesOnToggleTokenLock(token, isUnlocked));
        });*/
        // tslint:disable-next-line: no-floating-promises

        return txHash;
    };
};

export const borrowToken: ThunkCreator<Promise<any>> = (
    token: Token,
    aToken: ATokenData,
    amount: BigNumber,
    interestRateMode: BigNumber,
    isEth: boolean,
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);
        const lendingPoolWrapper = await getLendingPool( {
            from: ethAccount.toLowerCase(),
            gas: '2000000',
        });


        const web3Wrapper = await getWeb3Wrapper();

        const txHash = await lendingPoolWrapper.borrow(aToken.token.address, amount, interestRateMode, 0).sendTransactionAsync({
            from: ethAccount.toLowerCase(),
            gasPrice: getTransactionOptions(gasPrice).gasPrice,
        });


        const tx = web3Wrapper.awaitTransactionSuccessAsync(txHash);

        dispatch(
            addNotifications([
                {
                    id: txHash,
                    kind: NotificationKind.UnLendingComplete,
                    amount,
                    token,
                    tx,
                    timestamp: new Date(),
                },
            ]),
        );

        /*web3Wrapper.awaitTransactionSuccessAsync(tx).then(() => {
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateTokenBalancesOnToggleTokenLock(token, isUnlocked));
        });*/
        // tslint:disable-next-line: no-floating-promises

        return txHash;
    };
};

export const repayToken: ThunkCreator<Promise<any>> = (
    token: Token,
    aToken: ATokenData,
    amount: BigNumber,
    isEth: boolean,
) => {
    return async (dispatch, getState, { getWeb3Wrapper }) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        const gasPrice = getGasPriceInWei(state);
        const lendingPoolWrapper = await getLendingPool( {
            from: ethAccount.toLowerCase(),
            gas: '2000000',
        });


        const web3Wrapper = await getWeb3Wrapper();

        const txHash = await lendingPoolWrapper.repay(aToken.token.address, amount, ethAccount.toLowerCase()).sendTransactionAsync({
            from: ethAccount.toLowerCase(),
            gasPrice: getTransactionOptions(gasPrice).gasPrice,
        });


        const tx = web3Wrapper.awaitTransactionSuccessAsync(txHash);

        dispatch(
            addNotifications([
                {
                    id: txHash,
                    kind: NotificationKind.UnLendingComplete,
                    amount,
                    token,
                    tx,
                    timestamp: new Date(),
                },
            ]),
        );


        /*web3Wrapper.awaitTransactionSuccessAsync(tx).then(() => {
            // tslint:disable-next-line:no-floating-promises
            dispatch(updateTokenBalancesOnToggleTokenLock(token, isUnlocked));
        });*/
        // tslint:disable-next-line: no-floating-promises

        return txHash;
    };
};


/*export const updateITokenBalance: ThunkCreator<Promise<any>> = (iToken: iTokenData) => {
    return async (dispatch, getState) => {
        const state = getState();
        const ethAccount = getEthAccount(state);
        dispatch(setBZXLoadingState(BZXLoadingState.Loading));
        const token = await getToken(ethAccount, iToken);
        if (token) {
            dispatch(setITokenBalance(token));
        }
        dispatch(setBZXLoadingState(BZXLoadingState.Done));
    };
};*/
