import { getLiveboardData } from '@app/utils/tse.utils';

export interface Statistic {
  id: number;
  value: number;
  prevValue: number;
  unit: 'kg' | '';
}

export const getStatistics = async (): Promise<Statistic[]> => {
  const [libData, libDataError] = await getLiveboardData({
    metadata_identifier: '68dcf3ec-8e9c-491f-8e2c-090bfd81aa73',
    visualization_identifiers: ['P0 Backlog', 'P1 Backlog', 'P2 Backlog'],
    sortOptions: {
      columnName: 'Case Snapshot Time',
      asc: true,
    },
  });

  if (libDataError || !libData) return [];

  const data = libData.contents.map((data, id) => {
    return {
      id: id + 1,
      prevValue: data.data_rows[1][1],
      value: data.data_rows[0][1],
      unit: '',
    } satisfies Statistic;
  });


  return data;
};
