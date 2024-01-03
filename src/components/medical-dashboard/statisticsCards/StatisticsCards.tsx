import React, { useEffect, useMemo, useState } from 'react';
import { useResponsive } from 'hooks/useResponsive';
import { StatisticsCard } from './statisticsCard/StatisticsCard/StatisticsCard';
import { getStatistics, Statistic } from 'api/statistics.api';
import { statistics as configStatistics } from 'constants/config/statistics';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { getPercentage } from '@app/utils/utils';

const getStatisticsColor = (value: number, prevValue: number) => {
  if (value > prevValue) {
    return 'error';
  }

  if (value < prevValue) {
    return 'success';
  }

  return 'primary';
};

export const StatisticsCards: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistic[]>([]);

  const { isTablet } = useResponsive();

  useEffect(() => {
    getStatistics().then((res) => setStatistics(res));
  }, []);

  const totalValue = statistics.reduce((total, st) => st.value + total, 0);

  const statisticsCards = useMemo(
    () =>
      statistics.map((st, index) => {
        const currentStatistic = configStatistics.find((el) => el.id === st.id);

        return currentStatistic ? (
          <BaseCol key={st.id} id={currentStatistic.name} xs={12} md={8} order={(isTablet && index + 1) || 0}>
            <StatisticsCard
              name={currentStatistic.title}
              value={st.value}
              prevValue={st.prevValue}
              color={getStatisticsColor(st.value, st.prevValue)}
              unit={st.unit}
              Icon={currentStatistic.Icon}
              percent={getPercentage(st.value, totalValue)}
            />
          </BaseCol>
        ) : null;
      }),
    [statistics, isTablet],
  );

  return <>{statisticsCards}</>;
};
