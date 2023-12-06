import { EventEmitter } from "events";

export default class Room extends EventEmitter {
  public id: number;
  public playersInRoom: string[]
  public messages: string[][]
  public owner: string

  constructor(
    id: number,
    playersInRoom?: string[],
    messages?: string[][],
    owner?: string
  ) {
    super();
    this.id = id;
    this.playersInRoom = playersInRoom ? playersInRoom : []
    this.messages = messages ? messages : []
    this.owner = owner ? owner : ""
  }
}
