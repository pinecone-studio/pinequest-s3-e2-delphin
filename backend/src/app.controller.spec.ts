import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DatabaseService,
          useValue: {
            isConfigured: jest.fn().mockReturnValue(false),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return project overview', () => {
      expect(appController.getOverview()).toEqual(
        expect.objectContaining({
          name: 'PineQuest LMS API',
        }),
      );
    });

    it('should return health status', () => {
      expect(appController.getHealth()).toEqual(
        expect.objectContaining({
          status: 'ok',
          service: 'pinequest-backend',
          databaseConfigured: false,
          uploadMetadataPersistence: 'local-file',
        }),
      );
    });
  });
});
