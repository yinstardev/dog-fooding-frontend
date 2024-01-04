import { fetchUserAndToken } from '@app/api/getUserAndToken';
import { THOUGHTSPOT_HOST } from '@app/environment';
import { getFullAccessToken } from '@app/utils/tse.utils';
import { PrepareAction, createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AuthStatus, AuthType } from '@thoughtspot/visual-embed-sdk';
import { init } from '@thoughtspot/visual-embed-sdk';

export enum InitState {
  NOT_STARTED = 'NOT_STARTED',
  FINISHED = 'FINISHED',
  STARTED = 'STARTED',
  ERROR = 'ERROR',
}

const initialState = {
  initState: InitState.NOT_STARTED,
  host: THOUGHTSPOT_HOST,
};

const doInit = createAsyncThunk('tse/doInit', async (_, { dispatch }) => {
  dispatch(setInitState(InitState.STARTED));
  return new Promise<void>((resolve, reject) => {
    init({
      thoughtSpotHost: initialState.host,
      authType: AuthType.TrustedAuthTokenCookieless,
      getAuthToken: async () => {
        const { token } = await fetchUserAndToken();
        if (!token) return '';
        return token;
      },
    })
      .on(AuthStatus.SDK_SUCCESS, () => {
        dispatch(setInitState(InitState.FINISHED));
        resolve();
      })
      .on(AuthStatus.FAILURE, () => {
        dispatch(setInitState(InitState.ERROR));
        reject();
      });
  });
});

export const setInitState = createAction<PrepareAction<InitState>>('tse/setInitState', (initState: InitState) => {
  return {
    payload: initState,
  };
});

export const tseSlice = createSlice({
  name: 'tse',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setInitState, (state, action) => {
      state.initState = action.payload;
    });
  },
});

export { doInit };

export default tseSlice.reducer;
