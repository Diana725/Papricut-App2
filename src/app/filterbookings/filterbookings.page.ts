import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router, NavigationExtras } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-filterbookings',
  templateUrl: './filterbookings.page.html',
  styleUrls: ['./filterbookings.page.scss'],
})
export class FilterbookingsPage implements OnInit {

  data:any;

  years:any;
  cities:any;
  countries:any;

  country_id:string='0';
  city_id:string='0';
  year:string='0';

  apiLoader:boolean = false;

  hasClick:any = false;

  PostData = { country_id:'', city_id:'', year:'' };

  constructor(
    private navParams: NavParams,
    private modalCtrl: ModalController,
    private navCtrl: NavController,
    private alertCtrl:AlertController,
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private networkService: NetworkService
  ) { }

  ngOnInit() {

    this.years = this.navParams.get('years');
    if (typeof this.years === 'string') {
      this.years = JSON.parse(this.years);
    }

    this.getCountries();

  }

  countryEvent(event: CustomEvent) {
    this.getCities(event.detail.value);
  }

  getCountries(){
    if(navigator.onLine !== true || this.networkService.checkInternetConnection() == 0) {
    this.presentAlert('No Internet Connection!',"Please put Internet Connection ON and try again");
    } else {
    this.apiService.loadCountries()
    .then(result => {
      this.data = result;
      this.countries = this.data.result;
    });
    }
  }

  getCities(country:any){
    this.apiLoader = true;
    this.apiService.loadCities(country)
    .then(result => {
      this.apiLoader = false;
      this.data = result;
      this.cities = this.data.result;
    });
  }

  dismiss() {
		this.modalCtrl.dismiss({
      country_id:this.country_id,
      city_id:this.city_id,
      year:this.year,
      filtered:1
    });
 }

 submit() {
   // if (this.PostData.year === "") {
   //   this.presentAlert('',"Select year");
   // }
   // else if (this.PostData.country_id === "") {
   //   this.presentAlert('',"Select country");
   // }
   // else {
   this.modalCtrl.dismiss(
     {
       country_id:this.PostData.country_id,
       city_id:this.PostData.city_id,
       year:this.PostData.year,
       filtered:1
     }
   );
 //}
 }

 async presentAlert(header:any,message:any) {
   const alert = await this.alertCtrl.create({
     header: header,
     message: message,
     buttons: ['OK']
   });

   await alert.present();
 }

}
