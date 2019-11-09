import React from 'react';
import { Field } from 'react-final-form';
import styled from 'styled-components';

import { themeDimensions } from '../../../../themes/commons';
import { Accordion } from '../../../common/accordion';
import { TextInput } from '../../../common/final_form/text_input';

import { FieldContainer, Label, LabelContainer } from './styles';

const Title = styled.h1`
      color: ${props => props.theme.componentsTheme.textColorCommon};
`

const SocialForm = ({ name}: { name: string }) => (
    <>
        <Title>Social URL's </Title>
        <LabelContainer>
            <Label>Telegram Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.telegram_url`} component={TextInput} placeholder={`Telegram Url`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Twitter Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.twitter_url`} component={TextInput} placeholder={`Twitter Url`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Facebook Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.facebook_url`} component={TextInput} placeholder={`Facebook Url`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Discord Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.discord_url`} component={TextInput} placeholder={`Discord Url`} />
        </FieldContainer>
        <LabelContainer>
            <Label>Reddit Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.reddit_url`} component={TextInput} placeholder={`Reddit Url`} />
        </FieldContainer>
        <LabelContainer>
            <Label>BitcoinTalk Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.bitcointalk_url`} component={TextInput} placeholder={`BitcoinTalk Url`} />
        </FieldContainer>
        <LabelContainer>
            <Label>State of Dapps Url</Label>
        </LabelContainer>
        <FieldContainer>
            <Field name={`${name}.statedapps_url`} component={TextInput} placeholder={`State of Dapps Url`} />
        </FieldContainer>
    </>
)  

const StyledSocialForm = styled.div`
 padding-left:20px;
 border-radius: ${themeDimensions.borderRadius};
 border: 1px solid ${props => props.theme.componentsTheme.cardBorderColor};
`;

export const GeneralWizardForm = ({ name, label }: { name: string; label: string }) => (
    <>
      <Accordion title={'General'}>
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
             <StyledSocialForm><SocialForm  name={`${name}.social`}/> </StyledSocialForm>
        </Accordion>
    </>
);
