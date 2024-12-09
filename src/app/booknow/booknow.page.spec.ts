import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BooknowPage } from './booknow.page';

describe('BooknowPage', () => {
  let component: BooknowPage;
  let fixture: ComponentFixture<BooknowPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BooknowPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
