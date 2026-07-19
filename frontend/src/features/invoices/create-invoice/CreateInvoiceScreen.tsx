import { PageBand } from "../../../components/PageBand";
import { CreateInvoiceForm } from "./components/CreateInvoiceForm";

export const CreateInvoiceScreen = () => {
  return (
    <div className="mx-auto max-w-5xl p-7">
      <PageBand>
        <div>
          <PageBand.Eyebrow>New</PageBand.Eyebrow>
          <PageBand.Title>Create invoice</PageBand.Title>
          <PageBand.Sub>
            New invoices are saved as Draft. Totals are calculated by the
            server.
          </PageBand.Sub>
        </div>
      </PageBand>
      <CreateInvoiceForm />
    </div>
  );
};
