export interface QueueJob {
  id: string;
  type: string;
  payload: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  processedAt?: Date;
}
