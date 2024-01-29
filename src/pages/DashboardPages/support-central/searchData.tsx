import { fetchUserAndToken } from "@app/api/getUserAndToken";
import axios from "axios";


interface SearchDataParam {
    query: string;
    columnName: string;
  }
  
  const cachedData: { [key: string]: { data: string[] } } = {};
  
  export async function searchData({ query, columnName }: SearchDataParam): Promise<[string[], any]> {
    let result: string[] = [];
    let error = null;
  
    if (cachedData[columnName + query]?.data !== undefined) {
      return [cachedData[columnName + query].data, error];
    }
  
    const url = 'https://champagne.thoughtspotstaging.cloud/api/rest/2.0/searchdata';
  
    const { token } = await fetchUserAndToken();
  
    const headers = {
      Authorization: 'Bearer ' + token,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  
    const data = {
      query_string: `[${columnName}] CONTAINS '${query}'`,
      logical_table_identifier: '54beb173-d755-42e0-8f73-4d4ec768114f',
      data_format: 'COMPACT',
      record_offset: 0,
      record_size: 500,
    };
  
    const defaultData = {
      query_string: `[${columnName}]`,
      logical_table_identifier: '54beb173-d755-42e0-8f73-4d4ec768114f',
      data_format: 'COMPACT',
      record_offset: 0,
      record_size: 500,
    };
  
    try {
      let response;
      if (query.length > 0) {
        response = await axios.post(url, data, { headers });
      } else {
        response = await axios.post(url, defaultData, { headers });
      }
      result = response.data.contents[0].data_rows.map((e: any) => e[0]);
  
      cachedData[columnName + query] = {
        data: result,
      };
    } catch (e) {
      error = e;
    }
  
    return [result, error];
  }
  