import { Component, EventEmitter, Output } from '@angular/core'
import { Router } from '@angular/router'
import { WindowService } from '../window/window.service'
import { ConfigService } from '../config/service/config.service'
import { IntervalService } from '../interval/interval.service'

@Component({
  selector: 'app-tomeito',
  templateUrl: './tomeito.component.html',
  styleUrls: ['./tomeito.component.css']
})
export class TomeitoComponent {
  title = 'Tomeito'
  minutes: number = 0
  seconds: number = 0
  numberOfPomodoros: number = 0

  isPomodoroRunning: boolean = false
  startVisible: boolean = true
  cancelVisible: boolean = false
  startRestVisible: boolean = false

  @Output()
  numberOfPomodorosChange = new EventEmitter<number>();

  constructor(private configService: ConfigService, 
    private intervalService: IntervalService)
  {
    this.minutes = configService.getConfig().pomodoroMinutes
  }

  start() {
    this.minutes = this.configService.getConfig().pomodoroMinutes
    this.seconds = 0

    this.isPomodoroRunning = true
    this.startVisible = false
    this.cancelVisible = true
    this.startRestVisible = false

    this.startInterval()
  }

  private startInterval() {
    this.intervalService.startPeriodicExecution(() => {
      if (this.seconds === 0) {
        this.minutes--
        this.seconds = 59
      }
      else
        this.seconds--

      if (this.seconds === 0 && this.minutes === 0) {
        this.playEndIntervalSound()
        this.endInterval()

        if (this.isPomodoroRunning) {
          this.numberOfPomodoros++
          this.numberOfPomodorosChange.emit(this.numberOfPomodoros)
          this.isPomodoroRunning = false
          this.startVisible = false
          this.cancelVisible = false
          this.startRestVisible = true
        }
        else {
          this.isPomodoroRunning = false
          this.startVisible = true
          this.cancelVisible = false
          this.startRestVisible = false
        }
      }
    })
  }

  private endInterval() {
    this.intervalService.stopPeriodicExecution()
  }

  private playEndIntervalSound() {
    let audio = new Audio()
    audio.src = this.configService.getConfig().beepSoundFilePath
    audio.load()
    audio.play()
  }

  cancel() {
    this.endInterval()

    this.minutes = this.configService.getConfig().pomodoroMinutes
    this.seconds = 0

    this.isPomodoroRunning = false
    this.startVisible = true
    this.cancelVisible = false
    this.startRestVisible = false
  }

  startRest() {
    this.minutes = this.configService.getConfig().restMinutes
    this.seconds = 0

    this.isPomodoroRunning = false
    this.startVisible = false
    this.cancelVisible = true
    this.startRestVisible = false

    this.startInterval()
  }
}
