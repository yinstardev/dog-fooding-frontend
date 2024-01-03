import React, { useCallback, useEffect, useMemo, useState } from 'react';

import * as S from './TseLibTwo.style';

import { LiveboardEmbed } from '@thoughtspot/visual-embed-sdk/lib/src/react';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { themeObject } from '@app/styles/themes/themeVariables';

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
      <LiveboardEmbed
        liveboardId="68dcf3ec-8e9c-491f-8e2c-090bfd81aa73"
        visibleVizs={[
          'c370b31d-a44e-49a5-81d5-6cabdc151716',
          '68abaa19-d461-45c7-84f2-fae78d559699',
          'd4c4ba36-0465-4d6f-9d38-834ad998b1eb',
          'bd27e869-722c-4e73-9b05-d02dd7276d09',
        ]}
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
    </S.ScreeningsCard>
  );
};
