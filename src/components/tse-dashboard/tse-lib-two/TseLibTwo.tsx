import React, { useCallback, useEffect, useMemo, useState } from 'react';

import * as S from './TseLibTwo.style';

import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';
import { TseWrapper } from '../TseWrapper';

export interface CurrentStatisticsState {
  firstUser: number;
  secondUser: number;
  month: number;
  statistic: number;
}

export const TseLibTwo: React.FC = () => {
  const theme = useAppSelector((state) => state.theme.theme);
  return (
    <S.ScreeningsCard title="Backlog and NPS Score" padding={0}>
      <TseWrapper>
        <LiveboardEmbed
          liveboardId="1d8000d8-6225-4202-b56c-786fd73f95ad"
          visibleVizs={['e8d7ae87-67d2-466d-97db-14e95ab18cfd', '76880b19-d43c-4c09-a351-8cde96c85f4f']}
          className="tse-viz-two"
          hideLiveboardHeader={true}
          customizations={{
            style: {
              customCSS: {
                variables: {
                  '--ts-var-application-color': themeObject[theme].background,
                  '--ts-var-root-background': themeObject[theme].background,
                },
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
    </S.ScreeningsCard>
  );
};
