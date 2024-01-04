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
          liveboardId="68dcf3ec-8e9c-491f-8e2c-090bfd81aa73"
          visibleVizs={['e3b1a1e7-a4d0-482a-9946-094f5a56fb73', 'fab3c15e-1298-4916-95ac-1298fce68894']}
          activeTabId="2887b9c7-1c9c-4b74-86f4-c89e5be8d8ca"
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
