import React from 'react';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays'

import { Accordion } from '../../../common/accordion';
import { TextInput } from '../../../common/final_form/text_input';

import { FieldContainer, Label, LabelContainer } from './styles';
import styled from 'styled-components';
import { themeDimensions } from '../../../../themes/commons';

const LabelToken = styled.label`
      color: ${props => props.theme.componentsTheme.textColorCommon};
`

const StyledToken = styled.div`
 padding-left:20px;
 padding-top:10px;
 border-radius: ${themeDimensions.borderRadius};
 border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`

export const TokensForm = () => (
    <>
      <Accordion title={'Tokens'}>
            <FieldArray name="tokens">
            {({ fields }) =>
                fields.map((name, index) => (
                  <StyledToken key={name}>
                    <LabelToken>Token {index + 1}</LabelToken>
                    <span
                      onClick={() => fields.remove(index)}
                      style={{ cursor: 'pointer' }}
                    >
                      ❌
                    </span>
                    <TokenForm name={name} label={'test'}/>
                   
                  </StyledToken>
                ))
              }
          </FieldArray>
        </Accordion>
    </>
);




const TokenForm = ({ name, label }: { name: string; label: string }) => (
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
