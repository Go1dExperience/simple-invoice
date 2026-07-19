import { Module } from "@nestjs/common";
import { InvoicesService } from "./invoices.service";
import { InvoicesController } from "./invoices.controller";
import { InvoicesRepository } from "./invoices.repository";

@Module({
  providers: [InvoicesService, InvoicesRepository],
  controllers: [InvoicesController],
})
export class InvoicesModule {}
