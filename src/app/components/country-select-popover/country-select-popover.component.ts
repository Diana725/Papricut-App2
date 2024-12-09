import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-country-select-popover',
  templateUrl: './country-select-popover.component.html',
  styleUrls: ['./country-select-popover.component.scss'],
})
export class CountrySelectPopoverComponent {
  @Output() countrySelected = new EventEmitter<any>();

  searchTerm: string = '';
  countries = [
    { id: 1, name: 'Country 1' },
    { id: 2, name: 'Country 2' },
    { id: 3, name: 'Country 3' },
    // Add more countries as needed
  ];

  get filteredCountries() {
    return this.countries.filter(country =>
      country.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectCountry(country:any) {
    this.countrySelected.emit(country);
  }
}
