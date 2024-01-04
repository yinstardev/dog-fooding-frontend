import { SECRET_KEY, USERNAME } from '@app/environment';

const url = 'https://champagne.thoughtspotstaging.cloud/callosum/v1/tspublic/v1/session/auth/token';
const secretKey = SECRET_KEY;
const username = USERNAME;
const accessLevel = 'FULL';

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'text/plain',
};

const body = new URLSearchParams({
  secret_key: secretKey,
  username: username,
  access_level: accessLevel,
});

export const getFullAccessToken = async (): Promise<[string | null, any]> => {
  let data: string | null = null;
  let error = null;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    data = await res.text();
  } catch (err) {
    error = err;
  }

  return [data, error];
};

type LiveboardData = {
  contents: { data_rows: any[] }[];
};
type GetLiveboardDataInput = {
  metadata_identifier: string;
  visualization_identifiers?: string[];
  sortOptions?: {
    columnName: string;
    asc: boolean;
  };
};
export const getLiveboardData = async ({
  metadata_identifier,
  visualization_identifiers,
  sortOptions,
}: GetLiveboardDataInput): Promise<[LiveboardData | null, any]> => {
  let data: LiveboardData | null = null;
  let error = null;

  const [token, tokenError] = await getFullAccessToken();

  if (tokenError) return [null, tokenError];

  try {
    const res = await fetch('https://champagne.thoughtspotstaging.cloud/api/rest/2.0/metadata/liveboard/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        metadata_identifier,
        data_format: 'COMPACT',
        record_offset: 0,
        record_size: 100,
        visualization_identifiers,
        runtime_sort: sortOptions
          ? {
              sortCol1: sortOptions?.columnName,
              asc1: sortOptions?.asc,
            }
          : undefined,
      }),
    });
    data = (await res.json()) as LiveboardData;
  } catch (err) {
    error = err;
  }

  return [data, error];
};
