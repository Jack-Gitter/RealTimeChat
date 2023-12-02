import { EventEmitter } from "events";

export default class Room extends EventEmitter {
  public id: number;
  public isInProgress: boolean;
  public currentSongToGuess: string;
  public secondsLeftInRound: number;
  public roundsElapsed: number;
  public playerConnections: Map<string, WebSocket[]>;
  public playersInNextRound: Set<string>;

  constructor(
    id: number,
    isInProgress?: boolean,
    currentSongToGuess?: string,
    secondsLeftInRound?: number,
    roundsElapsed?: number,
    playerConnection?: Map<string, WebSocket[]>,
    playersInNextRound?: Set<string>,
  ) {
    super();
    this.id = id;
    this.isInProgress = false;
    this.currentSongToGuess = "";
    this.secondsLeftInRound = 10;
    this.roundsElapsed = 0;
    this.playerConnections = new Map();
    this.playersInNextRound = new Set();
  }
}
