import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { combineReducers } from 'redux';
import { ActionType } from 'typesafe-actions';

import * as actions from './actions';
import { blockchain } from './blockchain/reducers';
import { bzx } from './bzx/reducers';
import { collectibles } from './collectibles/reducers';
import { market } from './market/reducers';
import { relayer } from './relayer/reducers';
import { translation } from './translation/reducers';
import { ui } from './ui/reducers';

export type RootAction = ActionType<typeof actions>;

export const createRootReducer = (history: History) =>
    combineReducers<any>({
        router: connectRouter(history),
        blockchain,
        relayer,
        ui,
        market,
        collectibles,
        bzx,
        translation,
    });
