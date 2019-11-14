import React from 'react';
import { Field } from 'react-final-form';

import { Accordion } from '../../../common/accordion';
import { TextInput } from '../../../common/final_form/text_input';

import { FieldContainer, Label, LabelContainer } from './styles';
import { AccordionCollapse } from '../../../common/accordion_collapse';

export const MarketFiltersForm = ({ name, label }: { name: string; label: string }) => (
    <>
      <AccordionCollapse title={'Market Filters'}>
            <LabelContainer>
                <Label>Title</Label>
            </LabelContainer>
            <FieldContainer>
                <Field name={`${name}.title`} component={TextInput} placeholder={`Title`} />
            </FieldContainer>
            <LabelContainer>
                <Label>Icon URL (SVG)</Label>
            </LabelContainer>
            <FieldContainer>
                <Field name={`${name}.icon`} component={TextInput} placeholder={`Icon Url`} />
            </FieldContainer>
        </AccordionCollapse>
    </>
);