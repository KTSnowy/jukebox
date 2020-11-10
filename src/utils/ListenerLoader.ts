import { promises as fs } from "fs";
import { resolve } from "path";
import Jukebox from "../structures/Jukebox";
import { IListener } from "../../typings";

export class ListenerLoader {
    public constructor(public client: Jukebox, public readonly path: string) {}

    public async load(): Promise<Jukebox> {
        const files: string[] | undefined = await fs.readdir(resolve(this.path));
        for (const file of files) {
            const event: IListener = await this.import(resolve(this.path, file), this.client);
            this.client.on(event.name, (...args) => event.execute(...args));
            this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} Listener for event ${event.name} has been loaded!`);
        }
        this.client.logger.info(`${this.client.shard ? `[Shard #${this.client.shard.ids[0]}]` : ""} A total of ${files.length} of listeners has been loaded!`);
        return this.client;
    }

    private async import(path: string, ...args: any[]): Promise<IListener> {
        return new (await import(resolve(path)).then(m => m.default))(...args);
    }
}
