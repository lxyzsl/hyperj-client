import Storage from '@/constants/storage'
/**
 * 验证是否有权限
 */
 export function hasPerms(perms:any):boolean{
    const currentUserStorage = localStorage.getItem(Storage.USER_INFO_KEY);
    if(currentUserStorage){
      const currentUser = JSON.parse(currentUserStorage) as ApiResp.Account.CurrentUserInterface;
      const {permissions} = currentUser
      return matchPermission(permissions, perms);
      return false
    }else{
      return false
    }
  }

export function matchPermission(permissions: string[], value: any) {
    const type = typeof value;
    if (type === 'string') {
      return matchPerm(permissions, value);
    }
    return matchPerms(permissions, value);
  }


export function matchPerms(permissions: string[], value: string[]) {
  if (value && value instanceof Array && value.length > 0) {
    const permissionDatas = value;
    const all_permission = '*:*:*';
    const hasPermission = permissions.some((permission) => {
      return all_permission === permission || permissionDatas.includes(permission);
    });
    if (!hasPermission) {
      return false;
    }
    return true;
  }
  return false;
}

export function matchPerm(permissions: string[], value: string) {
  if (value && value.length > 0) {
    const permissionDatas = value;
    const all_permission = '*:*:*';
    const hasPermission = permissions.some((permission) => {
      return all_permission === permission || permissionDatas === permission;
    });
    if (!hasPermission) {
      return false;
    }
    return true;
  }
  return false;
}