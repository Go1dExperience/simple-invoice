import { Paged } from "@/types/api";

export type PageData<T> = NoInfer<Paged<T>> | undefined;
