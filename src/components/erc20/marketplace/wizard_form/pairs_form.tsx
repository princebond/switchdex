import React from 'react';
import { Field } from 'react-final-form';

import { Accordion } from '../../../common/accordion';
import { AccordionCollapse } from '../../../common/accordion_collapse';
import { TextInput } from '../../../common/final_form/text_input';

import { FieldContainer, Label, LabelContainer } from './styles';

export const PairsForm = ({ name, label }: { name: string; label: string }) => (
    <>
      <AccordionCollapse title={'Pairs'}>
            <LabelContainer>
                <Label>Base</Label>
            </LabelContainer>
            <FieldContainer>
                <Field name={`${name}.base`} component={TextInput} placeholder={`Base`} />
            </FieldContainer>
            <LabelContainer>
                <Label>Quote</Label>
            </LabelContainer>
            <FieldContainer>
                <Field name={`${name}.quote`} component={TextInput} placeholder={`Quote`} />
            </FieldContainer>
            <FieldContainer>
                <Field name={`${name}.config.pricePrecision`} component={TextInput} placeholder={`Price Precision`} />
            </FieldContainer>
            <FieldContainer>
                <Field name={`${name}.config.basePrecision`} component={TextInput} placeholder={`Base Precision`} />
            </FieldContainer>
            <FieldContainer>
                <Field name={`${name}.config.minAmount`} component={TextInput} placeholder={`Min Precision`} />
            </FieldContainer>
        </AccordionCollapse>
    </>
);