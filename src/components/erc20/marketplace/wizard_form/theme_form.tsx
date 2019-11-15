import React from 'react';
import { Collapse } from 'react-collapse';
import { Field } from 'react-final-form';

import { Accordion } from '../../../common/accordion';
import { ColorInput } from '../../../common/final_form/color_input';
import { TextInput } from '../../../common/final_form/text_input';

import { FieldContainer, Label, LabelContainer } from './styles';
import { ColorButtonInput } from '../../../common/final_form/color_button_input';
import { AccordionCollapse } from '../../../common/accordion_collapse';

export const ThemeForm = ({ name, label }: { name: string; label: string }) => (
    <>
        <AccordionCollapse title={'Theme'}>
            <LabelContainer>
                <Label>Background</Label>
            </LabelContainer>
            <FieldContainer>
                <Field name={`${name}.componentsTheme.background`} component={ColorButtonInput} placeholder={`Title`} />
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
