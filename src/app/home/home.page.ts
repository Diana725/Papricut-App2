import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  pageName:string="home";

  delivered:string = '0';
  ongoing:string = '0';
  completed:string = '0';

  data:any;

  apiLoader:boolean = false;

  rights_group = '0';
  isSuper = '0';

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertCtrl:AlertController,
    private apiService: ApiService,
    private networkService: NetworkService
  ) { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.rights_group = localStorage.getItem("PapricutRightsGroup") || '';
    //console.log('this.rights_group = '+this.rights_group);
    this.isSuper = localStorage.getItem("PapricutisSuper") || '';
    this.getDashboardData();
  }

  doRefresh(event: CustomEvent): void {
    // this.page = 1;
    this.getDashboardData();
    if (event) {
      event.detail.complete();
    }
  }

  getDashboardData() {
    if(navigator.onLine !== true) {
      this.presentAlert('','No Internet Connection!',"Please put Internet Connection ON and try again");
    }
    else {
      //this.apiLoader = true;
      this.apiService.getDashboard()
      .then(result => {
       this.data = result;
       //this.apiLoader = false;

       if(this.data.code == 400 || this.data.code == 0) {
             this.logoutNow();
       }

       //console.log('getDashboard---'+JSON.stringify(this.data));
       this.delivered = this.data.result.delivered;
       this.ongoing = this.data.result.ongoing;
       this.completed = this.data.result.completed;
       this.rights_group = this.data.result.rights_group;
       this.isSuper = this.data.result.isSuper;

      });
    }
  }

  logoutNow() {
    this.authService.clearAuthentication();
    this.navCtrl.navigateForward('/welcome', { state: {}  });
    this.apiLoader = true;
    this.apiService.logout().then((result:any) => {
      this.apiLoader = false;
    }, (err:any) => {
      this.apiLoader = false;
    });
//await this.authService.logout();
}

  bookNow() {
    this.navCtrl.navigateForward('/booknow', { state: {}  });
  }

  openBookings(status:any) {
      const params = { status: status };
      this.navCtrl.navigateForward('/bookings', { state: params });
  }

  async presentAlert(header:any,subHeader:any,message:any) {
    const alert = await this.alertCtrl.create({
      header: header,
      subHeader: subHeader,
      message: message,
      cssClass: 'alertButtonCssAuto',
      buttons: ['OK']
    });
    await alert.present();
  }

}
