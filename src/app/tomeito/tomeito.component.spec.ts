import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { TomeitoComponent } from './tomeito.component';
import { ConfigService } from '../config/service/config.service';
import { TomeitoConfig } from '../config/model/tomato-config';
import { IntervalService } from '../interval/interval.service';
import { AudioService } from '../audio/audio.service';
import { TomeitoState } from '../state/model/tomeito-state';
import { StateService } from '../state/service/state.service';

class MockConfigService {
  getConfig(): TomeitoConfig {
    return {
      pomodoroMinutes: 10,
      restMinutes: 2,
      beepSoundFilePath: "testSoundFile"
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

class MockAudioService {
  playSoundCalled: boolean = false
  audioFilePlayed: string = ""

  playSound(soundFilePath: string) {
    this.playSoundCalled = true
    this.audioFilePlayed = soundFilePath
  }
}

class MockStateService {
  loadTomeitoState(): TomeitoState {
    return null
  }

  loadStoredTimestamp(): number {
    return null
  }

  saveTomeitoState(tomeitoState: TomeitoState) {}
  saveTimestamp(timestamp: number) {}
  removeTomeitoState() {}
  removeTimestamp() {}
}

describe('TomeitoComponent', () => {
  let fixture: ComponentFixture<TomeitoComponent>
  let component: TomeitoComponent
  let mockIntervalService: MockIntervalService
  let mockAudioService: MockAudioService
  let mockStateService: MockStateService

  beforeEach(async(() => {
    mockIntervalService = new MockIntervalService()
    mockAudioService = new MockAudioService
    mockStateService = new MockStateService

    TestBed.configureTestingModule({
      declarations: [
        TomeitoComponent
      ],
      providers: [ 
        {provide: ConfigService, useClass: MockConfigService},
        {provide: IntervalService, useValue: mockIntervalService},
        {provide: AudioService, useValue: mockAudioService},
        {provide: StateService, useValue: mockStateService}
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TomeitoComponent)
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
    expect(mockAudioService.playSoundCalled).toBeTrue()
    expect(mockAudioService.audioFilePlayed).toBe("testSoundFile")
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

    expect(mockIntervalService.stopCalled).toBeTrue()
    expect(mockAudioService.playSoundCalled).toBeTrue()
    expect(mockAudioService.audioFilePlayed).toBe("testSoundFile")
  })
})

function expectComponentToBeInInitialStateWithMinutesSecondsAndPomodoros(
  component: TomeitoComponent, minutes: number, seconds: number, pomodoros: number) 
{
  expect(component.tomeitoState.minutes).toEqual(minutes)
  expect(component.tomeitoState.seconds).toEqual(seconds)
  expect(component.tomeitoState.isPomodoroRunning).toBeFalse()
  expect(component.startVisible).toBeTrue()
  expect(component.cancelVisible).toBeFalse()
  expect(component.startRestVisible).toBeFalse()
  expect(component.tomeitoState.numberOfPomodoros).toEqual(pomodoros)
}

function expectComponentToBeInRunningStateWithMinutesAndSeconds(
  component: TomeitoComponent, minutes: number, seconds: number) 
{
  expect(component.tomeitoState.minutes).toEqual(minutes)
  expect(component.tomeitoState.seconds).toEqual(seconds)
  expect(component.tomeitoState.isPomodoroRunning).toBeTrue()
  expect(component.startVisible).toBeFalse()
  expect(component.cancelVisible).toBeTrue()
  expect(component.startRestVisible).toBeFalse()
}

function expectComponentToBeInFinalState(component: TomeitoComponent) {
  expect(component.tomeitoState.minutes).toEqual(0)
  expect(component.tomeitoState.seconds).toEqual(0)
  expect(component.tomeitoState.isPomodoroRunning).toBeFalse()
  expect(component.startVisible).toBeFalse()
  expect(component.cancelVisible).toBeFalse()
  expect(component.startRestVisible).toBeTrue()
  expect(component.tomeitoState.numberOfPomodoros).toEqual(1)
}

function expectComponentToBeInRestRunningStateWithMinutesAndSeconds(component: TomeitoComponent, 
  minutes: number, seconds: number) {
  expect(component.tomeitoState.minutes).toEqual(minutes);
  expect(component.tomeitoState.seconds).toEqual(seconds);
  expect(component.tomeitoState.isPomodoroRunning).toBeFalse();
  expect(component.startVisible).toBeFalse();
  expect(component.cancelVisible).toBeTrue();
  expect(component.startRestVisible).toBeFalse();
}