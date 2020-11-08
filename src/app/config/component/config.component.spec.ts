import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms'
import { RouterTestingModule } from '@angular/router/testing'
import { NgxElectronModule } from 'ngx-electron'
import { MaterialModule } from '../../modules/material/material.module'

import { ConfigComponent } from './config.component'


describe('ConfigComponent', () => {
  let component: ConfigComponent
  let fixture: ComponentFixture<ConfigComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigComponent ],
      imports: [NgxElectronModule, RouterTestingModule, FormsModule, MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
