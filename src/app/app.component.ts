import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform, ToastController, AlertController, ActionSheetController } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar, Style } from '@capacitor/status-bar';
import { ApiService } from './services/api.service';
import { NetworkService } from './services/network.service';
import { AuthService } from './services/auth.service';
import { Storage } from '@ionic/storage';
import { environment } from 'src/environments/environment';
import { Location } from '@angular/common';
import { App as CapacitorApp } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  currentVersion = environment.currentVersion;

  isActionSheetOpen: boolean = false;

  first_name:any;
  last_name:any;
  image_url:any;

  constructor(
    public storage: Storage,
    private platform: Platform,
    private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
    private router: Router,
    private alertCtrl: AlertController,
    private toastController: ToastController,
    private navCtrl: NavController,
    private actionSheetCtrl: ActionSheetController,
    private location: Location,
    private apiService: ApiService,
    private networkService: NetworkService,
    private authService: AuthService
) {

  this.initStorage();

}

initializeApp() {

    this.platform.ready().then(() => {

      //StatusBar.setStyle({ style: StatusBarStyle.Dark, });
      StatusBar.setBackgroundColor({ color: '#d1378c' });

      //StatusBar.setBackgroundColor({ color: '#0056b3' });

      // Display content under transparent status bar (Android only)
      StatusBar.setOverlaysWebView({ overlay: true });

        this.splashScreen.hide();

    //DEVICE BACK BUTTON
    this.checkCanGoBack();

    if (this.platform.is('cordova')) {
      //this.initPushNotification();
    }

    if (this.authService.isAuthenticated()) {
        // User is authenticated, navigate to home page
        console.log('isAuthenticated getDashboard');
        this.router.navigate(['/home']);
    } else {
        // User is not authenticated, navigate to login page
        console.log('isAuthenticated welcome');
        this.router.navigate(['/welcome']);
    }

    //this.checkForUpdate();


    });

}


checkCanGoBack() {

  //Registration of push in Android and Windows Phone
  this.platform.backButton.subscribeWithPriority(10, () => {

  if (this.isActionSheetOpen) {
    // The action sheet is open, so do something.
    return;
  }


  CapacitorApp.addListener('backButton', ({canGoBack}) => {
    if(!canGoBack){

      this.isActionSheetOpen = true;

      this.presentBackActionSheet();

    } else {
      window.history.back();
    }
  });

  });
}

async presentBackActionSheet() {
  const actionSheet = await this.actionSheetCtrl.create({
    header: 'Do you want to close the app?',
    buttons: [
      {
        text: 'Yes',
        handler: () => {
          console.log('User clicked Yes');
          this.isActionSheetOpen = false;
          this.exitApp();
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('User clicked Cancel');
          this.isActionSheetOpen = false;
        }
      }
    ]
  });

  await actionSheet.present();

  actionSheet.onDidDismiss().then(() => {
    console.log('Action Sheet dismissed');
    this.isActionSheetOpen = false;
    // Perform any additional actions after Action Sheet is dismissed
  });
}

exitApp() {
  CapacitorApp.exitApp();
}

async initStorage() {
  await this.storage.create();
  // Now you can use storage methods safely
}

  async logout() {
    let alert = await this.alertCtrl.create({
        header: 'Confirm',
        message: 'Do you want to logout from the App?',
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
              //this.logoutNow();
            }
          }
        ]
      });
      await alert.present();
    }


    initPushNotification() {
  // this.fcm.subscribeToTopic('marketing');
  //
  // this.fcm.getToken().then(token=>{
  //   //register token
  //   this.SendTokenToServer(token);
  //   //console.log(token);
  //   //this.presentToast('fcm token 1--'+token);
  // })
  //
  // this.fcm.onNotification().subscribe(data=>{
  //   if(data.wasTapped){
  //     //Notification was received on device tray and tapped by the user.
  //     //console.log("Received in background "+JSON.stringify(data));
  //     //this.presentAlert("Received in background "+JSON.stringify(data));
  //   } else {
  //     //Notification was received in foreground. Maybe the user needs to be notified.
  //   // Here you should add an alert or something that let's the user know
  //   // you're about to take them to another page
  //   //console.log("Received in foreground "+JSON.stringify(data));
  //   // this.presentAlertForeGround(data);
  //
  //   // Schedule multiple notifications
  //   this.localNotifications.schedule([{
  //      id: 1,
  //      title: data['title'],
  //      text: data['body'],
  //      //sound: null,
  //      data: { data }
  //     }
  //   ]);
  //
  //   };
  // })
  //
  // this.fcm.onTokenRefresh().subscribe(token=>{
  //   //register token
  //   this.SendTokenToServer(token);
  //   //this.presentToast('fcm refresh token--'+token);
  // })
  //
  // //this.fcm.unsubscribeFromTopic('marketing');
}

async presentAlertForeGround(data:any)
{
  const alert = await this.alertCtrl.create({
  header: data.title,
  message: data.body,
  buttons: ['Ok']
  });
  await alert.present();
  // if(data.target_screen != null) {
  //   alert.onDidDismiss(() => {
  //     this.app.getRootNav().setRoot(data.target_screen);
  //   });
  // }
}

// SendTokenToServer(fcmToken:any) {
//   this.apiService.SendTokenToServer(fcmToken).then((result:any) => {
//   this.data = result;
// }, (err:any) => {
//   //this.presentToast('fcm data--'+this.data);
//   });
// }

// checkForUpdate()
// {
//   this.apiService.checkVersion().then((result:any) => {
//   this.data = result;
//
//   if ((this.data as any)?.result?.code == 1) {
//     if (this.data && 'result' in this.data) {
//       this.PresentAlertCheck(this.data?.result);
//     }
//   }
//
//   }, (err:any) => {
//   //this.presentToast('fcm data--'+this.data);
//   });
// }

 async PresentAlertCheck(data:any) {

  const alert = await this.alertCtrl.create({
    header: data.title,
    message: data.message,
    buttons: ['Ok']
  });
  await alert.present();
  if(data.force==true) {
    alert.onDidDismiss().then(() => {  window.open(data.url, '_system'); });
  }

}

async toast(txt:any) {

const toast = await this.toastController.create({
  message: txt,
  duration: 2000,
  position : 'bottom',
  mode : 'ios',
  color : 'dark'
});

toast.present();
}

shareApp() {

}

settings() {

}

myaccount() {

}

home() {

}

}
