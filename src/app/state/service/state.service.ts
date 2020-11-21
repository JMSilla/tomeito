import { Injectable } from '@angular/core'
import { TomeitoState } from '../model/tomeito-state'

const STORED_TIMESTAMP_KEY = "storedTimestamp"
const STORED_TOMEITOSTATE_KEY = "tomeitoState"

@Injectable({
  providedIn: 'root'
})
export class StateService {

  constructor() { }

  loadTomeitoState(): TomeitoState {
    let storedTimestamp = JSON.parse(
        sessionStorage.getItem(STORED_TIMESTAMP_KEY))
    return JSON.parse(sessionStorage.getItem(STORED_TOMEITOSTATE_KEY))
  }

  loadStoredTimestamp(): number {
    return JSON.parse(sessionStorage.getItem(STORED_TIMESTAMP_KEY))
  }

  saveTomeitoState(tomeitoState: TomeitoState) {
    sessionStorage.setItem(STORED_TOMEITOSTATE_KEY, JSON.stringify(tomeitoState))
  }
  
  saveTimestamp(timestamp: number) {
    sessionStorage.setItem(STORED_TIMESTAMP_KEY, JSON.stringify(timestamp))
  }

  removeTomeitoState() {
    sessionStorage.removeItem(STORED_TOMEITOSTATE_KEY)
  }
  
  removeTimestamp() {
    sessionStorage.removeItem(STORED_TIMESTAMP_KEY)
  }
}
