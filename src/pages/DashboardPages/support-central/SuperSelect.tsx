import React, { useState, useEffect } from 'react';
import { Select } from 'antd';
import { SuperSelectProps } from './types';
import { useTranslation } from 'react-i18next';
import { searchData } from './searchData';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import '../dashboard.css';

export const SuperSelect: React.FC<SuperSelectProps> = ({ columnName, defaultValues, updateValues }) => {
  const [options, setOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues || []);
  const { t } = useTranslation();

  const updateOptions = (data: string[]) => {
    const allValues = [...new Set([...data, ...options])];
    setOptions(allValues);
  };
  const handleDeselect = (deselectedValue: any) => {
    const newValues = selectedValues.filter((value) => value !== deselectedValue);
    setSelectedValues(newValues);
    updateValues?.(newValues);
  };
  // debugger;
  useEffect(() => {
    setSelectedValues(defaultValues || []);
    searchData({ query: '', columnName }).then(([data]) => {
      updateOptions(data);
      //   console.log(data);
    });

    return () => {
      console.log('SuperSelect unmounting or updating');
    };
  }, [defaultValues, columnName]);

  const test = selectedValues.map((item) => ({ value: item, label: item }));

  return (
    <BaseButtonsForm.Item
      name={columnName}
      label={columnName}
      rules={[{ required: false, message: t('forms.validationFormLabels.colorError'), type: 'array' }]}
    >
      <Select
        mode="multiple"
        options={options.map((e) => ({ value: e, label: e }))}
        onSearch={async (query) => {
          if (isLoading) return;
          setIsLoading(true);
          try {
            const [values, error] = await searchData({ query, columnName });
            if (!values || error) {
              console.error(error);
              setIsLoading(false);
              return;
            }
            const sortedValues = values.sort((a, b) => {
              const startsWithA = a.toLowerCase().startsWith(query.toLowerCase());
              const startsWithB = b.toLowerCase().startsWith(query.toLowerCase());

              if (startsWithA && !startsWithB) {
                return -1;
              } else if (!startsWithA && startsWithB) {
                return 1;
              } else {
                return a.localeCompare(b);
              }
            });

            updateOptions(sortedValues);
          } catch (e) {
            console.error(e);
          }
          setIsLoading(false);
        }}
        onSelect={(e: any) => {
          const newValues = [...selectedValues, e];
          updateValues?.(newValues);
          setSelectedValues(newValues);
        }}
        onDeselect={handleDeselect}
        value={test}
        defaultValue={test}
        loading={isLoading}
      />
    </BaseButtonsForm.Item>
  );
};
