import React from 'react';
import { connect } from 'react-redux';

import { LocalStorage } from '../../services/local_storage';
import { goToHome, initWallet, setWallet, setWeb3State } from '../../store/actions';
import { getWeb3State } from '../../store/selectors';
import { ModalDisplay, StoreState, Wallet, Web3State } from '../../util/types';

import { MetamaskErrorModal } from './metamask_error_modal';
import { WalletChooseModal } from './wallet_choose_modal';

interface State {
    shouldOpenModal: boolean;
    modalToDisplay: ModalDisplay | null;
}

interface StateProps {
    web3State: Web3State;
}

interface DispatchProps {
    onGoToHome: () => any;
    onConnectWallet: () => any;
    onCloseModalConnecting: () => any;
    onChooseWallet: (wallet: Wallet) => any;
}

interface OwnProps {
    children?: React.ReactNode;
}

type Props = StateProps & DispatchProps & OwnProps;

const localStorage = new LocalStorage(window.localStorage);
class CheckWalletStateModal extends React.Component<Props, State> {
    public state = {
        shouldOpenModal: true,
        modalToDisplay: null,
    };

    public componentDidMount = () => {
        this._updateState();
    };

    public componentDidUpdate = (prevProps: Readonly<Props>) => {
        const { web3State } = this.props;
        if (prevProps.web3State !== web3State) {
            this._updateState();
        }
    };

    public render = () => {
        const { shouldOpenModal, modalToDisplay } = this.state;
        const { children } = this.props;
        return shouldOpenModal && modalToDisplay ? (
            <WalletChooseModal
                isOpen={shouldOpenModal}
                closeModal={this._closeModal}
                chooseWallet={this._chooseWallet}
            />
        ) : (
            children || null
        );
    };

    private readonly _closeModal = () => {
        this.setState({
            shouldOpenModal: false,
        });
        const { web3State } = this.props;
        if (web3State === Web3State.Connecting) {
            this.props.onCloseModalConnecting();
            this._updateState();
        } else {
            this.props.onGoToHome();
        }
    };

    private readonly _connectWallet = () => {
        this.props.onConnectWallet();
        // localStorage.saveWalletConnected(true);
    };

    private readonly _chooseWallet = (wallet: Wallet) => {
        this.props.onChooseWallet(wallet);
    };

    private readonly _updateState = () => {
        const { web3State } = this.props;
        if (web3State === Web3State.Locked) {
            this.setState({ shouldOpenModal: true, modalToDisplay: ModalDisplay.EnablePermissions });
        } else if (web3State === Web3State.NotInstalled) {
            this.setState({ shouldOpenModal: true, modalToDisplay: ModalDisplay.InstallMetamask });
        } else if (web3State === Web3State.Connecting) {
            this.setState({ shouldOpenModal: true, modalToDisplay: ModalDisplay.ConnectWallet });
        } else {
            this.setState({ shouldOpenModal: false });
        }
    };
}
const mapStateToProps = (state: StoreState): StateProps => {
    return {
        web3State: getWeb3State(state),
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        onGoToHome: () => dispatch(goToHome()),
        onConnectWallet: () => dispatch(initWallet()),
        onCloseModalConnecting: () => dispatch(setWeb3State(Web3State.Connect)),
        onChooseWallet: (wallet: Wallet) => dispatch(initWallet(wallet)),
    };
};

const CheckWalletStateModalContainer = connect(
    mapStateToProps,
    mapDispatchToProps,
)(CheckWalletStateModal);

export { CheckWalletStateModal, CheckWalletStateModalContainer };
