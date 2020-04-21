import { getType } from 'typesafe-actions';

import { BZXLoadingState, BZXState } from '../../util/types';
import * as actions from '../actions';
import { RootAction } from '../reducers';
import { AaveState, AaveLoadingState, AaveGlobalLoadingState } from '../../util/aave/types';

const initialAaveState: AaveState = {
     ATokensData: [],
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
        case getType(actions.setITokenBalances):
            return { ...state, iTokensData: action.payload };
        case getType(actions.setBZXLoadingState):
            return { ...state, bzxLoadingState: action.payload };
        case getType(actions.setITokenBalance):
            const iToken = action.payload;
            const iTokensData = state.iTokensData;
            const index = iTokensData.findIndex(it => it.address === iToken.address);
            iTokensData[index] = iToken;
            return { ...state, iTokensData };
        default:
            return state;
    }
}
