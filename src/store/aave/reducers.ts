import { getType } from 'typesafe-actions';

import * as actions from '../actions';
import { RootAction } from '../reducers';
import { AaveState, AaveLoadingState, AaveGlobalLoadingState, Protocol } from '../../util/aave/types';

const initialAaveState: AaveState = {
     protocol: Protocol.Aave,
     aTokensData: [],
     aaveReservesGQLResponse: [],
     aaveLoadingState: AaveLoadingState.NotLoaded,
     aaveGlobalLoadingState: AaveGlobalLoadingState.NotLoaded,
};

export function aave(state: AaveState = initialAaveState, action: RootAction): AaveState {
    switch (action.type) {
        case getType(actions.initializeAaveData):
            return {
                ...state,
                ...action.payload,
            };
        case getType(actions.setATokenBalances):
            return { ...state, aTokensData: action.payload };
        case getType(actions.setAaveLoadingState):
            return { ...state, aaveLoadingState: action.payload };
        case getType(actions.setAaveReservesGQLResponse):
            return { ...state, aaveReservesGQLResponse: action.payload };
        case getType(actions.setATokenBalance):
            const aToken = action.payload;
            const aTokensData = state.aTokensData;
            const index = aTokensData.findIndex(it => it.address === aToken.address);
            aTokensData[index] = aToken;
            return { ...state, aTokensData };
        default:
            return state;
    }
}