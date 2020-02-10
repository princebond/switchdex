import React from 'react';
import styled, { withTheme } from 'styled-components';

import { getKnownTokens } from '../../../util/known_tokens';
import { getEtherscanLinkForToken } from '../../../util/tokens';
import { Card } from '../../common/card';
import { TokenIcon } from '../../common/icons/token_icon';
import { VeriSafeStickerIcon } from '../../common/icons/verisafe_sticker';
import { CustomTD, Table, TH, THead, THLast, TR } from '../../common/table';
import { IconType, Tooltip } from '../../common/tooltip';

const THStyled = styled(TH)`
    &:first-child {
        padding-right: 0;
    }
`;

const TokenTD = styled(CustomTD)`
    padding-bottom: 10px;
    padding-right: 0;
    padding-top: 10px;
    width: 40px;
`;

const TokenIconStyled = styled(TokenIcon)`
    margin: 0 auto 0 0;
`;

const CustomTDTokenName = styled(CustomTD)`
    white-space: nowrap;
`;

const TooltipStyled = styled(Tooltip)`
    flex-wrap: wrap;
    .reactTooltip {
        max-width: 650px;
    }
`;

const TokenEtherscanLink = styled.a`
    align-items: center;
    color: ${props => props.theme.componentsTheme.myWalletLinkColor};
    display: flex;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const WebsiteLink = styled.a`
    align-items: center;
    color: ${props => props.theme.componentsTheme.myWalletLinkColor};
    display: flex;
    font-size: 16px;
    font-weight: 500;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

const TokenName = styled.span`
    font-weight: 700;
    margin-right: 10px;
`;

const TBody = styled.tbody`
    > tr:last-child > td {
        border-bottom: none;
    }
`;

const LabelWrapper = styled.span`
    align-items: center;
    display: flex;
    flex-shrink: 0;
    margin-right: 15px;
`;

export const TokensListing = () => {
        let content: React.ReactNode;
        content = `
        Project listings on Veridex is at a promotional cost of 1 ETH without negotiation sending it to this address: 0x5265bde27f57e738be6c1f6ab3544e82cdc92a8f , if you wanna your project being officially listed
        contact @jcampos8 on telegram with the transaction hash. We include an announcement in our Twitter and Telegram, and also we could promote an AMA to showcase your project.

        If you don't wanna spent on listings and don't mind the warning on the trade interface you could directly add your token using on directly the contract address as follows

        Trade URL: 

        Market Trade URL

        Easy Buy URL

        Buy with Trust 
        Buy with Coinbase Wallet
        Buy with Metamask Mobile


        IEO Listings

        IEO listings is at a promotional cost of 1 ETH without negotiation sending it to this address: 0x5265bde27f57e738be6c1f6ab3544e82cdc92a8f, if you wanna your project being officially listed
        contact @jcampos8 on telegram with the transaction hash. We include an announcement in our Twitter and Telegram, and also we could promote an AMA in our official telegram to showcase your project.
       
        If you don't wanna invest one 1 ETH and get your IEO running, the UI also support insert token contract directly

        1- Place orders at this dashboard with your maker address: 

        2 - You need to join as market maker clicking on the green button present on the dashboard

        After you place orders, your users can get your token directly using the following links:
        Buy with Webbrowser
        Buy with Trust 
        Buy with Coinbase Wallet
        Buy with Metamask Mobile
        
        `

        
        return <Card title="Token Listings and IEO">{content}</Card>;
}


