import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { from } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { OtherService } from '../services/other.service';
import { LoadingController, AlertController, NavController } from '@ionic/angular';
//import { StatusBar, Style } from '@capacitor/status-bar';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
})
export class SigninPage {

  itemForm: FormGroup;

  hasClick:any = false;

  constructor(
      public alertCtrl: AlertController,
      public navCtrl: NavController,
      private loadingController: LoadingController,
      private formBuilder: FormBuilder,
      private apiService: ApiService,
      private authService: AuthService,
      public otherService : OtherService,
      private router: Router
    ) {

      //this.otherService.statusBar("#3DBCA5",1);

      // if(this.authService.isAuthenticated()) {
      //   this.router.navigate(['/tabs']);
      // }

      this.itemForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]], // Email field with required and email validators
        password: ['', [Validators.required]] // Password field with required and minLength validators
      });

  }


  // ionViewWillEnter() {
  //   // Change status bar color when entering the specific page
  //   StatusBar.setBackgroundColor({ color: '#FFFFFF' }); // New color for specific page
  // }
  //
  // ionViewWillLeave() {
  //   // Reset status bar color when leaving the specific page
  //   StatusBar.setBackgroundColor({ color: '#3DBCA5' }); // Reset to default color
  // }



  async ActionLogin() {
    if (this.itemForm.valid) {

      //await this.presentLoading(); // Show loader before API call
      this.hasClick = true;

      const email = this.itemForm.value.email;
      const password = this.itemForm.value.password;

      // Call your API service method here, passing email
      from(this.apiService.login(email,password)).subscribe(
        (response: any) => {
          // Handle successful login response
          //this.loadingController.dismiss();
          this.hasClick = false;
          console.log('Login successful:', JSON.stringify(response.result));

          if(response.code == 1) {
            localStorage.setItem("Papricutcustomeremail",response.result.email);

            localStorage.setItem("PapricutAccessToken",response.message);


            //console.log('accessToken--'+localStorage.getItem("PapricutAccessToken"));

            localStorage.setItem("PapricutRightsGroup",response.result.rights_group);
            localStorage.setItem("Papricutcustomerfirstname",response.result.first_name);
            localStorage.setItem("Papricutcustomerlastname",response.result.last_name);
            localStorage.setItem("PapricutcustomermobileNo",response.result.phone_number);
            localStorage.setItem("PapricutisSuper",response.result.isSuper);
            //localStorage.setItem("Papricutcustomeremail",response.result.email);

            this.authService.setAuthenticated();
            this.itemForm.reset();
            this.router.navigate(['/home']);
          }
          else if(response.code == 1) {
            this.presentAlertSignUp(response.message);
          }
          else {
            this.presentAlert("","",response.message);
          }

        },
        (error: any) => {
          // Handle login error
          this.hasClick = false;
          //this.loadingController.dismiss();
          //console.error('Login error:', error);
        }
      );
    }
    else {
      this.presentAlert("","","Please provide valid details");
    }
  }

  async presentAlertSignUp(message:any) {
    let alert = await this.alertCtrl.create({
        header: 'Create Account',
        message: message,
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
            text: 'Sign Up Now',
            handler: () => {
              console.log('Sign up now clicked');
              this.openRegister();
            }
          }
        ]
      });
      await alert.present();
    }

  openRegister() {
    this.navCtrl.navigateForward(['/register']);
  }

  forgotPass() {
    this.navCtrl.navigateForward(['/forgotpass']);
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading...',
      //duration: 2000 // Set a duration or use dismiss method to close it programmatically
    });
    await loading.present();
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
