export interface Statistic {
  id: number;
  value: number;
  prevValue: number;
  unit: 'kg' | '';
}

export const getStatistics = (): Promise<Statistic[]> => {
  return new Promise((res) => {
    setTimeout(() => {
      res([
        {
          id: 1,
          value: 24,
          prevValue: 20,
          unit: '',
        },
        {
          id: 2,
          value: 190,
          prevValue: 199,
          unit: '',
        },
        {
          id: 3,
          value: 442,
          prevValue: 429,
          unit: '',
        },
      ]);
    }, 0);
  });
};
