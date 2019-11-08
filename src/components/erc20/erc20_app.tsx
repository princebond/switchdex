import React from 'react';
import { Route, Switch } from 'react-router';
import { ThemeProvider } from 'styled-components';

import { ERC20_APP_BASE_PATH } from '../../common/constants';
import { AdBlockDetector } from '../../components/common/adblock_detector';
import { GeneralLayoutContainer } from '../../components/general_layout';
import { getThemeByMarketplace } from '../../themes/theme_meta_data_utils';
import { MARKETPLACES } from '../../util/types';

const toolbar = React.lazy(() => import('./common/toolbar_content'));
const Marketplace = React.lazy(() => import('./pages/marketplace'));
const MyWallet = React.lazy(() => import('./pages/my_wallet'));
const TokensListPage = React.lazy(() => import('./pages/tokens_list'));
const AccountTradingsPage = React.lazy(() => import('./pages/account_trading'));

const Erc20App = () => {
    const themeColor = getThemeByMarketplace(MARKETPLACES.ERC20);
    return (
        <ThemeProvider theme={themeColor}>
            <GeneralLayoutContainer toolbar={toolbar}>
                <AdBlockDetector />
                <Switch>
                    <Route exact={true} path={`${ERC20_APP_BASE_PATH}/`} component={Marketplace} />
                    <Route exact={true} path={`${ERC20_APP_BASE_PATH}/my-wallet`} component={MyWallet} />
                    <Route exact={true} path={`${ERC20_APP_BASE_PATH}/listed-tokens`} component={TokensListPage} />
                    <Route
                        exact={true}
                        path={`${ERC20_APP_BASE_PATH}/trading-competition`}
                        component={AccountTradingsPage}
                    />
                </Switch>
            </GeneralLayoutContainer>
        </ThemeProvider>
    );
};

export {Erc20App as default};
