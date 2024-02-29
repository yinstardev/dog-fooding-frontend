import { fetchUserAndToken } from '@app/api/getUserAndToken';
import { THOUGHTSPOT_HOST } from '@app/environment';
import { createAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthStatus, AuthType, init } from '@thoughtspot/visual-embed-sdk';

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

const doInit = createAsyncThunk('tse/doInit', async (_, { dispatch, getState }) => {
  dispatch(setInitState(InitState.STARTED));
  return new Promise<void>((resolve, reject) => {
    init({
      thoughtSpotHost: initialState.host,
      authType: AuthType.TrustedAuthTokenCookieless,
      autoLogin: true,
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
        const currentState = getState() as { tse: typeof initialState };
        if (currentState.tse.initState !== InitState.FINISHED) {
          console.log('Error, SDK Init Failure, & IsActive fail');
          dispatch(setInitState(InitState.ERROR));
          reject();
        }
      });
  });
});

export const setInitState = createAction<InitState>('tse/setInitState');

export const tseSlice = createSlice({
  name: 'tse',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setInitState, (state, action: PayloadAction<InitState>) => {
      state.initState = action.payload;
    });
  },
});

export { doInit };

export default tseSlice.reducer;
