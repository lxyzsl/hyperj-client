/**
   * 验证手机号码
   * @param  {string} mobile 手机号码
   * @return {boolean} 是否有效
   */
 export function isValidMobile(mobile: string): boolean {
  const reg2 = /^1[3-9][0-9]{9}$/;
  return reg2.test(mobile);
}