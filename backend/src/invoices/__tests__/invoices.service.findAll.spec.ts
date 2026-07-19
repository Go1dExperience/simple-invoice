import { InvoicesService } from '../invoices.service';

const row = {
  id: 'inv1', invoiceNumber: 'IV-1',
  customer: { fullname: 'Paul' },
  invoiceDate: new Date('2026-07-01'), dueDate: new Date('2026-07-10'),
  totalAmount: '2180.00', status: 'Pending',
};

const buildRepo = (rows: any[] = [row], total = 1) => ({
  findManyByFilter: jest.fn().mockResolvedValue([rows, total]),
});

describe('InvoicesService.findAll', () => {
  it('paginates with defaults (page 1, size 10) and forwards the query to the repository', async () => {
    const repo = buildRepo([], 0);
    const service = new InvoicesService(repo as any);
    const res = await service.findAll({} as any);
    expect(res.paging).toEqual({ page: 1, pageSize: 10, total: 0 });
    expect(repo.findManyByFilter).toHaveBeenCalledTimes(1);
    const [query] = repo.findManyByFilter.mock.calls[0];
    expect(query).toEqual({});
  });

  it('honors a custom page and pageSize when paginating', async () => {
    const repo = buildRepo([], 0);
    const service = new InvoicesService(repo as any);
    const res = await service.findAll({ page: 3, pageSize: 20 } as any);
    expect(res.paging).toEqual({ page: 3, pageSize: 20, total: 0 });
  });

  it('maps rows to the list shape with derived status and formatted totals', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-17'));
    const repo = buildRepo();
    const service = new InvoicesService(repo as any);
    const res = await service.findAll({} as any);
    expect(res.data).toEqual([{
      invoiceId: 'inv1', invoiceNumber: 'IV-1', customerName: 'Paul',
      invoiceDate: '2026-07-01', dueDate: '2026-07-10',
      totalAmount: '2180.00', status: 'Overdue',
    }]);
    jest.useRealTimers();
  });
});
