import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-editquestion',
  templateUrl: './editquestion.page.html',
  styleUrls: ['./editquestion.page.scss'],
})
export class EditquestionPage implements OnInit, AfterViewInit {

  @ViewChild('descriptionTextarea') descriptionTextarea!: HTMLIonTextareaElement;

    data: any;

    hasClick:any = false;

    PostData = { question:'', id:'' };

    itemDetails:any;

  constructor(
    private navCtrl: NavController,
    private alertCtrl:AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private networkService: NetworkService
  ) { }

  ngOnInit() {
    // Retrieve the parameters from the route
    this.route.queryParams.subscribe(_p => {
      const navParams = this.router.getCurrentNavigation()?.extras.state;
      console.log('Received parameters:', navParams); // Log received parameters
      if (navParams) {

        this.itemDetails = navParams['result'];
        console.log('this.itemDetails----'+JSON.stringify(this.itemDetails));
        this.PostData.id = this.itemDetails.id;
        this.PostData.question = this.itemDetails.question;

        //this.loadList();

      }
    });
  }

  postQuestion() {

  if(navigator.onLine !== true) {
    this.presentAlert('Internet Connection',"Please put data connection on and try again");
  }
  else if (this.PostData.question === "") {
    this.presentAlert('',"Enter your question");
  }
  else {

    this.hasClick = true;

    this.apiService.saveCommunityItem(this.PostData).then((result:any) => {
    this.hasClick = false;
    this.data = result;

    if(this.data.code == 1) {
      this.navCtrl.back();
    }

    this.presentAlert('',this.data.message);

    }, (err:any) => {
      this.hasClick = false;
      this.presentAlert("","Request not sent. Please try again");
    });

  }

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
