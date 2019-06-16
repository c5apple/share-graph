import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private ngZone: NgZone,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit() {
    this.afAuth
      .auth
      .signOut()
      .then(() => {
        // 外部イベントの検知
        this.ngZone.run(() => {
          // ログイン成功ならユーザーページへ
          return this.router.navigate(['/']);
        });
      }).then(() => alert('ログアウトしました。'))
      .catch(err => {
        console.log(err);
        alert('ログアウトに失敗しました。\n' + err);
      })
  }
}
