import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ConfigService } from './config/config.service';
import { TomeitoConfig } from './config/model/tomato-config';

class MockConfigService {
  getConfig(): TomeitoConfig {
    return {
      pomodoroMinutes: 10,
      restMinutes: 2,
      beepSoundFilePath: ""
    }
  }
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [ 
        {provide: ConfigService, useClass: MockConfigService}
      ]
    }).compileComponents()
  }))

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it(`should have as title 'Tomeito'`, () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('Tomeito')
  })

  it("clock should be correctly configured when created", () => {
    const fixture = TestBed.createComponent(AppComponent)
    const component = fixture.componentInstance

    expectComponentToBeInInitialStateWithMinutesAndSeconds(component, 10, 0);
  })
})

function expectComponentToBeInInitialStateWithMinutesAndSeconds(component: AppComponent,
  minutes: number, seconds: number) 
{
  expect(component.minutes).toEqual(minutes);
  expect(component.seconds).toEqual(seconds);
  expect(component.isPomodoroRunning).toBeFalse();
  expect(component.startVisible).toBeTrue();
  expect(component.cancelVisible).toBeFalse();
  expect(component.startRestVisible).toBeFalse();
}
