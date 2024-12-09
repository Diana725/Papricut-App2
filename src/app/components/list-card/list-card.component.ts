import { Component, OnInit, Input, Output, EventEmitter   } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, AlertController, ActionSheetController, ToastController } from '@ionic/angular';
import { ApiService } from '../../services/api.service';
import { NetworkService } from '../../services/network.service';

import {
  API_ERROR_TITLE,
  API_ERROR_MESSAGE
} from '../../constants';

@Component({
  selector: 'app-list-card',
  templateUrl: './list-card.component.html',
  styleUrls: ['./list-card.component.scss']
})
export class ListCardComponent implements OnInit {

  @Input() item: any;
  @Output() remove = new EventEmitter<number>();

  apiLoader: boolean = false;

  data:any;

  constructor(
    private toastController: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private router: Router,
    private apiService: ApiService,
    private networkService: NetworkService
  ) { }

  ngOnInit() {}

  async cardOptions(event: Event, item: any) {
    const buttons = [

    ];

    if (item.canDelete === 1) {
      buttons.push(
        {
          text: 'Edit',
          icon: 'create',
          handler: () => this.editPost(item),
        },
        {
          text: 'Delete',
          icon: 'trash',
          handler: () => this.deleteThis(item),
        }
      );
    }

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Actions',
      buttons,
    });
    await actionSheet.present();
  }

  comments(event: Event, item: any) {
    const params = { result: item };
    this.navCtrl.navigateForward('/communitycomments', { state: params });
  }

  editPost(item: any) {
    const params = { result: item };
      this.navCtrl.navigateForward('/editquestion', { state: params });
  }

  async deleteThis(item: any) {
    const alert = await this.alertCtrl.create({
      header: 'Confirm',
      message: 'Do you want to delete this question?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => this.deleteNow(item),
        },
      ],
    });
    await alert.present();
  }

  deleteNow(item: any) {
    if (this.networkService.checkInternetConnection() === 0) {
      this.presentAlert('', 'No Internet Connection!', "Please put Internet Connection ON and try again");
    } else {
      this.apiLoader = true;

      this.apiService.deleteCommunityItem(item.id).then(
        (result: any) => {
          this.apiLoader = false;
          this.data = result;
          this.remove.emit(this.item.id); // Emit the id of the item to be removed
          this.presentAlert('','',this.data.message);
        },
        (err: any) => {
          this.apiLoader = false;
          this.presentAlert("", "", "Request not sent. Please try again later");
        }
      );
    }
  }

  // trimString(string:any) {
  //   return this.apiService.trimString(string);
  // }

  async presentAlert(header: string, subHeader: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      subHeader,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
