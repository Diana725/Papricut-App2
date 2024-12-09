import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//import { from } from 'rxjs';
//import { AngularFireAuth } from '@angular/fire/compat/auth';
//import { ModalController } from '@ionic/angular';
//import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { OtherService } from '../services/other.service';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
//import { Location } from "@angular/common";
import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.page.html',
  styleUrls: ['./forgotpass.page.scss'],
})
export class ForgotpassPage implements OnInit {

  //itemForm: FormGroup;

  PostData = { email:'' };

  loading:any;
  data:any;

  hasClick:any = false;

  constructor(
    private navCrtl: NavController,
    private loadingController: LoadingController,
    public alertCtrl: AlertController,
    public storage: Storage,
    private apiService: ApiService,
    public otherService : OtherService,
    private router: Router
  ) {

    //this.otherService.statusBar("#034ea2",1);

   }

  ngOnInit() {
  }

  ActionSubmit() {

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(navigator.onLine === false) {
    console.log("not online")
    this.presentAlert('No Internet Connection!',"Please put data connection on and try again");
  }
  else if (this.PostData.email === "") {
    this.presentAlert('',"Please enter your email address");
  }
  else if(!re.test(this.PostData.email)) {
    this.presentAlert('',"Invalid email address");
  }
  else {

    this.hasClick = true;

    this.apiService.forgotpass(this.PostData).then((result:any) => {
    this.hasClick = false;
    this.data = result;

    let code = this.data.code;
    let message = this.data.message;

    if(code == 1) {

      this.router.navigate(['/signin']);

    }

    this.presentAlert("",message);

  }, (err:any) => {
    this.hasClick = false;
    this.presentAlert("",err.error.message);
  });

  }

  }

  goToBack () {
    this.navCrtl.back();
  }

  async presentAlert(alerttitle:any,alertcontent:any) {
    const alert = await this.alertCtrl.create({
      header: alerttitle,
      message: alertcontent,
      buttons: ['Ok']
    });
    await alert.present();
   }

}
