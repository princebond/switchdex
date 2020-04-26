import React, { useState } from 'react';

import styled from "styled-components";
import { themeDimensions } from "../../themes/commons";
import { CardBase } from '../common/card_base';

const Content = styled.div`
display: flex;
flex-direction: column;
padding: 10px;
`;

const TabsContainer = styled.div`
align-items: center;
display: flex;
justify-content: space-between;
`;

const TabButton = styled.div<{ isSelected: boolean; type: DefiType }>`
align-items: center;
background-color: ${props =>
        props.isSelected ? 'transparent' : props.theme.componentsTheme.inactiveTabBackgroundColor};
border-bottom-color: ${props => (props.isSelected ? 'transparent' : props.theme.componentsTheme.cardBorderColor)};
border-bottom-style: solid;
border-bottom-width: 1px;
border-right-color: ${props => (props.isSelected ? props.theme.componentsTheme.cardBorderColor : 'transparent')};
border-right-style: solid;
border-right-width: 1px;
color: ${props =>
        props.isSelected
            ? props.type === DefiType.Deposit
                ? props.theme.componentsTheme.textColorCommon
                : props.theme.componentsTheme.darkGray
            : props.theme.componentsTheme.textLight};
cursor: ${props => (props.isSelected ? 'default' : 'pointer')};
display: flex;
font-weight: 600;
height: 35px;
justify-content: center;
width: 50%;

&:first-child {
    border-top-left-radius: ${themeDimensions.borderRadius};
}

&:last-child {
    border-left-color: ${props => (props.isSelected ? props.theme.componentsTheme.cardBorderColor : 'transparent')};
    border-left-style: solid;
    border-left-width: 1px;
    border-right: none;
    border-top-right-radius: ${themeDimensions.borderRadius};
}
`;
const WalletDefiCommonWrapper = styled(CardBase)`
    margin-bottom: ${themeDimensions.verticalSeparationSm};
`;

enum DefiType {
    Deposit,
    Borrow,
}

export const WalletDefiCommon = () => {

    const [tab, setTab] = useState(DefiType.Deposit)

    return (
        <>
            <WalletDefiCommonWrapper>
                <TabsContainer>
                    <TabButton
                        isSelected={tab === DefiType.Deposit}
                        onClick={() => setTab(DefiType.Deposit)}
                        type={DefiType.Deposit}
                    >
                        Deposit
                    </TabButton>
                    <TabButton
                        isSelected={tab === DefiType.Borrow}
                        onClick={() => setTab(DefiType.Borrow)}
                        type={DefiType.Borrow}
                    >
                        Borrow
                    </TabButton>
                </TabsContainer>
                <Content>
                    {
                        tab === DefiType.Deposit && ( ` this is deposit` )
                    }
                      {
                        tab === DefiType.Borrow && ( ` this is borrow` )
                    }

                </Content>
            </WalletDefiCommonWrapper>
        </>)

}