import { Dispatch, SetStateAction } from 'react';
import { PageUIProps } from '../common-type';

export type LoginUIProps = PageUIProps & {
  password: string;
  setPassword: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
