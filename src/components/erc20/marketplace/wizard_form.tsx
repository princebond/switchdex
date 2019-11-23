import arrayMutators from 'final-form-arrays';
import React from 'react';
import { Form } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import styled, { withTheme } from 'styled-components';

import { ConfigTemplate } from '../../../common/config';
import { startDexConfigSteps } from '../../../store/actions';
import { getConfigData, getERC20Theme } from '../../../store/selectors';
import { Theme, themeDimensions } from '../../../themes/commons';
import { ButtonVariant, ConfigFile } from '../../../util/types';
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

const Content = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 20px ${themeDimensions.horizontalPadding};
`;

const ButtonsContainer = styled.div`
    align-items: flex-start;
    display: flex;
    margin: 10px;
`;
const ButtonContainer = styled.div`
    padding: 10px;
`;

const PreStyled = styled.pre`
    color: ${props => props.theme.componentsTheme.textColorCommon};
`;

const WizardForm = (_props: Props) => {
    const configTemplate = ConfigTemplate.getConfig();
    const dispatch = useDispatch();
    const themeColor = useSelector(getERC20Theme);
    const configData = useSelector(getConfigData);
    let config: ConfigFile;
    configData ? (config = configData.config) : (config = configTemplate);
    config.theme = themeColor;
    config.tokens.forEach(t => {
        if (!t.mainnetAddress) {
            // @ts-ignore
            t.mainnetAddress = t.addresses['1'];
        }
    });

    const onSubmit = (values: any) => {
        // @TODO remove this workaround
        values.tokens.forEach((t: any) => {
            t.addresses = {};
            t.addresses['1'] = t.mainnetAddress;
        });
        dispatch(startDexConfigSteps(values));
    };

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
                        mutators: { unshift },
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
                        <TokensForm unshift={unshift} />
                        <PairsForm />
                        <MarketFiltersForm />
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
