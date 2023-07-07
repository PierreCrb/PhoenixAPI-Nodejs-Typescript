import * as net from "net";
import { Worker } from "worker_threads";
import config from "./config.json";

enum Type {
  packet_send = 0,
  packet_recv = 1,
  attack = 2,
  player_skill = 3,
  player_walk = 4,
  pet_skill = 5,
  partner_skill = 6,
  pets_walk = 7,
  pick_up = 8,
  collect = 9,
  start_bot = 10,
  stop_bot = 11,
  continue_bot = 12,
  load_settings = 13,
  start_minigame_bot = 14,
  stop_minigame_bot = 15,
  query_player_info = 16,
  query_inventory = 17,
  query_skills_info = 18,
  query_map_entities = 19,
}

class PhoenixAPI {
  private static HOST = String(config.host);
  private _socket: net.Socket;
  private _do_work: boolean;
  private _messages: string[];
  private _worker: Worker;

  constructor(port: number) {
    this._socket = new net.Socket();
    this._socket.connect({ host: PhoenixAPI.HOST, port });

    this._do_work = true;
    this._messages = [];
    this._worker = new Worker("./worker.js", { workerData: null });
    this._worker.on("message", this._handleMessage);
    this._worker.on("error", this._handleError);
    this._worker.on("exit", this._handleExit);
  }

  private _sendData(data: string): number {
    const buffer: Buffer = Buffer.from(data + "\x01");
    this._socket.write(buffer);
    return buffer.length;
  }

  private _wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private isWorkerRunning(): boolean {
    return this._do_work;
  }

  private _handleMessage = (msg: any): void => {
    this._messages.push(msg);
  };

  private _handleError = (err: Error): void => {
    console.error("Worker error:", err);
  };

  private _handleExit = (code: number): void => {
    console.log("Worker exited with code", code);
  };

  public close(): void {
    if (this.isWorkerRunning()) {
      this._do_work = false;
      this._socket.destroy();
      this._worker.terminate();
    }
  }

  public get_message(): string {
    if (this._messages.length === 0) {
      return "";
    }

    return this._messages.shift()!;
  }

  public empty(): boolean {
    return this._messages.length === 0;
  }

  public async sendPacket(packet: string): Promise<boolean> {
    const data = {
      type: Type.packet_send,
      packet: packet,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async recvPacket(packet: string): Promise<boolean> {
    const data = {
      type: Type.packet_recv,
      packet: packet,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async attackMonster(monsterId: number): Promise<boolean> {
    const data = {
      type: Type.attack,
      monster_id: monsterId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async usePlayerSkill(
    monsterId: number,
    skillId: number
  ): Promise<boolean> {
    const data = {
      type: Type.player_skill,
      monster_id: monsterId,
      skill_id: skillId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async playerWalk(x: number, y: number): Promise<boolean> {
    const data = {
      type: Type.player_walk,
      x: x,
      y: y,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async usePetSkill(
    monsterId: number,
    skillId: number
  ): Promise<boolean> {
    const data = {
      type: Type.pet_skill,
      monster_id: monsterId,
      skill_id: skillId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async usePartnerSkill(
    monsterId: number,
    skillId: number
  ): Promise<boolean> {
    const data = {
      type: Type.partner_skill,
      monster_id: monsterId,
      skill_id: skillId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async petsWalk(x: number, y: number): Promise<boolean> {
    const data = {
      type: Type.pets_walk,
      x: x,
      y: y,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async pickUp(itemId: number): Promise<boolean> {
    const data = {
      type: Type.pick_up,
      item_id: itemId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async collect(npcId: number): Promise<boolean> {
    const data = {
      type: Type.collect,
      npc_id: npcId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async startBot(): Promise<boolean> {
    const data = {
      type: Type.start_bot,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async stopBot(): Promise<boolean> {
    const data = {
      type: Type.stop_bot,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async continueBot(): Promise<boolean> {
    const data = {
      type: Type.continue_bot,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async loadSettings(settingsPath: string): Promise<boolean> {
    const data = {
      type: Type.load_settings,
      path: settingsPath,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async startMinigameBot(): Promise<boolean> {
    const data = {
      type: Type.start_minigame_bot,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async stopMinigameBot(): Promise<boolean> {
    const data = {
      type: Type.stop_minigame_bot,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async queryPlayerInformation(): Promise<boolean> {
    const data = {
      type: Type.query_player_info,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async queryInventory(): Promise<boolean> {
    const data = {
      type: Type.query_inventory,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async querySkillsInfo(): Promise<boolean> {
    const data = {
      type: Type.query_skills_info,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  public async queryMapEntities(): Promise<boolean> {
    const data = {
      type: Type.query_map_entities,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }
}

export default PhoenixAPI;
