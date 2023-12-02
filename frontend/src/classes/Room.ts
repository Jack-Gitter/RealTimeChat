import { EventEmitter } from "events";

export default class Room extends EventEmitter {
  public id: number;
  public isInProgress: boolean;
  public currentSongToGuess: string;
  public secondsLeftInRound: number;
  public roundsElapsed: number;
  public playersInRoom: string[]
  public playersInNextRound: string[];

  constructor(
    id: number,
    isInProgress?: boolean,
    currentSongToGuess?: string,
    secondsLeftInRound?: number,
    roundsElapsed?: number,
    playersInRoom?: string[],
    playersInNextRound?: string[],
  ) {
    super();
    this.id = id;
    this.isInProgress = isInProgress ? isInProgress : false
    this.currentSongToGuess = currentSongToGuess ? currentSongToGuess : "";
    this.secondsLeftInRound = secondsLeftInRound ? secondsLeftInRound : 10
    this.roundsElapsed = roundsElapsed ? roundsElapsed : 0
    this.playersInNextRound = playersInNextRound ? playersInNextRound : []
    this.playersInRoom = playersInRoom ? playersInRoom : []
  }
}
