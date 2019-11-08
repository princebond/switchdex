import React from 'react';
import { Route, Switch } from 'react-router';
import { ThemeProvider } from 'styled-components';

import { MARGIN_APP_BASE_PATH } from '../../common/constants';
import { getThemeByMarketplace } from '../../themes/theme_meta_data_utils';
import { MARKETPLACES } from '../../util/types';
import { AdBlockDetector } from '../common/adblock_detector';
import { GeneralLayoutContainer } from '../general_layout';



const toolbar = React.lazy(() => import('./common/toolbar_content'));
const LendingPage = React.lazy(() => import('./pages/lending'));

export const MarginApp = () => {
    const themeColor = getThemeByMarketplace(MARKETPLACES.ERC20);
    return (
        <ThemeProvider theme={themeColor}>
            <GeneralLayoutContainer toolbar={toolbar}>
                <AdBlockDetector />
                <Switch>
                    <Route exact={true} path={`${MARGIN_APP_BASE_PATH}/lend`} component={LendingPage} />
                </Switch>
            </GeneralLayoutContainer>
        </ThemeProvider>
    );
};


export {MarginApp as default};