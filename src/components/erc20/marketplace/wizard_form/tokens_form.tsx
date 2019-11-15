import React, { useState } from 'react';
import { Field } from 'react-final-form-html5-validation';
import { FieldArray, useFieldArray } from 'react-final-form-arrays';
import styled from 'styled-components';

import { themeDimensions } from '../../../../themes/commons';
import { ButtonVariant } from '../../../../util/types';
import { AccordionCollapse } from '../../../common/accordion_collapse';
import { Button } from '../../../common/button';
import { TextInput } from '../../../common/final_form/text_input';

import { FieldContainer, Label, LabelContainer } from './styles';

const LabelToken = styled.label`
    color: ${props => props.theme.componentsTheme.textColorCommon};
`;

const ButtonsContainer = styled.div`
    align-items: flex-start;
    display: flex;
    margin: 10px;
`;
const ButtonContainer = styled.div`
    padding: 10px;
`;

const StyledToken = styled.div`
    padding-left: 20px;
    padding-top: 10px;
    border-radius: ${themeDimensions.borderRadius};
    border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

const StyledFieldContainer = styled(FieldContainer)`
    display: flex;
`;

export const TokensForm = (props: any) => {
    const onPush = (e: any) => {
        e.preventDefault();
        props.push('tokens', undefined);
    };

    return (
        <>
            <AccordionCollapse title={'Tokens'}>
                <ButtonsContainer>
                    <ButtonContainer>
                        <Button onClick={onPush} variant={ButtonVariant.Buy}>
                            Add
                        </Button>
                    </ButtonContainer>
                </ButtonsContainer>
                <FieldArray name="tokens">
                    {({ fields }) =>
                        fields.map((name, index) => (
                            <StyledToken key={name}>
                                <TokenForm name={name} index={index} />
                            </StyledToken>
                        ))
                    }
                </FieldArray>
            </AccordionCollapse>
        </>
    );
};

const TokenForm = ({ name, index }: { name: string; index: number }) => {
    const [isEdit, setIsEdit] = useState(false);
    const fieldArray = useFieldArray('tokens');
    const { fields } = fieldArray;

    if (isEdit) {
        return (
            <>
                <LabelContainer>
                    <Label>Symbol</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.symbol`} component={TextInput} placeholder={`Title`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Name</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.name`} component={TextInput} placeholder={`Icon Url`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Primary Color</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.primaryColor`} component={TextInput} placeholder={`Icon Url`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Icon</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.icon`} component={TextInput} placeholder={`Icon Url`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Decimals</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.decimals`} component={TextInput} placeholder={`Icon Url`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Contract Address</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.adresses."1"`} component={TextInput} placeholder={`Address`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Display Decimals</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.displayDecimals`} component={TextInput} placeholder={`Icon Url`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Website</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.website`} component={TextInput} placeholder={`Website`} />
                </FieldContainer>
                <LabelContainer>
                    <Label>Coingecko Id</Label>
                </LabelContainer>
                <FieldContainer>
                    <Field name={`${name}.c_id`} component={TextInput} placeholder={`Coingecko id`} />
                </FieldContainer>
            </>
        );
    } else {
        const removeField = () => {
            fields.remove(index);
        };
        const onSetIsEdit = () => {
            setIsEdit(true);
        };

        return (
            <StyledFieldContainer>
                <Field name={`${name}.name`}>
                    {(props: any) => (
                        <LabelContainer>
                            <Label>{props.input.value || 'Insert Name'}</Label>
                        </LabelContainer>
                    )}
                </Field>
                <div>
                    <Label onClick={removeField} style={{ cursor: 'pointer' }}>
                        ❌
                    </Label>
                    <Label onClick={onSetIsEdit} style={{ cursor: 'pointer' }}>
                        Edit
                    </Label>
                </div>
            </StyledFieldContainer>
        );
    }
};
