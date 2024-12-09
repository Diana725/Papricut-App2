import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { OtherService } from '../services/other.service';
import { NavController, AlertController, ActionSheetController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core'; // Import Plugins from Capacitor core
const { App } = Plugins; // Destructure the App plugin from Plugins

import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  backButtonPressedOnce = false;

  hasClick: any = false;

  data:any;

  constructor(
    private alertCtrl:AlertController,
    private platform: Platform,
    private actionSheetCtrl: ActionSheetController,
    public otherService: OtherService,
    private navCrtl: NavController,
    private apiService: ApiService,
    private iab: InAppBrowser
  ) {
    this.otherService.statusBar("#d1378c", 1);
  }

  ionViewDidEnter() {
    this.checkForUpdate();
  }

  ngOnInit() {
    this.platform.backButton.subscribeWithPriority(10, () => {
      // If back button is pressed twice within 2 seconds, exit the app
      if (this.backButtonPressedOnce) {
        (App as any).exitApp(); // Use Capacitor's App plugin to exit the app
      } else {
        this.backButtonPressedOnce = true;
        setTimeout(() => this.backButtonPressedOnce = false, 2000); // Reset the flag after 2 seconds
      }
    });
  }

  async checkForUpdate() {
    const platform = await this.otherService.checkDevicePlatform();  // Ensure it's awaited
    //console.log('this.otherService.checkDevicePlatform() == ' + platform);

    this.apiService.checkVersion(platform).then((result:any) => {
      this.data = result;

      if ((this.data as any)?.result?.code == 1) {
        if (this.data && 'result' in this.data) {
          this.PresentAlertCheck(this.data?.result);
        }
      }
    }).catch((err:any) => {
      // Handle error
      console.error('Error in checkVersion:', err);
      // Optionally, display a toast or alert here
    });
  }

// async PresentAlertCheck(data:any) {
//  const alert = await this.alertCtrl.create({
//    header: data.title,
//    message: data.message,
//    buttons: ['Update Now']
//  });
//  await alert.present();
//  if(data.force==true) {
//    alert.onDidDismiss().then(() => {  window.open(data.url, '_system'); });
//  }
// }

async PresentAlertCheck(data: any) {
  const alert = await this.alertCtrl.create({
    header: data.title,
    message: data.message,
    buttons: ['Update Now'],
  });
  await alert.present();

  if (data.force == true) {
    alert.onDidDismiss().then(() => {
      this.iab.create(data.url, '_system');
    });
  }
}


  openBooking() {
    this.navCrtl.navigateForward(['/booknow']);
  }

  openLogin() {
    this.navCrtl.navigateForward('/signin', { state: {} });
    //this.apiService.openLink('https://papricut.com/login');
  }

  openWeb() {
    this.apiService.openLink('https://papricut.com');
  }

  registerhere(accountType:any) {
    const params = { accountType: accountType };
    this.navCrtl.navigateForward('/register', { state: params });
  }

  async openRegister() {
    var buttons = [
      {
        text: 'I am a Photographer',
        icon: 'videocam',
        handler: () => {
          this.registerhere('Photographer');
        }
      },
      {
        text: 'I am a Customer',
        icon: 'people',
        handler: () => {
          this.registerhere('Customer');
        }
      }
    ];
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Select Account Type',
      buttons: buttons,
      cssClass: 'custom-action-sheet'
    });
    await actionSheet.present();
  }

}
