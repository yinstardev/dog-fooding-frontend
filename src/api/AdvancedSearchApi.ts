import axios from 'axios';
import { fetchUserAndToken } from '@app/api/getUserAndToken';
import { ConsoleSqlOutlined } from '@ant-design/icons';

interface AdvancedSearchDataParam {
  caseOwnerName: string[];
  caseNumber?: string;
  casePriority?: string;
  //   caseSubject?: string;
  //   caseSFDCUrl?: string;
}

const advancedSearchData = async ({
  caseOwnerName,
  caseNumber,
  casePriority,
}: AdvancedSearchDataParam): Promise<[any[], any]> => {
  let result = [];
  let error = null;

  const url = 'https://champagne.thoughtspotstaging.cloud/api/rest/2.0/searchdata';
  const { token } = await fetchUserAndToken();
  const headers = {
    Authorization: 'Bearer ' + token,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  let queryParts = caseOwnerName.map((name) => `[Case Owner Name] = '${name}'`).join(' or ');
  //   if (caseNumber) {
  //     queryParts += ` [Case Number] = '${caseNumber}'`;
  //   }else{
  //     queryParts += ` [Case Number]`;
  //   }
  if (casePriority) {
    queryParts += ` [Case Priority] = '${casePriority}'`;
  } else {
    queryParts += ` [Case Priority]`;
  }
  queryParts += ` [Case Subject]`;
  queryParts += ` [Case SFDC Url]`;
  queryParts += ` [Case Status] = 'open'`;

  const data = {
    query_string: queryParts,
    logical_table_identifier: '54beb173-d755-42e0-8f73-4d4ec768114f', // Adjust this to your actual table identifier
    data_format: 'COMPACT',
    record_offset: 0,
    record_size: 500,
  };

  try {
    const response = await axios.post(url, data, { headers });
    console.log(response.data);
    result = response.data.contents[0].data_rows.map((row: any) => ({
      casePriority: row[0], // Adjust indices based on your API response structure
      caseSubject: row[1],
      caseSFDCUrl: row[2],
    }));
  } catch (e) {
    console.error('Error fetching advanced search data:', e);
    error = e;
  }

  return [result, error];
};

export default advancedSearchData;
