import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Invoices (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
    const login = await request(app.getHttpServer()).post('/auth/login')
      .send({ email: 'reviewer@simpleinvoice.io', password: 'Password123' });
    token = login.body.accessToken;
  });
  afterAll(async () => app.close());

  it('creates an invoice and finds it in the list', async () => {
    const invoiceNumber = `E2E-${Date.now()}`;
    const create = await request(app.getHttpServer()).post('/invoices')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customer: { fullname: 'E2E Cust', email: 'e2e@x.io' },
        // future dates so the created invoice derives to Draft, not Overdue
        invoiceNumber, invoiceDate: '2026-08-01', dueDate: '2026-08-15',
        currency: 'AUD', item: { name: 'Widget', quantity: 2, rate: 1000 }, taxPercent: 10, discount: 20,
      });
    expect(create.status).toBe(201);
    expect(create.body.status).toBe('Draft');
    expect(create.body.totalAmount).toBe('2180.00');

    const list = await request(app.getHttpServer()).get(`/invoices?keyword=${invoiceNumber}`)
      .set('Authorization', `Bearer ${token}`);
    expect(list.body.data.some((i: any) => i.invoiceNumber === invoiceNumber)).toBe(true);
  });

  it('rejects the list without a token', async () => {
    await request(app.getHttpServer()).get('/invoices').expect(401);
  });
});
