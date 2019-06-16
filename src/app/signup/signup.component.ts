import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { SignupForm } from './signup-form';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  /** 入力フォーム */
  form: FormGroup;

  user: Observable<firebase.User>;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.form = this.formBuilder.group(SignupForm.validators);
  }

  ngOnInit() {
    // 認証状態の変更を監視しておく
    this.user = this.afAuth.authState;
    this.user.subscribe(u => {
      if (u) {
        // ログイン済み
        console.log(u.providerData);
        return this.router.navigate(['/']);
      }
    });
  }

  /**
   * 登録ボタン
   * @param form 入力フォーム
   * @param isValid 有効か
   */
  onSubmit(form: SignupForm, isValid: boolean) {
    if (!isValid) {
      return;
    }

    this.loading = true;

    // アカウント作成
    this.afAuth
      .auth
      .createUserWithEmailAndPassword(form.mail, form.password) // アカウント作成
      .then(auth => auth.user.sendEmailVerification()) // メールアドレス確認
      .then(() => alert('メールアドレス確認メールを送信しました。'))
      .catch(err => {
        console.log(err);
        alert('アカウントの作成に失敗しました。\n' + err)
      });
  }
}
