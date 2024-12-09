import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
})
export class BookingPage implements OnInit {

  item:any;
  rights_group = '0';

  constructor(
    private navCtrl: NavController,
    private alertCtrl:AlertController,
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private networkService: NetworkService
  ) { }

  ngOnInit() {
    this.rights_group = localStorage.getItem("PapricutRightsGroup") || '';
    // Retrieve the parameters from the route
    this.route.queryParams.subscribe(_p => {
      const navParams = this.router.getCurrentNavigation()?.extras.state;
      //console.log('Received parameters:', navParams); // Log received parameters
      if (navParams) {

        this.item = navParams['result'];
        //console.log('this.item----'+JSON.stringify(this.item));

      }
    });
  }

  styleGuide() {
    window.open(this.item.styleGuide, '_blank');
  }

  invoice() {
    window.open(this.item.invoice, '_blank');
  }

}
