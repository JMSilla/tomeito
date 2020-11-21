export class TomeitoState {
    minutes: number = 0
    seconds: number = 0
    numberOfPomodoros: number = 0

    isPomodoroRunning: boolean = false
    isRestRunning: boolean = false
    isStoppedBeforePomodoro: boolean = true
    isStoppedAfterPomodoro: boolean = false
}
