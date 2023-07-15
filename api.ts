import * as net from "net";
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
  public data: string = "";

  constructor(port: number) {
    this._socket = new net.Socket();
    this._socket.connect({ host: PhoenixAPI.HOST, port });

    this._do_work = true;
    this._messages = [];

    this._socket.on("data", (buffer) => {
      this.data += buffer.toString();
      let delim_pos = this.data.indexOf("\x01");

      while (delim_pos !== -1) {
        const msg = this.data.substring(0, delim_pos);
        this.data = this.data.substring(delim_pos + 1);
        this._messages.push(msg);
        delim_pos = this.data.indexOf("\x01");
      }
    });

    this._socket.on("error", (err) => {
      console.error("Socket error:", err);
    });

    this._socket.on("close", () => {
      console.log("Socket closed");
    });
  }

  private _sendData(data: string): number {
    const buffer: Buffer = Buffer.from(data + "\x01");
    this._socket.write(buffer);
    return buffer.length;
  }

  _wait(ms: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  private isWorkerRunning(): boolean {
    return this._do_work;
  }

  close(): void {
    if (this.isWorkerRunning()) {
      this._do_work = false;
      this._socket.destroy();
    }
  }

  get_message(): string {
    if (this._messages.length === 0) {
      return "";
    }
    return this._messages.shift()!;
  }

  empty(): boolean {
    return this._messages.length === 0;
  }

  async sendPacket(packet: string): Promise<boolean> {
    const data = {
      type: Type.packet_send,
      packet: packet,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async recvPacket(packet: string): Promise<boolean> {
    const data = {
      type: Type.packet_recv,
      packet: packet,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async attackMonster(monsterId: number): Promise<boolean> {
    const data = {
      type: Type.attack,
      monster_id: monsterId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async usePlayerSkill(monsterId: number, skillId: number): Promise<boolean> {
    const data = {
      type: Type.player_skill,
      monster_id: monsterId,
      skill_id: skillId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async playerWalk(x: number, y: number): Promise<boolean> {
    const data = {
      type: Type.player_walk,
      x: x,
      y: y,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async usePetSkill(monsterId: number, skillId: number): Promise<boolean> {
    const data = {
      type: Type.pet_skill,
      monster_id: monsterId,
      skill_id: skillId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async usePartnerSkill(monsterId: number, skillId: number): Promise<boolean> {
    const data = {
      type: Type.partner_skill,
      monster_id: monsterId,
      skill_id: skillId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async petsWalk(x: number, y: number): Promise<boolean> {
    const data = {
      type: Type.pets_walk,
      x: x,
      y: y,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async pickUp(itemId: number): Promise<boolean> {
    const data = {
      type: Type.pick_up,
      item_id: itemId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async collect(npcId: number): Promise<boolean> {
    const data = {
      type: Type.collect,
      npc_id: npcId,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async startBot(): Promise<boolean> {
    const data = {
      type: Type.start_bot,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async stopBot(): Promise<boolean> {
    const data = {
      type: Type.stop_bot,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async continueBot(): Promise<boolean> {
    const data = {
      type: Type.continue_bot,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async loadSettings(settingsPath: string): Promise<boolean> {
    const data = {
      type: Type.load_settings,
      path: settingsPath,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async startMinigameBot(): Promise<boolean> {
    const data = {
      type: Type.start_minigame_bot,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async stopMinigameBot(): Promise<boolean> {
    const data = {
      type: Type.stop_minigame_bot,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async queryPlayerInformation(): Promise<boolean> {
    const data = {
      type: Type.query_player_info,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async queryInventory(): Promise<boolean> {
    const data = {
      type: Type.query_inventory,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async querySkillsInfo(): Promise<boolean> {
    const data = {
      type: Type.query_skills_info,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }

  async queryMapEntities(): Promise<boolean> {
    const data = {
      type: Type.query_map_entities,
    };

    const json_data = JSON.stringify(data);

    return (await this._sendData(json_data)) === json_data.length + 1;
  }
}

export default PhoenixAPI;
