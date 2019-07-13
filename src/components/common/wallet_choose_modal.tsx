import React, { HTMLAttributes } from 'react';
import Modal from 'react-modal';
import styled, { withTheme } from 'styled-components';

import { ReactComponent as InstallMetamaskSvg } from '../../assets/icons/install_metamask.svg';
import { METAMASK_CHROME_EXTENSION_DOWNLOAD_URL } from '../../common/constants';
import { Config } from '../../common/config';
import { isMetamaskInstalled } from '../../services/web3_wrapper';
import { Theme } from '../../themes/commons';
import { errorsWallet } from '../../util/error_messages';
import { ButtonVariant, ModalDisplay, Wallet } from '../../util/types';

import { Button } from './button';
import { CloseModalButton } from './icons/close_modal_button';

interface OwnProps {
    theme: Theme;
}

interface Props extends HTMLAttributes<HTMLDivElement>, OwnProps {
    isOpen: boolean;
    closeModal: any;
    chooseWallet: (wallet: Wallet) => any;
}

const ModalContent = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow: auto;
    width: 310px;
`;

const ModalTitle = styled.h1`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 20px;
    font-weight: 600;
    line-height: 1.2;
    margin: 0 0 25px;
    text-align: center;
`;

const ModalText = styled.p`
    color: ${props => props.theme.componentsTheme.textColorCommon};
    font-size: 16px;
    font-weight: normal;
    line-height: 1.5;
    margin: 0 0 25px;
    padding: 0;
    text-align: center;

    &:last-child {
        margin-bottom: 0;
    }
`;

const ModalTextLink = styled.a`
    color: ${props => props.theme.componentsTheme.textLight};
    cursor: pointer;
    font-size: 13px;
    text-decoration: underline;
`;

const IconContainer = styled.div`
    align-items: center;
    display: flex;
    height: 62px;
    justify-content: center;
    margin-bottom: 30px;

    svg {
        height: 52px;
        width: 52px;
    }
`;

const ButtonStyled = styled(Button)`
    width: 100%;
    margin: 10px;
`;

const LinkButton = styled.a`
    color: ${props => props.theme.componentsTheme.buttonTextColor};
    text-decoration: none;
`;

const WalletChooseModalContainer: React.FC<Props> = props => {
    const { isOpen, closeModal, chooseWallet, theme } = props;

    const isMMInstalled = () => isMetamaskInstalled();
    // const wallets = Config.getConfig().wallets;
    const getMetamask = () => {
        window.open(METAMASK_CHROME_EXTENSION_DOWNLOAD_URL, '_blank');
    };

    const choosePortis = () => {
        chooseWallet(Wallet.Portis);
    };
    const chooseMetamask = () => {
        chooseWallet(Wallet.Metamask);
    };
    const chooseWalletTorus = () => {
        chooseWallet(Wallet.Torus);
    };
    const chooseFortmatic = () => {
        chooseWallet(Wallet.Fortmatic);
    };

    const content = (
        <>
            <ModalTitle>Choose Wallet:</ModalTitle>
            <ButtonStyled onClick={choosePortis} variant={ButtonVariant.Portis}>
                <LinkButton>{'Portis'}</LinkButton>
            </ButtonStyled>
            <ButtonStyled onClick={chooseFortmatic} variant={ButtonVariant.Fortmatic}>
                <LinkButton>{'Fortmatic'}</LinkButton>
            </ButtonStyled>
            {/*<ButtonStyled  onClick={chooseWalletTorus} variant={ButtonVariant.Torus}>
                <LinkButton>{'Torus'}</LinkButton>
    </ButtonStyled>*/}
            {/*isMMInstalled() ? <ModalTextLink>Torus not work with Metamask installed! </ModalTextLink> : ''*/}
            <ButtonStyled disabled={!isMMInstalled()} onClick={chooseMetamask} variant={ButtonVariant.Tertiary}>
                <LinkButton>{'Metamask'}</LinkButton>
            </ButtonStyled>
            {isMMInstalled() ? (
                ''
            ) : (
                <ModalTextLink onClick={getMetamask}>Metamask not installed! Get Metamask</ModalTextLink>
            )}
        </>
    );

    return (
        <Modal isOpen={isOpen} style={theme.modalTheme}>
            <CloseModalButton onClick={closeModal} />
            <ModalContent>{content}</ModalContent>
        </Modal>
    );
};

const WalletChooseModal = withTheme(WalletChooseModalContainer);

export { WalletChooseModal };
