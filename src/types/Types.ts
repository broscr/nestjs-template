import { USER_TYPE } from '../utility/Constants';

/**
 * User tip tanımı
 */
export type UserSession = {
  _id: string;
  name: string;
  accessToken: string;
  role: Array<USER_TYPE>;
};

export interface DeleteResult {
  /**
   * Silme sonucunun başarılı olup olmadığını gösterir.
   * Başarısız bir silme işleminde undefined olacaktır.
   * */
  acknowledged: boolean;
  //Kaç adet döküman silindi
  deletedCount: number;
}
