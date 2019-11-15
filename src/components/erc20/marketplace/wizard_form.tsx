import arrayMutators from 'final-form-arrays';
import React from 'react';
import { Form } from 'react-final-form';
import styled, { withTheme } from 'styled-components';

import { Config } from '../../../common/config';
import { Theme, themeDimensions } from '../../../themes/commons';
import { getThemeByMarketplace } from '../../../themes/theme_meta_data_utils';
import { ButtonVariant, MARKETPLACES } from '../../../util/types';
import { Button } from '../../common/button';
import { Card } from '../../common/card';

import { GeneralWizardForm } from './wizard_form/general_form';
import { MarketFiltersForm } from './wizard_form/marketFilters_form';
import { PairsForm } from './wizard_form/pairs_form';
import { ThemeForm } from './wizard_form/theme_form';
import { TokensForm } from './wizard_form/tokens_form';

interface OwnProps {
    theme: Theme;
}

type Props = OwnProps;

const onSubmit = async (values: any) => {
    window.alert(JSON.stringify(values, undefined, 2));
};

const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px ${themeDimensions.horizontalPadding};
`;

const LabelContainer = styled.div`
    align-items: flex-start;
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
`;
const ButtonsContainer = styled.div`
    align-items: flex-start;
    display: flex;
    margin: 10px;
`;
const ButtonContainer = styled.div`
    padding: 10px;
`;

const Label = styled.label<{ color?: string }>`
    color: ${props => props.color || props.theme.componentsTheme.textColorCommon};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    margin: 0;
`;
const FieldContainer = styled.div`
    height: ${themeDimensions.fieldHeight};
    margin-bottom: 10px;
    position: relative;
`;

const PreStyled = styled.pre`
    color: ${props => props.theme.componentsTheme.textColorCommon};
`;

const WizardForm = (props: Props) => {
    const config = Config.getConfig();
    const themeColor = getThemeByMarketplace(MARKETPLACES.ERC20);
    config.theme = themeColor;
    config.tokens.forEach(t => {
        // @ts-ignore
        t.contractAddress = t.addresses['1'];
    })

    const content = (
        <Content>
            <Form
                onSubmit={onSubmit}
                initialValues={config}
                mutators={{
                    ...arrayMutators,
                }}
                // tslint:disable-next-line: jsx-no-lambda boolean-naming
                render={({
                    handleSubmit,
                    form: {
                        mutators: { push, pop },
                    }, // injected from final-form-arrays above
                    // tslint:disable-next-line: boolean-naming
                    pristine,
                    form,
                    // tslint:disable-next-line: boolean-naming
                    submitting,
                    values,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <GeneralWizardForm name="general" label="test" />
                        <ThemeForm name="theme" label="test" />
                        <TokensForm push={push} pop={pop} />
                        <PairsForm name="pairs" label="test" />
                        <MarketFiltersForm name="marketFilters" label="test" />
                        <ButtonsContainer>
                            <ButtonContainer>
                                <Button
                                    onClick={form.submit}
                                    disabled={submitting || pristine}
                                    variant={ButtonVariant.Buy}
                                >
                                    Submit
                                </Button>
                            </ButtonContainer>
                            <ButtonContainer>
                                <Button
                                    onClick={form.reset}
                                    disabled={submitting || pristine}
                                    variant={ButtonVariant.Sell}
                                >
                                    Reset
                                </Button>
                            </ButtonContainer>
                        </ButtonsContainer>
                        <PreStyled>{JSON.stringify(values, undefined, 2)}</PreStyled>
                    </form>
                )}
            />
        </Content>
    );

    return <Card title="DEX Wizard">{content}</Card>;
};

const WizardFormWithTheme = withTheme(WizardForm);

export { WizardForm, WizardFormWithTheme };
