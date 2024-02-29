import { BaseProgress } from '@app/components/common/BaseProgress/BaseProgress';
import React from 'react';
import * as S from './StatisticsProgress.styles';

interface StatisticsProgressProps {
  color: string;
  unit: 'kg' | '';
  percent: number;
}

export const StatisticsProgress: React.FC<StatisticsProgressProps> = ({ color, percent, unit }) => {
  return (
    <BaseProgress
      type="circle"
      width={50}
      strokeColor={color}
      trailColor="transparent"
      percent={percent}
      format={(percent) => (
        <>
          <S.ValueText>{percent}</S.ValueText>
          <br />
          <S.UnitText>{unit}</S.UnitText>
        </>
      )}
    />
  );
};
