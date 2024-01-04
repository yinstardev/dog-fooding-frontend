import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { InitState, doInit } from '@app/store/slices/tseSlice';

interface TseWrapperProps {
  children: React.ReactNode;
}

export const TseWrapper: React.FC<TseWrapperProps> = (props) => {
  const tseData = useAppSelector((state) => state.tse);

  const dispatch = useAppDispatch();

  if (tseData.initState === InitState.NOT_STARTED) {
    dispatch(doInit());
  }

  if (tseData.initState !== InitState.FINISHED) {
    return <div>Loading...</div>;
  }

  return <>{props.children}</>;
};
