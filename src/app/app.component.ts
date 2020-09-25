import { Component } from '@angular/core'

const POMODORO_MINUTES = 25
const REST_MINUTES = 5

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Pomodoro'
  minutes: number = POMODORO_MINUTES
  seconds: number = 0
  numberOfPomodoros: number = 0

  isPomodoroRunning: boolean = false
  startVisible: boolean = true
  cancelVisible: boolean = false
  startRestVisible: boolean = false

  interval: number

  start() {
    this.minutes = POMODORO_MINUTES
    this.seconds = 0

    this.isPomodoroRunning = true
    this.startVisible = false
    this.cancelVisible = true
    this.startRestVisible = false

    this.startInterval()
  }

  private startInterval() {
    this.interval = setInterval(() => {
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
    }, 1000)
  }

  private endInterval() {
    clearInterval(this.interval)
  }

  private playEndIntervalSound() {
    let audio = new Audio()
    audio.src = "assets/sounds/bell.mp3"
    audio.load()
    audio.play()
  }

  cancel() {
    this.endInterval()

    this.minutes = POMODORO_MINUTES
    this.seconds = 0

    this.isPomodoroRunning = false
    this.startVisible = true
    this.cancelVisible = false
    this.startRestVisible = false
  }

  startRest() {
    this.minutes = REST_MINUTES
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
