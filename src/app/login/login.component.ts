import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { LoginForm } from './login-form';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  /** 入力フォーム */
  form: FormGroup;

  user: Observable<firebase.User>;

  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.form = this.formBuilder.group(LoginForm.validators);
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

  onSubmit(form: LoginForm, isValid: boolean): void { // 変更
    if (!isValid) {
      return;
    }
    this.loading = true;

    this.afAuth
      .auth
      .signInWithEmailAndPassword(form.mail, form.password)
      .then(auth => {
        // メールアドレス確認が済んでいるかどうか
        if (!auth.user.emailVerified) {
          this.afAuth.auth.signOut();
          return Promise.reject('メールアドレスが確認できていません。');
        } else {
          // ログイン成功
          return this.router.navigate(['/']);
        }
      })
      .then(() => alert('ログインしました。'))
      .catch(err => {
        console.log(err);
        alert('ログインに失敗しました。\n' + err);
      })
  }
}
