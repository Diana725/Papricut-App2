import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.page.html',
  styleUrls: ['./changepassword.page.scss'],
})
export class ChangepasswordPage implements OnInit {

   ChangePasswordData = { oldpassword:'', password:'', cpassword:'' };

   passwordType: string = 'password';
   newpasswordType: string = 'password';
   confirmpasswordType: string = 'password';

   passwordIcon: string = 'eye-off';
   newpasswordIcon: string = 'eye-off';
   confirmpasswordIcon: string = 'eye-off';

   hasClick:any = false;

   data:any;

  constructor(
    private apiService: ApiService,
    private networkService: NetworkService,
    private router: Router,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl:AlertController
  ) { }

  ngOnInit() {
  }

  hideShowPassword() {
     this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
     this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  newhideShowPassword() {
    this.newpasswordType = this.newpasswordType === 'text' ? 'password' : 'text';
    this.newpasswordIcon = this.newpasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  confirmhideShowPassword() {
    this.confirmpasswordType = this.confirmpasswordType === 'text' ? 'password' : 'text';
    this.confirmpasswordIcon = this.confirmpasswordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }

  ActionChangePassword() {

      if(navigator.onLine !== true) {
        this.presentAlert('No Internet Connection!',"Please put Internet Connection ON and try again");
      }
      else if (this.ChangePasswordData.oldpassword === "" || this.ChangePasswordData.password === "" || this.ChangePasswordData.cpassword === "") {
      this.presentAlert('',"All fields must be filled");
        }
        else if (this.ChangePasswordData.password !== this.ChangePasswordData.cpassword) {
        this.presentAlert('',"Password fields do not match");
        }
        else {

          this.hasClick = true;

          this.apiService.changePassword(this.ChangePasswordData).then((result) => {
            this.hasClick = false;
            this.data = result;
            //console.log("brian-----"+JSON.stringify(this.data));
            let status_code = this.data.status_code;
            let message = this.data.message;
            if(status_code == 1) {
              this.router.navigate(['/signin']);
              this.presentAlert('',message);
              this.apiService.logout();
            }
            else {
              this.presentAlert('',message);
            }

          }, (err) => {
            this.hasClick = false;
            this.presentAlert('',"Sorry, we are experiencing a technical challenge");
          });

  }
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
