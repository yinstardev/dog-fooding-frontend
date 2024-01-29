import { getLiveboardData } from '@app/utils/tse.utils';

export interface Statistic {
  id: number;
  value: number;
  prevValue: number;
  unit: 'kg' | '';
}

export const getStatistics = async (): Promise<Statistic[]> => {
  const [libData, libDataError] = await getLiveboardData({
    metadata_identifier: '1d8000d8-6225-4202-b56c-786fd73f95ad',
    visualization_identifiers: ['P0 Backlog', 'P1 Backlog', 'P2 Backlog'],
    sortOptions: {
      columnName: 'Case Snapshot Time',
      asc: true,
    },
  });

  if (libDataError || !libData || !libData.contents || !Array.isArray(libData.contents)) {
    return [];
  }

  const data = libData.contents.map((data, id) => {
    return {
      id: id + 1,
      prevValue: data.data_rows[1][1],
      value: data.data_rows[0][1],
      unit: 'kg' as 'kg',
    };
  });

  return data;
};
