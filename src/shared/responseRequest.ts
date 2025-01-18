export interface ResponseRequest<T> {
  status: number;
  message: string;
  data: T;
}
