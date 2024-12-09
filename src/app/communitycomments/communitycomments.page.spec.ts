import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunitycommentsPage } from './communitycomments.page';

describe('CommunitycommentsPage', () => {
  let component: CommunitycommentsPage;
  let fixture: ComponentFixture<CommunitycommentsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CommunitycommentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
