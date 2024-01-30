import React, { useEffect, useMemo, useState } from 'react';
import { useResponsive } from 'hooks/useResponsive';
import { StatisticsCard } from './statisticsCard/StatisticsCard/StatisticsCard';
import { getStatistics, Statistic } from 'api/statistics.api';
import { statistics as configStatistics } from 'constants/config/statistics';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { TseWrapper } from '@app/components/tse-dashboard/TseWrapper';

export const TseStatisticsCards: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <BaseCol xl={24} lg={24} md={24}>
      <TseWrapper>
        <LiveboardEmbed
          liveboardId="1d8000d8-6225-4202-b56c-786fd73f95ad"
          visibleVizs={['c1c4a542-e7f1-47af-8218-cdfe2bf45bda', '48830202-e9e7-4995-9552-bc3666958621']}
          activeTabId="c82cdade-51f8-492e-93ab-9181155bd9aa"
          className="tse-viz-four"
          hideLiveboardHeader={true}
          customizations={{
            style: {
              customCSS: {
                variables: { '--ts-var-viz-background': theme === 'dark' ? '#000000' : '#ffffff' },
                rules_UNSTABLE: {
                  'body > app-controller > blink-app-page > div > div > div > bk-powered-footer': {
                    display: 'none',
                  },
                },
              },
            },
          }}
        />
      </TseWrapper>
    </BaseCol>
  );
};
