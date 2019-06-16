import { Validators } from '@angular/forms';

/**
 * ログイン
 * 入力フォーム
 */
export class LoginForm {

  /** メールアドレス */
  mail: string;
  /** パスワード */
  password: string;

  static validators = {
    /** メールアドレス */
    mail: ['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(256)])],
    /** パスワード */
    password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(30)])]
  };

}
