import { Component } from '@angular/core'
import { ConfigService } from './config/config.service'
import { IntervalService } from './interval/interval.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Tomeito'
  minutes: number = 0
  seconds: number = 0
  numberOfPomodoros: number = 0

  isPomodoroRunning: boolean = false
  startVisible: boolean = true
  cancelVisible: boolean = false
  startRestVisible: boolean = false

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

  close() {
    window.close();
  }
}
