import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core'
import { ConfigService } from '../config/service/config.service'
import { IntervalService } from '../interval/interval.service'
import { AudioService } from '../audio/audio.service'
import { StateService } from '../state/service/state.service'
import { TomeitoState } from '../state/model/tomeito-state'

@Component({
  selector: 'app-tomeito',
  templateUrl: './tomeito.component.html',
  styleUrls: ['./tomeito.component.css']
})
export class TomeitoComponent implements OnInit, OnDestroy{
  title = 'Tomeito'
  tomeitoState: TomeitoState = new TomeitoState()

  startVisible: boolean = true
  cancelVisible: boolean = false
  startRestVisible: boolean = false

  constructor(private configService: ConfigService, 
    private intervalService: IntervalService,
    private audioService: AudioService,
    private stateService: StateService)
  {
  }

  ngOnInit() {
    this.intervalService.stopPeriodicExecution()

    let storedTimestamp = this.stateService.loadStoredTimestamp()
    let storedTomeitoState =  this.stateService.loadTomeitoState()
    this.tomeitoState = storedTomeitoState || new TomeitoState()

    if (!storedTomeitoState)
      this.tomeitoState.minutes = this.configService.getConfig().pomodoroMinutes

    if (this.tomeitoState.isPomodoroRunning || this.tomeitoState.isRestRunning) {
      let currentTimestampInSeconds = Math.floor(Date.now() / 1000)      
      let storedTimestampInSeconds = Math.floor(storedTimestamp / 1000)

      let differenceInSeconds = currentTimestampInSeconds - storedTimestampInSeconds
      let storedValueInSeconds = storedTomeitoState.minutes * 60 + storedTomeitoState.seconds
      let newValueInSeconds = storedValueInSeconds - differenceInSeconds
      
      if (newValueInSeconds > 0) {
        storedTomeitoState.minutes = Math.floor(newValueInSeconds / 60)
        storedTomeitoState.seconds = Math.floor(newValueInSeconds % 60)
        this.startInterval()
      } else {
        if (storedTomeitoState.isPomodoroRunning) {
          storedTomeitoState.numberOfPomodoros++
          storedTomeitoState.isStoppedAfterPomodoro = true
          storedTomeitoState.isStoppedBeforePomodoro = false
          storedTomeitoState.minutes = 0
        }
        else if (storedTomeitoState.isRestRunning) {
          storedTomeitoState.isStoppedAfterPomodoro = false
          storedTomeitoState.isStoppedBeforePomodoro = true
          storedTomeitoState.minutes = this.configService.getConfig().pomodoroMinutes
        }

        storedTomeitoState.seconds = 0

        storedTomeitoState.isPomodoroRunning = false
        storedTomeitoState.isRestRunning = false
      }
    }

    this.stateService.removeTimestamp()
    this.stateService.removeTomeitoState()

    this.refreshButtonsStatus()
  }

  private refreshButtonsStatus() {
    this.startVisible = this.tomeitoState.isStoppedBeforePomodoro
    this.startRestVisible = this.tomeitoState.isStoppedAfterPomodoro
    this.cancelVisible = this.tomeitoState.isPomodoroRunning 
      || this.tomeitoState.isRestRunning
  }

  ngOnDestroy() {
    if (!this.tomeitoState.isStoppedBeforePomodoro) {
      let storedTimestamp = Date.now()
      this.stateService.saveTomeitoState(this.tomeitoState)
      this.stateService.saveTimestamp(storedTimestamp)
    }
  }

  start() {
    this.tomeitoState.minutes = this.configService.getConfig().pomodoroMinutes
    this.tomeitoState.seconds = 0

    this.tomeitoState.isPomodoroRunning = true
    this.tomeitoState.isRestRunning = false
    this.tomeitoState.isStoppedBeforePomodoro = false
    this.tomeitoState.isStoppedAfterPomodoro = false

    this.refreshButtonsStatus()
    this.startInterval()
  }

  private startInterval() {
    this.intervalService.startPeriodicExecution(() => {
      if (this.tomeitoState.seconds === 0) {
        this.tomeitoState.minutes--
        this.tomeitoState.seconds = 59
      }
      else
        this.tomeitoState.seconds--

      if (this.tomeitoState.seconds === 0 && this.tomeitoState.minutes === 0) {
        this.playEndIntervalSound()
        this.endInterval()

        if (this.tomeitoState.isPomodoroRunning) {
          this.tomeitoState.numberOfPomodoros++
          this.tomeitoState.isPomodoroRunning = false
          this.tomeitoState.isRestRunning = false
          this.tomeitoState.isStoppedBeforePomodoro = false
          this.tomeitoState.isStoppedAfterPomodoro = true
        }
        else {
          this.tomeitoState.isPomodoroRunning = false
          this.tomeitoState.isRestRunning = false
          this.tomeitoState.isStoppedBeforePomodoro = true
          this.tomeitoState.isStoppedAfterPomodoro = false
        }

        this.refreshButtonsStatus()
      }
    })
  }

  private endInterval() {
    this.intervalService.stopPeriodicExecution()
  }

  private playEndIntervalSound() {
    this.audioService.playSound(this.configService.getConfig().beepSoundFilePath)
  }

  cancel() {
    this.endInterval()

    this.tomeitoState.minutes = this.configService.getConfig().pomodoroMinutes
    this.tomeitoState.seconds = 0

    this.tomeitoState.isPomodoroRunning = false
    this.tomeitoState.isRestRunning = false
    this.tomeitoState.isStoppedBeforePomodoro = true
    this.tomeitoState.isStoppedAfterPomodoro = false

    this.refreshButtonsStatus()
  }

  startRest() {
    this.tomeitoState.minutes = this.configService.getConfig().restMinutes
    this.tomeitoState.seconds = 0

    this.tomeitoState.isPomodoroRunning = false
    this.tomeitoState.isRestRunning = true
    this.tomeitoState.isStoppedBeforePomodoro = false
    this.tomeitoState.isStoppedAfterPomodoro = false

    this.refreshButtonsStatus()

    this.startInterval()
  }
}
