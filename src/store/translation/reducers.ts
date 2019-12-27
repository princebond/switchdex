import { getType } from 'typesafe-actions';
import { Language } from '../../util/types';
import { RootAction } from '../reducers';
import * as actions from './actions';

const initialLanguageState: Language = {
    // TODO: In the future when the app starts it should pick the values from the local storge, in case there isn't anything pick en (English by default)
    language: 'en',
};

export const translation = (
    state = {
        ...initialLanguageState,
    },
    action: any,
) => {
    switch (action.type) {
        case 'translation/SET_LANGUAGE':
            return { ...state, language: action.language };
        default:
            return state;
    }
};
