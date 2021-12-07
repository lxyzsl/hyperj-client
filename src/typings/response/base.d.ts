declare namespace ApiResp {
  import type { ResultCode } from '../../constants';

  export interface IBaseResp {
    success: boolean,
    code: ResultCode,
    msg: string,
  }

  interface ListResp extends IBaseResp{
    current: number,
    pageSize: number,
    total: number,
    data?: T;
  }
}
