import { Injectable } from '@nestjs/common';
import {DataSource} from "typeorm";

@Injectable()
export class AppService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}
  async getHello(): Promise<string> {
    const result = await this.dataSource.query("SELECT version();")
    console.log({result})
    return result[0]['version']
  }
}
