import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, ToastController, PopoverController } from '@ionic/angular';
import { ApiService } from '../services/api.service';
import { OtherService } from '../services/other.service';
import { NetworkService } from '../services/network.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
//import { phoneNumbers } from '../../assets/data/phone-numbers';

@Component({
  selector: 'app-booknow',
  templateUrl: './booknow.page.html',
  styleUrls: ['./booknow.page.scss'],
})
export class BooknowPage implements OnInit {

  apiLoader:boolean = false;
  data:any;

  currentStep: number = 1;

  skills = [
    { label: 'Photographer', selected: false },
    { label: 'Videographer', selected: false },
    { label: 'Photography Director', selected: false },
    { label: 'Lighting Director', selected: false },
    { label: 'Sound Technician', selected: false },
    { label: 'Production Assistant', selected: false },
    { label: 'Other', selected: false },
  ];
  selectedskills: string[] = [];

  equipment!: string;

  nature = [
    { label: 'Event shoot', selected: false },
    { label: 'Real estate shoot', selected: false },
    { label: 'Lifestyle shoot', selected: false },
    { label: 'Interviews', selected: false },
    { label: 'Portraits/headshots', selected: false },
    { label: 'Drone shoot', selected: false },
    { label: 'Film / drama production', selected: false },
    { label: 'Documentary production', selected: false },
    { label: 'Other', selected: false },
  ];
  selectednature: string[] = [];

  filmingLocations!: string;

  countries:any[] = [];
  cities:any[] = [];

  filmingLocationsDetails!: string;

  outputFormatOptions = [
    { label: 'Raw footage', selected: false },
    { label: 'Rough cut of raw footage', selected: false },
    { label: 'Final cut fully edited (not branded)', selected: false },
    { label: 'Fully edited and branded', selected: false },
    { label: 'TV broadcast quality', selected: false },
    { label: 'Instagram use', selected: false },
    { label: 'YouTube use', selected: false },
    { label: 'TV broadcast use', selected: false },
  ];
  outputFormat: string[] = [];

  PostData = {
    country:'',
    city:'',
    start_date:'',
    end_date:'',
    details:'',
    first_name:'',
    last_name:'',
    email:'',
    phone_number:'',
    company:'',
    company_designation:''
  };

  hasClick:any = false;

  constructor(
    private toastController: ToastController,
    private navCtrl: NavController,
    private alertCtrl:AlertController,
    private router: Router,
    private apiService: ApiService,
    public otherService : OtherService,
    private networkService: NetworkService,
    private popoverController: PopoverController
  ) {
    this.otherService.statusBar("#d1378c",1);
  }

  ngOnInit() {
    this.PostData.start_date = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.PostData.end_date = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
    this.getCountries();
  }

  updateCrewCoreSkillSelection(option: any) {
  if (option.selected) {
    // Add to the array when selected
    this.selectedskills.push(option.label);
    //console.log('Selected selectedskills:', this.selectedskills);
  } else {
    // Remove from the array when deselected
    const index = this.selectedskills.indexOf(option.label);
    if (index !== -1) {
      this.selectedskills.splice(index, 1);
      //console.log('Selected selectedskills:', this.selectedskills);
    }
  }
}


updateNatureOfShootSelection(option: any) {
if (option.selected) {
  // Add to the array when selected
  this.selectednature.push(option.label);
  //console.log('Selected selectednature:', this.selectednature);
} else {
  // Remove from the array when deselected
  const index = this.selectednature.indexOf(option.label);
  if (index !== -1) {
    this.selectednature.splice(index, 1);
    //console.log('Selected selectednature:', this.selectednature);
  }
}
}

updateFilmingFormatSelection(option: any) {
if (option.selected) {
  // Add to the array when selected
  this.outputFormat.push(option.label);
  //console.log('Selected outputFormat:', this.outputFormat);
} else {
  // Remove from the array when deselected
  const index = this.outputFormat.indexOf(option.label);
  if (index !== -1) {
    this.outputFormat.splice(index, 1);
    //console.log('Selected outputFormat:', this.outputFormat);
  }
}
}

  handlestart_dateChange(event: any) {
      this.PostData.start_date = formatDate(event.detail.value, 'yyyy-MM-dd', 'en-US');
      //console.log('Selected start_date:', this.PostData.start_date);
      // Dismiss the popover
      this.popoverController.dismiss();
  }

  handleend_dateChange(event: any) {
      this.PostData.end_date = formatDate(event.detail.value, 'yyyy-MM-dd', 'en-US');//yyyy-MM-ddTHH:mm:ss
      // Dismiss the popover
      this.popoverController.dismiss();
  }

  popoverDismissed() {
        // Optional: Handle any logic when the popover is dismissed
  }

  openTab(currentStep:any) {
    this.currentStep = currentStep;
  }

  // Function to navigate to the next step
  goToNextStep() {
    if(this.currentStep === 1) {
      if(this.selectedskills.length == 0) {
        this.toast('Please select the core skill(s) required for the crew');
      }
      else if(this.equipment == undefined) {
        this.toast('Please specify if the crew should have their own equipment');
      }
      else {
        this.currentStep++;
      }
    }
    else if(this.currentStep === 2) {
      if(this.selectednature.length == 0) {
        this.toast('Please select the nature of the shoot');
      }
      else if(this.filmingLocations == undefined) {
        this.toast('Please specify the number of filming locations');
      }
      else {
        this.currentStep++;
      }
    }
    else if(this.currentStep === 3) {
      const startDate = new Date(this.PostData.start_date);
      const endDate = new Date(this.PostData.end_date);
      if(this.PostData.country == "") {
        this.toast('Please select your country');
      }
      // else if(this.PostData.city == "") {
      //   this.toast('Please select your city');
      // }
      else if(this.filmingLocationsDetails == undefined) {
        this.toast('Please specify if there are other filming locations');
      }
      else if(this.PostData.start_date == "") {
        this.toast('Please select the first day of filming');
      }
      else if(this.PostData.end_date == "") {
        this.toast('Please select the last day of filming');
      }
      else if(endDate < startDate) {
        this.toast('Please select a valid end date. Last day of filming must be same or greater than start date of filming');
      }
      else {
        this.currentStep++;
      }
    }
    else if(this.currentStep === 4) {
      if(this.outputFormat.length == 0) {
        this.toast('Please select your preferred formats of the filmed files');
      }
      // else if(this.PostData.details == "") {
      //   this.toast('Please enter any additional, relevant or important information');
      // }
      else {
        this.currentStep++;
      }
    }
  }

  // Function to navigate to the previous step
  goToPreviousStep() {
    this.currentStep--;
  }

  // Function to submit the registration form
  ActionSubmit() {

  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if(navigator.onLine !== true || this.networkService.checkInternetConnection() == 0) {
      this.presentAlert('No Internet Connection!',"Please put Internet Connection ON and try again");
    }
    else if (this.PostData.email === "") {
    this.presentAlert('',"Please enter your email address");
  }
  else if(!re.test(this.PostData.email)) {
    this.presentAlert('',"Invalid email address");
  }
  else if (this.PostData.first_name === "") {
    this.presentAlert('',"Please enter your first name");
  }
  else if (this.PostData.last_name === "") {
    this.presentAlert('',"Please enter your last name");
  }
  else if (this.PostData.phone_number === "") {
    this.presentAlert('',"Please enter your mobile number");
  }
  // else if (this.PostData.company === "") {
  //   this.presentAlert('',"Please enter your company name");
  // }
  // else if (this.PostData.company_designation === "") {
  //   this.presentAlert('',"Please enter your designation in your company");
  // }
  else {

    this.hasClick = true;

    this.apiService.bookNow(
      this.PostData,
      this.outputFormat,
      this.filmingLocationsDetails,
      this.filmingLocations,
      this.selectednature,
      this.equipment,
      this.selectedskills
    ).then((result:any) => {
    this.hasClick = false;
    this.data = result;

    let code = this.data.code;
    let message = this.data.message;

    if(code == 1) {
      this.deleteAll();
      this.navCtrl.back();
      //this.presentAlertWithDismiss("",message);
    }
    
    this.presentAlert("",message);

  }, (err:any) => {
    this.hasClick = false;
    this.presentAlert("",err.error.message);
  });

  }

  }

  deleteAll() {

    this.selectedskills = [];

    this.equipment = "";
    this.selectednature = [];

    this.filmingLocations = "";
    this.filmingLocationsDetails = "";
    this.outputFormat = [];

    this.PostData = {
      country:'',
      city:'',
      start_date:'',
      end_date:'',
      details:'',
      first_name:'',
      last_name:'',
      email:'',
      phone_number:'',
      company:'',
      company_designation:''
    };

  }

openSignin() {
  //this.router.navigate(['/signin']);
  this.apiService.openLink('https://papricut.com/login');
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

async presentAlert(header:any,message:any) {
  const alert = await this.alertCtrl.create({
    header: header,
    message: message,
    buttons: ['OK']
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
