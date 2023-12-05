import { EventEmitter } from "events";

export default class Room extends EventEmitter {
  public id: number;
  public playersInRoom: string[]

  constructor(
    id: number,
    playersInRoom?: string[],

  ) {
    super();
    this.id = id;
    this.playersInRoom = playersInRoom ? playersInRoom : []
  }
}
