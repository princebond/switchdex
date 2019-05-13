import { createAsyncAction } from 'typesafe-actions';

import { COLLECTIBLE_CONTRACT_ADDRESSES } from '../../common/constants';
import { getAllOrdersERC721 } from '../../services/orders';
import { getKnownTokens } from '../../util/known_tokens';
import { Collectible, ThunkCreator } from '../../util/types';
import { getEthAccount, getNetworkId } from '../selectors';

export const fetchAllCollectiblesAsync = createAsyncAction(
    'collectibles/ALL_COLLECTIBLES_fetch_request',
    'collectibles/ALL_COLLECTIBLES_fetch_success',
    'collectibles/ALL_COLLECTIBLES_fetch_failure',
)<
    void,
    {
        collectibles: Collectible[];
        ethAccount: string;
    },
    Error
>();

export const getAllCollectibles: ThunkCreator = () => {
    return async (dispatch, getState, { getCollectiblesMetadataGateway }) => {
        dispatch(fetchAllCollectiblesAsync.request());
        try {
            const state = getState();
            const networkId = getNetworkId(state);
            const ethAccount = getEthAccount(state);
            if (!networkId) {
                throw new Error(`Network id is not setted`);
            }
            const knownTokens = getKnownTokens(networkId);
            const wethToken = knownTokens.getWethToken();
            const collectiblesMetadataGateway = getCollectiblesMetadataGateway();

            const collectibles = await collectiblesMetadataGateway.fetchAllCollectibles(networkId);
            const orders = await getAllOrdersERC721(COLLECTIBLE_CONTRACT_ADDRESSES[networkId], wethToken.address);

            // TODO Match orders
            console.dir(orders);

            dispatch(fetchAllCollectiblesAsync.success({ collectibles, ethAccount }));
        } catch (err) {
            dispatch(fetchAllCollectiblesAsync.failure(err));
        }
    };
};
