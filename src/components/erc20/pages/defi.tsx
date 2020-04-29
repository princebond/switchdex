import React from 'react';
import styled from 'styled-components';

import { FiatOnRampModalContainer } from '../../account/fiat_modal';
import { FiatChooseModalContainer } from '../../account/fiat_onchoose_modal';
import { WalletLendingBalancesContainer } from '../../account/wallet_lending_balances';
import { CheckWalletStateModalContainer } from '../../common/check_wallet_state_modal_container';
import { ColumnWide } from '../../common/column_wide';
import { Content } from '../common/content_wrapper';
import { WalletDefiGlobalOverral } from '../../defi/wallet_defi_global';
import { WalletDefiCommon } from '../../defi/wallet_defi_common';
import { themeBreakPoints, themeDimensions } from '../../../themes/commons';
import { ColumnNarrow } from '../../common/column_narrow';

const ColumnWideMyWallet = styled(ColumnWide)`
    margin-left: 0;

     &:first-child {
        @media (min-width: ${themeBreakPoints.xl}) {
            margin-right: 0px;
        }
    }

    &:last-child {
        @media (min-width: ${themeBreakPoints.xl}) {
            margin-left: 0px;
        }
    }
`;

const ColumnWideDefi = styled(ColumnWide)`
    margin-left: 0;
    flex: 1;
    flex-grow:10;
     &:first-child {
        @media (min-width: ${themeBreakPoints.xl}) {
            margin-right: 0px;
        }
    }

    &:last-child {
        @media (min-width: ${themeBreakPoints.xl}) {
            margin-left: 0px;
        }
    }
`;

const RowContent = styled(Content)`
     @media (min-width: ${themeBreakPoints.xl}) {
        flex-direction: column;
        height: calc(100% - ${themeDimensions.footerHeight});
    }

`

const LendingPage = () => (
    <>
        <CheckWalletStateModalContainer>
            <RowContent>
                <ColumnWideMyWallet>
                    <WalletDefiGlobalOverral />
               </ColumnWideMyWallet>
                <ColumnWideDefi>
                    <WalletDefiCommon />
                 </ColumnWideDefi>
            </RowContent>
        </CheckWalletStateModalContainer>
        <FiatOnRampModalContainer />
        <FiatChooseModalContainer />
    </>
);

export { LendingPage as default };
