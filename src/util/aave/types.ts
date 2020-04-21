import { Token } from "../types";
import { BigNumber } from "@0x/utils";

export interface ATokenData{
    token: Token;
    address: string;
    name: string;
    symbol: string;
    balance: BigNumber;
    isUnlocked: boolean;
    reserve: AReserveData;
    user_reserve: UserReservaData;
}


export interface AReserveData {
    totalLiquidity: BigNumber;
    availableLiquidity: BigNumber;
    totalBorrowsFixed: BigNumber;
    totalBorrowsVariable: BigNumber;
    liquidityRate: BigNumber;
    variableBorrowRate: BigNumber;
    fixedBorrowRate: BigNumber;
    averageFixedBorrowRate: BigNumber;
    utilizationRate: BigNumber;
    liquidityIndexRate: BigNumber;
    variableBorrowIndex: BigNumber;
    aTokenAddress: string;
    lastUpdateTimestamp: number;
}

export interface UserAccountData {
    totalLiquidity: BigNumber;
    totalCollateralETH: BigNumber;
    totalBorrowsETH: BigNumber;
    totalFeesETH: BigNumber;
    liquidityRate: BigNumber;
    availableBorrowsETH: BigNumber;
    currentLiquidationThreshold: BigNumber;
    ltv: BigNumber;
    healthFactor: BigNumber;
}

export interface UserReservaData {
    currentATokenBalance: BigNumber;
    currentUnderlyingBalance: BigNumber;
    currentBorrowBalance: BigNumber;
    principalBorrowBalance: BigNumber;
    borrowRateMode: BigNumber;
    borrowRate: BigNumber;
    liquidityRate: BigNumber;
    originationFee: BigNumber;
    variableBorrowIndex: BigNumber;
    lastUpdateTimestamp: BigNumber;
}

export interface AaveState {
    readonly ATokensData?: ATokenData[];
    readonly userAccountData?: UserAccountData;
    readonly aaveLoadingState: AaveLoadingState;
    readonly aaveGlobalLoadingState: AaveGlobalLoadingState;
}

export enum AaveLoadingState {
    Done = 'Done',
    Error = 'Error',
    Loading = 'Loading',
    NotLoaded = 'NotLoaded'
}

export enum AaveGlobalLoadingState {
    Done = 'Done',
    Error = 'Error',
    Loading = 'Loading',
    NotLoaded = 'NotLoaded'
}