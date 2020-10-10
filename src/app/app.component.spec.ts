import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { ConfigService } from './config/config.service';
import { TomeitoConfig } from './config/model/tomato-config';
import { IntervalService } from './interval/interval.service';

class MockConfigService {
  getConfig(): TomeitoConfig {
    return {
      pomodoroMinutes: 10,
      restMinutes: 2,
      beepSoundFilePath: ""
    }
  }
}

class MockIntervalService {
  stopCalled: boolean = false
  func: () => any

  constructor() {
  }

  startPeriodicExecution(func: () => any) {
    this.func = func
    func()
  }

  stopPeriodicExecution() {
    this.stopCalled = true
  }

  executeIntervalNumberOfTimes(n: number) {
    for(let i = 0; i < n; i++)
      this.func()
  }
}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>
  let component: AppComponent
  let mockIntervalService: MockIntervalService

  beforeEach(async(() => {
    mockIntervalService = new MockIntervalService()

    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      providers: [ 
        {provide: ConfigService, useClass: MockConfigService},
        {provide: IntervalService, useValue: mockIntervalService}
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create the app', () => {
    expect(component).toBeTruthy()
  })

  it(`should have as title 'Tomeito'`, () => {
    expect(component.title).toEqual('Tomeito')
  })

  it("clock should be correctly configured when created", () => {
    expectComponentToBeInInitialStateWithMinutesSecondsAndPomodoros(component, 10, 0, 0)
  })

  it("clock should change to pomodoro running state and \
    should made a countdown when start button is clicked", () => 
  {
    component.start()

    expectComponentToBeInRunningStateWithMinutesAndSeconds(component, 9, 59);
  })

  it("clock should change to pomodoro initial state and"
    + " should reset minutes and seconds when cancel button is clicked", () => 
  {
    component.start()
    component.cancel()

    expectComponentToBeInInitialStateWithMinutesSecondsAndPomodoros(component, 10, 0, 0)
    expect(mockIntervalService.stopCalled).toBeTrue()
  })

  it("clock should change to pomodoro final state when countdown ends", () => 
  {
    component.start()
    mockIntervalService.executeIntervalNumberOfTimes(10 * 60 - 1)

    expectComponentToBeInFinalState(component);

    expect(mockIntervalService.stopCalled).toBeTrue()
  })

  it("clock should start rest state when rest button is clicked", () => 
  {
    component.startRest()

    expectComponentToBeInRestRunningStateWithMinutesAndSeconds(component, 1, 59)
  })

  it("clock should start rest state and made a countdown when rest button is clicked", () => 
  {
    component.startRest()

    expectComponentToBeInRestRunningStateWithMinutesAndSeconds(component, 1, 59)
  })

  it("clock should change to pomodoro initial state and"
    + " should reset minutes and seconds when cancel button is clicked"
    + " after rest is started", () => 
  {
    component.startRest()
    component.cancel()

    expectComponentToBeInInitialStateWithMinutesSecondsAndPomodoros(component, 10, 0, 0)
    expect(mockIntervalService.stopCalled).toBeTrue()
  })

  it("clock should change to pomodoro initial state when rest countdown ends", () => 
  {
    component.start()
    mockIntervalService.executeIntervalNumberOfTimes(10 * 60 - 1)
    component.startRest()
    mockIntervalService.executeIntervalNumberOfTimes(2 * 60 - 1)

    expectComponentToBeInInitialStateWithMinutesSecondsAndPomodoros(component, 0, 0, 1)
  })
})

function expectComponentToBeInInitialStateWithMinutesSecondsAndPomodoros(
  component: AppComponent, minutes: number, seconds: number, pomodoros: number) 
{
  expect(component.minutes).toEqual(minutes)
  expect(component.seconds).toEqual(seconds)
  expect(component.isPomodoroRunning).toBeFalse()
  expect(component.startVisible).toBeTrue()
  expect(component.cancelVisible).toBeFalse()
  expect(component.startRestVisible).toBeFalse()
  expect(component.numberOfPomodoros).toEqual(pomodoros)
}

function expectComponentToBeInRunningStateWithMinutesAndSeconds(
  component: AppComponent, minutes: number, seconds: number) 
{
  expect(component.minutes).toEqual(minutes)
  expect(component.seconds).toEqual(seconds)
  expect(component.isPomodoroRunning).toBeTrue()
  expect(component.startVisible).toBeFalse()
  expect(component.cancelVisible).toBeTrue()
  expect(component.startRestVisible).toBeFalse()
}

function expectComponentToBeInFinalState(component: AppComponent) {
  expect(component.minutes).toEqual(0)
  expect(component.seconds).toEqual(0)
  expect(component.isPomodoroRunning).toBeFalse()
  expect(component.startVisible).toBeFalse()
  expect(component.cancelVisible).toBeFalse()
  expect(component.startRestVisible).toBeTrue()
  expect(component.numberOfPomodoros).toEqual(1)
}

function expectComponentToBeInRestRunningStateWithMinutesAndSeconds(component: AppComponent, 
  minutes: number, seconds: number) {
  expect(component.minutes).toEqual(minutes);
  expect(component.seconds).toEqual(seconds);
  expect(component.isPomodoroRunning).toBeFalse();
  expect(component.startVisible).toBeFalse();
  expect(component.cancelVisible).toBeTrue();
  expect(component.startRestVisible).toBeFalse();
}