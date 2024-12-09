import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { OtherService } from '../services/other.service';
import { NetworkService } from '../services/network.service';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ToastController, NavController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  API_URL = environment.API_URL;

  photo:any;
  photoData:any;

  formData: FormData = new FormData();

  RegisterData = {
    first_name:'',
    last_name:'',
    phone_number:'',
    whatsapp_number:'',
    email:'',
    countryId:'',
    cityId:'',
    bio:'',
    password:'',
    password_confirmation:'',
    categoryId:''
  };

  loading:any;
  data:any;

  apiLoader:boolean = false;

  countries:any[] = [];
  cities:any[] = [];
  categories:any[]=[];

  hasClick:any = false;

  accountType:any;

  constructor(
    private navCrtl: NavController,
    public alertCtrl: AlertController,
    private toastController: ToastController,
    public storage: Storage,
    private apiService: ApiService,
    public otherService : OtherService,
    private networkService: NetworkService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {

    this.otherService.statusBar("#d1378c",1);

   }

  ngOnInit() {

    // Retrieve the parameters from the route
    this.route.queryParams.subscribe(_p => {
      const navParams = this.router.getCurrentNavigation()?.extras.state;
      //console.log('Received parameters:', navParams); // Log received parameters
      if (navParams) {

        this.accountType = navParams['accountType'];

      }
    });

    this.getCountries();
    this.getCategories();
  }

   getCategories(){
   this.apiService.getCategories()
   .then(result => {
     this.data = result;
     this.categories = this.data.result;
   });
   }

  ActionSubmit() {

  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(navigator.onLine !== true || this.networkService.checkInternetConnection() == 0) {
        this.presentAlert('No Internet Connection!',"Please put Internet Connection ON and try again");
  }
  else if (this.RegisterData.email === "") {
    this.presentAlert('',"Please enter your email address");
  }
  else if(!re.test(this.RegisterData.email)) {
    this.presentAlert('',"Invalid email address");
  }
  else if (this.RegisterData.first_name === "") {
    this.presentAlert('',"Please enter your first name");
  }
  else if (this.RegisterData.last_name === "") {
    this.presentAlert('',"Please enter your last name");
  }
  else if (this.RegisterData.phone_number === "") {
    this.presentAlert('',"Please enter your mobile number");
  }
  else if (this.RegisterData.password === "") {
    this.presentAlert('',"Please enter your preferred password");
  }
  else if (this.RegisterData.password != this.RegisterData.password_confirmation) {
    this.presentAlert('',"Password and confirm password fields must match");
  }
  // else if (this.RegisterData.bio === "") {
  //   this.presentAlert('',"Please enter a bief description about yourself");
  // }
  // else if (this.RegisterData.categoryId === "") {
  //   this.presentAlert('',"Please select a category");
  // }
  else {

    // if(this.accountType == "Photographer") {
    //   if (this.RegisterData.categoryId === "") {
    //     this.presentAlert('',"Please select a category");
    //     return false;
    //    }
    // }

  if(this.photoData != null && this.photoData != undefined) {
    const file = this.photoData;
    let f = file;
    f.name = Date.now() + '.' + file.type.split('/')[1];
    this.formData.append('image', f, Date.now() + '.' + file.type.split('/')[1]);
  }

  this.formData.append("phone_number", this.RegisterData.phone_number);
  this.formData.append("whatsapp_number", this.RegisterData.whatsapp_number);
  this.formData.append("first_name", this.RegisterData.first_name);
  this.formData.append("last_name", this.RegisterData.last_name);
  this.formData.append("email", this.RegisterData.email);
  this.formData.append("countryId", this.RegisterData.countryId);
  this.formData.append("cityId", this.RegisterData.cityId);
  this.formData.append("bio", this.RegisterData.bio);
  this.formData.append("password", this.RegisterData.password);
  this.formData.append("password_confirmation", this.RegisterData.password_confirmation);
  this.formData.append("categoryId", this.RegisterData.categoryId);
  const accessToken = localStorage.getItem("PapricutAccessToken");
  if (accessToken !== null) {
      this.formData.append("accessToken", accessToken);
  }

  if(this.accountType == "Photographer") {
    this.formData.append("user_type","3");
  }
  else {
    this.formData.append("user_type","4");
  }

  this.hasClick = true;
  this.http.post(this.API_URL+'registerMobile', this.formData).subscribe((response: any) => {

  this.hasClick = false;

  let resStr = JSON.stringify(response);
  let resJSON = JSON.parse(resStr);

  if(resJSON.code == 1) {
    this.deleteAll();
    this.presentAlertWithDismiss("",resJSON.message);
  }
  else {
    this.toast(resJSON.message);
  }

}, error => {
  this.hasClick = false;
  this.presentAlert("",error.message);
});

  //   this.apiService.register(this.RegisterData).then((result:any) => {
  //   this.hasClick = false;
  //   this.data = result;
  //
  //   let code = this.data.code;
  //   let message = this.data.message;
  //
  //   if(code == 1) {
  //
  //     this.presentAlertWithDismiss("",message);
  //
  //   }
  //   else {
  //     this.presentAlert("",message);
  //   }
  //
  // }, (err:any) => {
  //   this.hasClick = false;
  //   this.presentAlert("",err.error.message);
  // });

  }

  }


  async takePicture() {
      try {
        const image = await Camera.getPhoto({
          quality: 90,
          height: 500,
          width: 500,
          allowEditing: false,
          correctOrientation: true,
          resultType: CameraResultType.Base64,
          source: CameraSource.Prompt
        });

        if (image && image.base64String) { // Ensure image and base64String are defined
          // Add the compressed image to selectedPhotos array for display
          this.photo = 'data:image/jpeg;base64,' + image.base64String;

          // Compress the captured image
          const compressedBase64 = await this.compressPhoto(image.base64String, 500, 500);

          // Convert base64 string to Blob
          const byteCharacters = atob(compressedBase64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });

          // Add the compressed image Blob to photoDataArray
          this.photoData = blob;
        } else {
          //console.error('Web path for the captured image is undefined or base64String is missing.');
          // Handle this case (e.g., show an error message to the user)
          this.toast('Failed to get photo, please try again');
        }
      } catch (error) {
        //console.error('Error capturing photo:', error);
        // Handle the error (e.g., display an error message to the user)
        this.toast('No photo was captured. Please try again.');
      }
    }


      async compressPhoto(base64Data: string, maxWidth: number, maxHeight: number): Promise<string> {
    const img = new Image();
    img.src = 'data:image/jpeg;base64,' + base64Data;

    await new Promise((resolve, reject) => {
      img.onload = () => resolve(undefined); // Pass undefined to resolve since we don't need to pass any arguments
      img.onerror = error => reject(error);
    });

    const scaleFactor = Math.min(maxWidth / img.width, maxHeight / img.height);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = img.width * scaleFactor;
    canvas.height = img.height * scaleFactor;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6); // Adjust quality as needed
    return compressedBase64.replace('data:image/jpeg;base64,', '');
    }

    delete_IMAGE() {
      this.photo = null;
      this.photoData = null;
    }

    deleteAll() {

      this.photo = null;
      this.photoData = null;

      this.RegisterData = {
      first_name:'',
      last_name:'',
      phone_number:'',
      whatsapp_number:'',
      email:'',
      countryId:'',
      cityId:'',
      bio:'',
      password:'',
      password_confirmation:'',
      categoryId:''
    };

    }

  openSignin() {
    //this.router.navigate(['/signin']);
    this.apiService.openLink('https://papricut.com/login');
  }

  terms() {
    this.apiService.openLink('https://papricut.com/terms-of-use');
  }

  privacy() {
    this.apiService.openLink('https://papricut.com/privacy_policy');
  }

  goToBack () {
    this.navCrtl.back();
  }

  countryEvent(event: CustomEvent) {
    this.getCities(event.detail.value);
  }

  getCountries(){
  this.apiService.loadCountries()
  .then(result => {
    this.data = result;
    this.countries = this.data.result;
  });
  }

  getCities(countryId:any){
  this.apiLoader = true;
  this.apiService.loadCities(countryId)
  .then(result => {
    this.apiLoader = false;
    this.data = result;
    this.cities = this.data.result;
  });
  }

  adjustTextarea(event: Event) {
  const textarea = event.target as HTMLTextAreaElement;
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

async presentAlertWithDismiss(alerttitle: any, alertcontent: any) {
  const alert = await this.alertCtrl.create({
    header: alerttitle,
    message: alertcontent,
    backdropDismiss: false, // Prevent dismissing by tapping on backdrop
    buttons: [
      {
        text: 'Login',
        handler: () => {
          // Add any dismissal logic here if needed
          this.openSignin();
        }
      }
    ]
  });
  await alert.present();
}


  async presentAlert(alerttitle:any,alertcontent:any) {
    const alert = await this.alertCtrl.create({
      header: alerttitle,
      message: alertcontent,
      buttons: ['Ok']
    });
    await alert.present();
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

}
