import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {

  constructor() { }

  playSound(soundFilePath: string) {
    let audio = new Audio()
    audio.src = soundFilePath
    audio.load()
    audio.play()
  }
}
