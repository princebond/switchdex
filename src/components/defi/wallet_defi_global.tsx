
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import {

    getEthAccount,
    getWeb3State,
} from '../../store/selectors';


import { isMobile } from '../../util/screen';

import {
    Web3State,
} from '../../util/types';
import { Card } from '../common/card';

import { LoadingWrapper } from '../common/loading';
import { CustomTD, Table, TH, THead, THLast, TR } from '../common/table';


import { useInterval } from '../common/hooks/set_interval_hook';
import { getLendingPool } from '../../services/aave/aave';
import { UserAccountData } from '../../util/aave/types';
import { useWindowSize } from '../common/hooks/window_size_hook';

const THStyled = styled(TH)`
    &:first-child {
        padding-right: 0;
    }
`;

const TBody = styled.tbody`
    > tr:last-child > td {
        border-bottom: none;
    }
`;

const DefiGlobalCard = styled(Card)`
max-height: 100px;
`

export const WalletDefiGlobalOverral = () => {
    const [userAccountData, setUserAccountData] = useState<UserAccountData>();
    const ethAccount = useSelector(getEthAccount);
    const web3State = useSelector(getWeb3State);
    const windowSize = useWindowSize();
    const fetchAaveGlobal = async () => {
        const lendingPoolContract = await getLendingPool({});
                const userAccountData = await lendingPoolContract.getUserAccountData(ethAccount).callAsync();
                setUserAccountData({
                    totalLiquidity: userAccountData[0],
                    totalCollateralETH: userAccountData[1],
                    totalBorrowsETH: userAccountData[2],
                    totalFeesETH: userAccountData[3],
                    availableBorrowsETH: userAccountData[4],
                    currentLiquidationThreshold: userAccountData[5],
                    ltv: userAccountData[6],
                    healthFactor: userAccountData[7],
                })

    }
    // initial loading
    useEffect(()=>{
        const loadingLendingPoolData = async () => {
            if (ethAccount) {
                await fetchAaveGlobal()
            }
        }
        loadingLendingPoolData().then(()=> console.log('loaded'));

    },[ethAccount])


    // Update global state 
    useInterval(async () => {
        if (ethAccount) {
            await fetchAaveGlobal()
        }
    }, 30 * 1000)
    const isMobileView = isMobile(windowSize.width);
    const totalLiquidity = (userAccountData && `${userAccountData.totalLiquidity.dividedBy('1e18').toFixed(3)} ETH `) || '-';
    const totalCollateralETH = (userAccountData && `${userAccountData.totalCollateralETH.dividedBy('1e18').toFixed(3)} ETH`) || '-';
    const totalBorrowsETH = (userAccountData && `${userAccountData.totalBorrowsETH.dividedBy('1e18').toFixed(3)} ETH`) || '-';
    const availableBorrowsETH = (userAccountData && `${userAccountData.availableBorrowsETH.dividedBy('1e18').toFixed(3)} ETH`) || '-';
    const currentLiquidationThreshold = (userAccountData && `${ userAccountData.currentLiquidationThreshold.dividedBy('1e18').toFixed(3)} ETH`) || '-';
    const ltv = (userAccountData && userAccountData.ltv.dividedBy('1e18').toFixed(3)) || '-';
    let healthFactor = '-'
    // const healthFactor = (userAccountData && userAccountData.healthFactor.toFixed(3)) || '-';;
    if(userAccountData && userAccountData.totalBorrowsETH.gt(0)){
        healthFactor = (userAccountData && userAccountData.healthFactor.toFixed(3));
    }


    const overallRows = () => {
        if (isMobileView) {
            return (
                <tbody key={'overall-row'}>
                    <TR>
                        <TH>Total Liquidity</TH>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>{totalLiquidity}</CustomTD>
                    </TR>
                    <TR>
                        <TH>Total Collateral</TH>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>{totalCollateralETH}</CustomTD>
                    </TR>
                    <TR>
                        <TH>Total Borrows</TH>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>{totalBorrowsETH}</CustomTD>
                    </TR>
                    <TR>
                        <TH>Available For Borrow</TH>
                        <CustomTD styles={{ textAlign: 'center' }}>{availableBorrowsETH}</CustomTD>
                    </TR>
                    <TR>
                        <TH>Liquidation Threshold</TH>
                        <CustomTD styles={{ textAlign: 'center' }}>{currentLiquidationThreshold}</CustomTD>
                    </TR>
                    <TR>
                        <TH>LTV</TH>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>{ltv}</CustomTD>
                    </TR>
                    <TR>
                        <TH styles={{ borderBottom: true, textAlign: 'left' }}> Health Factor</TH>
                        <CustomTD styles={{ borderBottom: true, textAlign: 'right' }}>{healthFactor}</CustomTD>
                    </TR>
                </tbody>
            );
        } else {
            return (
                <TR key={'overall-row'}>
                    <CustomTD >{totalLiquidity}</CustomTD>
                    <CustomTD >{totalCollateralETH}</CustomTD>
                    <CustomTD >{totalBorrowsETH}</CustomTD>
                    <CustomTD >{availableBorrowsETH}</CustomTD>
                    <CustomTD>{currentLiquidationThreshold}</CustomTD>
                    <CustomTD >{ltv}</CustomTD>
                    <CustomTD>{healthFactor}</CustomTD>
                </TR>
            );
        }
    }


    let content: React.ReactNode;
    if (web3State === Web3State.Loading) {
        content = <LoadingWrapper />;
    } else {


        if (isMobileView) {
            content = (
                <>
                    <Table isResponsive={true}>
                        {overallRows()}
                    </Table>
                </>
            );
        } else {
            content = (
                <>
                    <Table isResponsive={true}>
                        <THead>
                            <TR>
                                <THStyled>Total Liquidity</THStyled>
                                <THStyled>Total Collateral</THStyled>
                                <THStyled>Total Borrows</THStyled>
                                <THStyled> Available For Borrow</THStyled>
                                <THStyled >Liquidation Threshold</THStyled>
                                <THStyled >LTV</THStyled>
                                <THLast> Health Factor</THLast>
                            </TR>
                        </THead>
                        <TBody>
                            {overallRows()}
                        </TBody>
                    </Table>

                </>
            );
        }
    }
    return <DefiGlobalCard title="Overall Aave Position">{content}</DefiGlobalCard>;
};