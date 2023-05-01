import {Test, TestingModule} from '@nestjs/testing';
import {AppController} from './app.controller';
import {AppService} from "./app.service";
import {DataSource} from "typeorm";
import {addTransactionalDataSource, initializeTransactionalContext} from "typeorm-transactional";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import "reflect-metadata"

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    initializeTransactionalContext();
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forRoot()],
          useFactory: (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.get('DATABASE_POSTGRES_HOST'),
            port: +configService.get('DATABASE_POSTGRES_PORT'),
            username: configService.get('DATABASE_POSTGRES_USERNAME'),
            password: configService.get('DATABASE_POSTGRES_PASSWORD'),
            database: configService.get('DATABASE_POSTGRES_DATABASE'),
            // synchronize: true,
            // logging: true,
            // entities: [Post, Category],
            // subscribers: [],
            // migrations: [],
          }),
          inject: [ConfigService],
          async dataSourceFactory(options) {
            if (!options) {
              throw new Error('Invalid options passed');
            }
            console.debug({options})
            return addTransactionalDataSource({
              dataSource: new DataSource(options),
            });
          },
        })
      ],
      controllers: [AppController],
      providers: [ConfigModule, ConfigService, DataSource, AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
