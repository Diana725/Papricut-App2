import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FilterbookingsPage } from './filterbookings.page';

describe('FilterbookingsPage', () => {
  let component: FilterbookingsPage;
  let fixture: ComponentFixture<FilterbookingsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(FilterbookingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
