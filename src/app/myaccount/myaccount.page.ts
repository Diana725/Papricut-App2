import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
})
export class MyaccountPage implements OnInit {

  apiLoader:boolean = false;
  data:any;
  currentVersion = environment.currentVersion;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private networkService: NetworkService,
    private router: Router,
    private navCtrl: NavController,
    private alertCtrl:AlertController
  ) { }

  ngOnInit() {

  }

  profile() {
    this.navCtrl.navigateForward('/profile', { state: {}  });
  }

  changepassword() {
    this.navCtrl.navigateForward('/changepassword', { state: {}  });
  }

  community() {
    this.navCtrl.navigateForward('/community', { state: {}  });
  }

  async deleteAccount() {
      let alert = await this.alertCtrl.create({
          header: 'Confirm',
          message: 'Do you want to completely delete your Papricut account? This action will delete all your records and its not reversable.',
          cssClass: 'alertButtonCssAuto',
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Yes',
              handler: () => {
                console.log('Yes clicked');
                this.deleteAccountNow();
              }
            }
          ]
        });
        await alert.present();
      }

      deleteAccountNow() {

        if(this.networkService.checkInternetConnection() == 0) {
          this.presentAlert('No Internet Connection!',"Please put Internet Connection ON and try again");
        }
        else {

      this.apiLoader = true;
      this.apiService.deleteAccount().then((result:any) => {
      this.apiLoader = false;
      this.data = result;

      let status_code = this.data.code;
      if(status_code ==1) {
        this.apiService.logout();
      }

      this.presentAlert("",this.data.message);

      }, (err:any) => {
      this.apiLoader = false;
      this.presentAlert("","Request not sent. Please try again later");
      });
    }

    }

    logout() {
      localStorage.removeItem("PapricutRightsGroup");
      localStorage.removeItem("PapricutisSuper");
      this.authService.clearAuthentication();
      this.apiService.logout();
      this.navCtrl.navigateForward('/welcome', { state: {}  });
    }

    async presentAlert(header:any,message:any) {
      const alert = await this.alertCtrl.create({
        header: header,
        message: message,
        cssClass: 'alertButtonCssAuto',
        buttons: ['OK']
      });

      await alert.present();
    }

}
