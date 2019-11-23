import React from 'react';
import { Field } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { setERC20Theme } from '../../../../store/actions';
import { Theme, themeDimensions } from '../../../../themes/commons';
import { AccordionCollapse } from '../../../common/accordion_collapse';
import { ColorButtonInput } from '../../../common/final_form/color_button_input';

import { FieldContainer, Label, LabelContainer } from './styles';

const StyledComponentsTheme = styled.div`
    padding-left: 20px;
    padding-top: 10px;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

export const ThemeForm = ({ name, label }: { name: string; label: string }) => {
    const dispatch = useDispatch();

    return (
        <>
            <AccordionCollapse title={'Theme'}>
                <StyledComponentsTheme>
                    <ComponentsTheme name={`${name}.componentsTheme`} />
                </StyledComponentsTheme>
                <OnChange name={`${name}`}>
                    {(value: Theme, _previous: Theme) => {
                        dispatch(setERC20Theme(value));
                        // do something
                    }}
                </OnChange>
            </AccordionCollapse>
        </>
    );
};

const ComponentsTheme = ({ name }: { name: string }) => (
    <>
        <LabelContainer>
            <Label>Background</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.background`} component={ColorButtonInput} placeholder={`Title`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Card Background</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.cardBackgroundColor`} component={ColorButtonInput} placeholder={`Title`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Top Bar Background</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.topbarBackgroundColor`} component={ColorButtonInput} placeholder={`Title`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Inactive Tab Background</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.inactiveTabBackgroundColor`} component={ColorButtonInput} placeholder={`Title`} />
        </FieldContainer>
    </>
);
