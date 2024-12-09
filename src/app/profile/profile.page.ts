import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { NavController, LoadingController, AlertController, ActionSheetController, ToastController, Platform } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';
//import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { environment } from 'src/environments/environment';
import {
  API_ERROR_TITLE,
  API_ERROR_MESSAGE
} from '../constants';
import * as moment from 'moment';
import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { DataService } from '../services/data.service';
import { DataModel } from '../models/data.model';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, AfterViewInit {

  @ViewChild('descriptionTextarea') descriptionTextarea!: HTMLIonTextareaElement;

  //@ViewChild('fileInput') fileInput: any;

  API_URL = environment.API_URL;
  PUBLIC_URL = environment.PUBLIC_URL;

  ProfileData = {
    email:'',
    first_name:'',
    last_name:'',
    phone_number:'',
    whatsapp_number:'',
    country_id:'',
    city_id:'',
    category:'',
    bio:''
  };

  fileArray: Array<{ displayFile: any; fileExt: any; base64File: string, type:string }> = [];

  profilePic:any;
  photoData:any;
  email:any;
  first_name:any;
  last_name:any;
  country_id:any;
  city_id:any;
  category:any;
  phone_number:any;

  data:any;
  loading:any;

  base64Image: string = '';
  fileImage: string = '';
  public responseData: any;
  userData = { imageB64: "" };

  apiLoader:boolean = false;

  list:any[]=[];

  errorMessage: string='';
  page = 1;
  perPage = 0;
  totalData = 0;
  totalPage = 0;
  nodataavailable:boolean = false;
  notificationsCount = 0;

  coverPhoto:any;

  followersCount = 0;
  followingCount = 0;
  likesCount = 0;
  savedCount = 0;

  hasClick:any = false;

  countries:any[] = [];
  cities:any[] = [];
  categories:any[] = [];

  constructor(
    private ngZone: NgZone,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private dataService: DataService,
    private http: HttpClient,
    private apiService: ApiService,
    private networkService: NetworkService,
    private router: Router,
    private navCtrl: NavController,
    private alertCtrl:AlertController,
    private actionSheetCtrl: ActionSheetController,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    //this.profilePic=this.sanatizeBase64Image('../assets/imgs/avatar.png');

    this.ProfileData.first_name = localStorage.getItem('Papricutcustomerfirstname') ?? '';
    this.profilePic = localStorage.getItem('Papricutcustomerprofilepic') ?? '../assets/imgs/profile.png';
    this.ProfileData.last_name = localStorage.getItem('Papricutcustomerlastname') ?? '';
    this.ProfileData.email = localStorage.getItem('Papricutcustomeremail') ?? '';
    this.ProfileData.phone_number = localStorage.getItem('Papricutcustomerphone_number') ?? '';
    this.ProfileData.whatsapp_number = localStorage.getItem('Papricutcustomerwhatsapp_number') ?? '';
    this.ProfileData.city_id = localStorage.getItem('Papricutcustomercity_id') ?? '';
    this.ProfileData.country_id = localStorage.getItem('Papricutcustomercountry_id') ?? '';
    this.ProfileData.category = localStorage.getItem('Papricutcustomercategory') ?? '';
    //this.ProfileData.bio = localStorage.getItem('Papricutcustomercategory') ?? '';

    this.getProfile();

  }

  countryEvent(event: CustomEvent) {
    this.getCities(event.detail.value);
  }

 //  getCountries(){
 //    if(navigator.onLine !== true || this.networkService.checkInternetConnection() == 0) {
 //        this.presentAlert('No Internet Connection!',"Please put Internet Connection ON and try again");
 //      } else {
 //  this.apiService.loadCountries()
 //  .then(result => {
 //    this.data = result;
 //    this.countries = this.data.result;
 //  });
 // }
 //  }

  getCities(country:any){
  this.apiLoader = true;
  this.apiService.loadCities(country)
  .then(result => {
    this.apiLoader = false;
    this.data = result;
    this.cities = this.data.result;

    this.ProfileData.city_id = this.ProfileData.city_id.toString();
     // Trigger change detection to update the UI
     this.ngZone.run(() => {});

  });
  }

  updateProfile() {

  //var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(navigator.onLine !== true) {
    this.presentAlert('','Internet Connection',"Please put data connection on and try again");
  }
  else if (this.ProfileData.first_name === "") {
    this.presentAlert('','',"Enter your First Name");
  }
  else if (this.ProfileData.last_name === "") {
    this.presentAlert('','',"Enter your Last Name");
  }
  else if (this.ProfileData.email === "") {
    this.presentAlert('','',"Enter your Email Address");
  }
  else if (this.ProfileData.phone_number === "") {
    this.presentAlert('','',"Enter your Mobile Number");
  }
  else if (this.ProfileData.whatsapp_number === "") {
    this.presentAlert('','',"Enter your WhatsApp Number");
  }
  else if (this.ProfileData.country_id === "") {
    this.presentAlert('','',"Select your country");
  }
  else if (this.ProfileData.city_id === "") {
    this.presentAlert('','',"Select your city");
  }
  else if (this.ProfileData.category === "") {
    this.presentAlert('','',"Select your category");
  }
  else {

  this.hasClick = true;

  this.apiService.updatePhotographerProfile(this.ProfileData).then((result:any) => {

    this.hasClick = false;

    this.data = result;
    //let status_code = this.data.code;

    if(this.data.code == 1) {
      // this.events.publish('first_name:last_name', this.ProfileData.first_name, this.ProfileData.last_name);
      // this.events.publish('email:profilePic', this.ProfileData.email, this.profilePic);

      this.getProfile();

      this.navCtrl.back();

    }

    this.presentAlert('','',this.data.message);

  }, (err:any) => {
    this.hasClick = false;
    this.presentAlert("","","Request not sent. Please try again");
  });

  }
  }

//   async getPhoto(){
//           var buttons=[
//             {
//               text: 'From Camera',
//               handler: () => {
//                 this.takePhoto(this.camera.PictureSourceType.CAMERA,this.camera.DestinationType.FILE_URI);
//               }
//             },{
//               text: 'From Gallery',
//               handler: () => {
//                    this.triggerFileInput();
//                   //this.takePhoto(this.camera.PictureSourceType.PHOTOLIBRARY,this.camera.DestinationType.DATA_URL);
//               }
//             },{
//               text: 'Cancel',
//               role: 'cancel',
//               handler: () => {}
//             }
//
//           ]
//           // if(this.photo!=this.sanatizeBase64Image('assets/imgs/placeholder.jpg')){
//           //   let butttondelete={text:'Delete',handler:()=>{this.delete_image()}}
//           //   buttons.push(butttondelete)
//           // }
//           const actionSheet = await this.actionSheetCtrl.create({
//           header: 'Actions',
//           buttons: buttons
//         });
//         await actionSheet.present();
//       }
//
//       // delete_image(){
//       //     this.profilePic=this.sanatizeBase64Image('assets/imgs/profile.png');
//       // }
//
      sanatizeBase64Image(image:any) {
      // if(image) {
         return this.sanitizer.bypassSecurityTrustResourceUrl(image);
      // }
    }

async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Prompt
    });

    if (image.webPath) {
      this.profilePic = image.webPath;
      this.photoData = await fetch(image.webPath).then(r => r.blob());
      this.uploadProfilePhoto();
    } else {
      console.error('Web path for the captured image is undefined.');
      // Handle this case (e.g., show an error message to the user)
      this.toast('Failed to get file, please try again');
    }

    // if (Capacitor.getPlatform() !== 'web') {
    //   this.uploadImages(this.photo)
    // }
  }

  async uploadProfilePhoto() {

    const formData = new FormData();

    if(this.photoData != null && this.photoData != undefined) {
      const file = this.photoData;
      let f = file;
      f.name = Date.now() + '.' + file.type.split('/')[1];
      formData.append('file', f, Date.now() + '.' + file.type.split('/')[1]);
    }

    const accessToken = localStorage.getItem("PapricutAccessToken");
    if (accessToken !== null) {
        formData.append("accessToken", accessToken);
    }

    this.hasClick = true;
    this.http.post(this.API_URL+'editProfilePic', formData).subscribe((response: any) => {

    this.hasClick = false;

    let resStr = JSON.stringify(response);
    let resJSON = JSON.parse(resStr);

    this.toast(resJSON.message);

  }, error => {
    this.hasClick = false;
    this.presentAlert("", API_ERROR_TITLE, API_ERROR_MESSAGE);
  });
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

  getProfile() {
    if(navigator.onLine !== true) {
      this.presentAlert('','No Internet Connection!',"Please put Internet Connection ON and try again");
    }
    else {

      this.apiLoader = true;

      this.apiService.getPhotographerProfile()
      .then(result => {
       this.data = result;
       this.apiLoader = false;
       //console.log('profile---'+JSON.stringify(this.data.result.userDetails));

       this.ProfileData.first_name = this.data.result.userDetails.first_name;
       if(this.data.result.userDetails.image_url) {
         this.profilePic = this.PUBLIC_URL+this.data.result.userDetails.image_url;
       }
       this.ProfileData.last_name = this.data.result.userDetails.last_name;
       this.ProfileData.email = this.data.result.userDetails.email;
       this.ProfileData.phone_number = this.data.result.userDetails.phone_number;
       this.ProfileData.whatsapp_number = this.data.result.userDetails.whatsapp_number;
       this.ProfileData.bio = this.data.result.userDetails.bio;

       this.countries = this.data.result.countries;
       this.categories = this.data.result.categories;

       if(this.data.result.userDetails.city_id) {
         this.ProfileData.city_id = this.data.result.userDetails.city_id.toString();
       }

       if(this.data.result.userDetails.country_id) {
         this.ProfileData.country_id = this.data.result.userDetails.country_id.toString();
         this.getCities(this.ProfileData.country_id);
       }

       if(this.data.result.userDetails.category_id) {
         this.ProfileData.category = this.data.result.userDetails.category_id.toString();
       }
        // Trigger change detection to update the UI
        this.ngZone.run(() => {});

       localStorage.setItem('Papricutcustomerfirstname',this.ProfileData.first_name);
       localStorage.setItem('Papricutcustomerlastname',this.ProfileData.last_name);
       localStorage.setItem('Papricutcustomerprofilepic',this.profilePic);

      });

    }
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

  ngAfterViewInit() {
      // Automatically adjust textarea height after view initialization
      this.descriptionTextarea.getInputElement().then((textarea: HTMLTextAreaElement) => {
        this.adjustTextareaDirect(textarea);
      });

    }

    adjustTextarea(event: Event) {
      const textarea = event.target as HTMLTextAreaElement;
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }

    adjustTextareaDirect(textarea: HTMLTextAreaElement) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }

}
