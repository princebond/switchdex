import React, { useState } from 'react';
import { Field, useForm } from 'react-final-form';
import { OnChange } from 'react-final-form-listeners';
import { useDispatch } from 'react-redux';
import Select from 'react-select';
import styled from 'styled-components';

import { setERC20Theme } from '../../../../store/actions';
import { Theme, themeDimensions } from '../../../../themes/commons';
import { getThemeByName } from '../../../../themes/theme_meta_data_utils';
import { AccordionCollapse } from '../../../common/accordion_collapse';
import { ColorButtonInput } from '../../../common/final_form/color_button_input';
import { IconType, Tooltip } from '../../../common/tooltip';

import { FieldContainer, Label, LabelContainer } from './styles';

const StyledComponentsTheme = styled.div`
    padding-left: 20px;
    padding-top: 10px;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

const TooltipStyled = styled(Tooltip)``;

export const ThemeForm = ({
    name,
    isOpen = false,
    selector,
}: {
    name: string;
    isOpen?: boolean;
    selector?: string;
}) => {
    const dispatch = useDispatch();

    const options = [{ value: 'dark', label: 'Dark' }, { value: 'light', label: 'Light' }];
    const [selectedOption, setSelectedOption] = useState(options[0]);
    const form = useForm();

    const onChange = (option: any) => {
        setSelectedOption(option);
        // console.log(value);
        let theme;
        switch (option.value) {
            case 'dark':
                theme = getThemeByName('DARK_THEME');
                dispatch(setERC20Theme(theme));
                form.change('theme', theme);
                break;
            case 'light':
                theme = getThemeByName('LIGHT_THEME');
                dispatch(setERC20Theme(theme));
                form.change('theme', theme);
                break;
            default:
                break;
        }
    };

    return (
        <>
            <AccordionCollapse title={'2-Theme'} setIsOpen={isOpen} className={selector}>
                <LabelContainer>
                    <Label>Pre Defined Themes:</Label>
                    <TooltipStyled
                        description="Choose an initial theme and costumize it. Currently support for Dark and Ligh Themes"
                        iconType={IconType.Fill}
                    />
                </LabelContainer>
                <FieldContainer>
                    <Select value={selectedOption} onChange={onChange} options={options} />
                </FieldContainer>
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
        <Label>Costumize DEX theme colors:</Label>
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
