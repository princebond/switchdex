import React from 'react';
import styled from 'styled-components';

import { ColumnWide } from '../../common/column_wide';
import { Content } from '../common/content_wrapper';
import { UserWizardFormWithTheme } from '../marketplace/user_wizard_form';

const ColumnWideMyWallet = styled(ColumnWide)`
    margin-left: 0;

    &:last-child {
        margin-left: 0;
    }
`;

const UserWizardPage = () => (
    <Content>
        <ColumnWideMyWallet>
            <UserWizardFormWithTheme />
        </ColumnWideMyWallet>
    </Content>
);

export { UserWizardPage as default };
