import React from 'react';
import styled from 'styled-components';

import { ColumnWide } from '../../common/column_wide';
import { Content } from '../common/content_wrapper';
import { WizardFormWithTheme } from '../marketplace/wizard_form';
import { MarketTradeContainer } from '../marketplace/market_trade';
import { CheckWalletStateModalContainer } from '../../common/check_wallet_state_modal_container';

const ColumnWideMyWallet = styled(ColumnWide)`
    margin-left: 0;
    max-width: 60%;
    &:last-child {
        margin-left: 0;
    }
`;

const CenteredContent = styled(Content)`
  align-items: center;
  justify-content: center;
`

const MarketTradePage = () => (
    <CenteredContent>
        <ColumnWideMyWallet>
            <MarketTradeContainer />
        </ColumnWideMyWallet>
        <CheckWalletStateModalContainer />
    </CenteredContent>
);

export { MarketTradePage as default };
