import { DashboardCard } from '@app/components/medical-dashboard/DashboardCard/DashboardCard';
import { media } from '@app/styles/themes/constants';
import styled from 'styled-components';

export const ScreeningsCard = styled(DashboardCard)`
  @media only screen and ${media.xl} {
    .ant-card-body {
      position: relative;
      overflow: hidden;
    }
  }
`;
