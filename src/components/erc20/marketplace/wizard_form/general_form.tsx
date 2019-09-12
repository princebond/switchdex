import React from 'react';
import { FieldContainer, LabelContainer, Label } from './styles';

import { Field } from 'react-final-form';

import { TextInput } from '../../../common/form/TextInput';

const GeneralWizardForm = ({ name, label }) => (
    <React.Fragment>
        <LabelContainer>
            <Label>Title</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.title`} component={TextInput} placeholder={`title`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Icon URL (SVG)</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.icon`} component={TextInput} placeholder={`Icon Url`} />
        </FieldContainer>
    </React.Fragment>
);
