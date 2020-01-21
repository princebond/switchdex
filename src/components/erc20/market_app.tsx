import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { ThemeProvider } from 'styled-components';

import { ERC20_APP_BASE_PATH, MARKET_APP_BASE_PATH } from '../../common/constants';
import { AdBlockDetector } from '../common/adblock_detector';
import { GeneralLayoutContainer } from '../general_layout';
import { getERC20Theme } from '../../store/selectors';
import { PageLoading } from '../common/page_loading';

import ToolbarContentContainer from './common/toolbar_content';

const toolbar = <ToolbarContentContainer />;


const MarketTrade = lazy(() => import('./pages/market_trade'));


const Erc20App = () => {
    const themeColor = useSelector(getERC20Theme);
    return (
        <ThemeProvider theme={themeColor}>
            <GeneralLayoutContainer toolbar={toolbar}>
                <AdBlockDetector />
                <Switch>
                    <Suspense fallback={<PageLoading />}>
                        <Route exact={true} path={`${MARKET_APP_BASE_PATH}/`} component={Marketplace} />
                    </Suspense>
                </Switch>
            </GeneralLayoutContainer>
        </ThemeProvider>
    );
};

export { Erc20App as default };
