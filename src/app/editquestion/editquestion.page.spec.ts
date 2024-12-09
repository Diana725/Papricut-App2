import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditquestionPage } from './editquestion.page';

describe('EditquestionPage', () => {
  let component: EditquestionPage;
  let fixture: ComponentFixture<EditquestionPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EditquestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
