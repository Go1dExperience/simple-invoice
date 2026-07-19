import { DisplayStatus } from "./invoice";

export interface Paged<T> {
  data: T[];
  paging: { page: number; pageSize: number; total: number };
}

export interface ListParams {
  page?: number;
  pageSize?: number;
  sortBy?: "invoiceDate" | "dueDate" | "totalAmount";
  ordering?: "ASC" | "DESC";
  status?: DisplayStatus;
  keyword?: string;
}

export interface Customer {
  fullname: string;
  email: string;
  mobileNumber?: string;
  address?: string;
}
