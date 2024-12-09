import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NavController, AlertController, ModalController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { NetworkService } from '../services/network.service';
import { FilterbookingsPage } from '../filterbookings/filterbookings.page';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.page.html',
  styleUrls: ['./bookings.page.scss'],
})
export class BookingsPage implements OnInit {

  list:any[]=[];
  years:any[]=[];

    loading:any;
    data: any;
    errorMessage: string='';
    page = 1;
    perPage = 0;
    totalData = 0;
    totalPage = 0;
    nodataavailable:boolean = false;
    apiLoader:boolean = false;

    pageName:string="bookings";

    status:string='';
    selectedSegment:string='';

    rights_group = '0';

    year = null;
    city_id = null;
    country_id = null;

  constructor(
    private modalCtrl: ModalController,
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
      if (navParams && navParams['status'] !== undefined) {

        this.selectedSegment = navParams['status'];
        this.status = navParams['status'];
        //console.log('this.status----'+this.status);
        this.loadList();

      }
    });
  }

  segmentChanged(event: any) {
    this.status = event.detail.value; // Get the selected segment value
    //console.log('Selected Value:', this.status);
    // Add your logic here to handle the selected value
    this.loadList();
  }

  ionViewDidEnter() {
    this.loadList();
  }

  doRefresh(event: CustomEvent): void {
    this.page = 1;
    this.loadList();
    if (event) {
      event.detail.complete();
    }
  }

  loadList() {
      if(navigator.onLine !== true) {
        this.presentAlert('No Internet Connection!',"Please put Internet Connection ON and try again");
      }
      else {
        this.apiLoader = true;
    this.apiService.getBookings(this.page,this.status,this.year,this.city_id,this.country_id)
       .then(
         res => {
           this.apiLoader = false;
           this.data = res;
           //console.log("getBookings --"+JSON.stringify(this.data.result.data));
           this.list = this.data.result.data;
           this.perPage = this.data.result.per_page;
           this.totalData = this.data.result.total;
           this.totalPage = this.data.result.total_pages;

           this.years = this.data.result.years;

           //this.status = this.selectedSegment;

           if(this.data.result.total == 0) {
             this.nodataavailable = true;
           }
           else {
             this.nodataavailable = false;
           }
         }, error => {
          //console.log("Okay error while fetching data");
          this.apiLoader = false;
          this.errorMessage = <any>error
        });
  }
}

  doInfinite(infiniteScroll: any) {
  // Increment page number
  this.page++;

  // Simulate loading delay for better user experience
  setTimeout(() => {
      this.apiService.getBookings(this.page,this.status,this.year,this.city_id,this.country_id)
          .then(
              (res: any) => { // Explicitly type 'res' as 'any' or provide the correct type
                  // Concatenate new data to the existing list
                  this.list = this.list.concat(res.result.data);

                  // Update pagination variables
                  this.perPage = res.result.per_page;
                  this.totalData = res.result.total;
                  this.totalPage = res.result.total_pages;

                  // Complete infinite scroll
                  infiniteScroll.target.complete();

                  // Check if all data has been loaded
                  if (this.page >= this.totalPage) {
                      infiniteScroll.target.disabled = true;
                  }
              },
              error => {
                  console.error("Error while fetching data:", error);
                  // Handle error gracefully, optionally display an error message
                  // Hide loading indicator or show an error message
                  infiniteScroll.target.complete();
              }
          );
  }, 100); // Simulated loading delay
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

booking(event: Event, item: any) {
  const params = { result: item };
  this.navCtrl.navigateForward('/booking', { state: params });
}

async filters() {

        const modal = await this.modalCtrl.create({
          component: FilterbookingsPage,
          animated:true,
          // mode:'ios',
          componentProps: {
            years: this.years,
            param2: 'value2'
          }
        });

        modal.onDidDismiss().then((dataReturned:any) => {
          // This will execute when the modal is dismissed and data is passed back
          if (dataReturned !== null) {
            console.log('Modal data:', dataReturned.data);

            if(dataReturned.data.filtered == 1) {
              this.page = 1;
              this.country_id = dataReturned.data.country_id;
              this.city_id = dataReturned.data.city_id;
              this.year = dataReturned.data.year;
              this.loadList();
            }

          }
        });

         return await modal.present();
      }

}
