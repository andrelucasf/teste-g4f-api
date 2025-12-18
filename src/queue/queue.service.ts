import { Injectable } from '@nestjs/common';
import { QueueJob } from './interfaces/queue-job.interface';
import { v4 as uuidv4 } from 'uuid';

/**
 * Serviço de fila mock em memória para simular processamento assíncrono
 * Em produção, use Bull/BullMQ com Redis
 */
@Injectable()
export class QueueService {
  private queue: QueueJob[] = [];
  private processing = false;

  /**
   * Adiciona uma notificação à fila
   */
  async addNotification(payload: any): Promise<QueueJob> {
    const job: QueueJob = {
      id: uuidv4(),
      type: 'notification',
      payload,
      status: 'pending',
      createdAt: new Date(),
    };

    this.queue.push(job);
    console.log(`📬 Job ${job.id} adicionado à fila:`, payload);

    // Inicia o processamento se não estiver rodando
    if (!this.processing) {
      this.processQueue();
    }

    return job;
  }

  /**
   * Processa a fila de forma assíncrona
   */
  private async processQueue(): Promise<void> {
    if (this.processing || this.queue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();

      if (job) {
        job.status = 'processing';
        console.log(`⚙️  Processando job ${job.id}...`);

        try {
          // Simula processamento assíncrono
          await this.processJob(job);

          job.status = 'completed';
          job.processedAt = new Date();
          console.log(`✅ Job ${job.id} completado com sucesso`);
        } catch (error) {
          job.status = 'failed';
          console.error(`❌ Erro ao processar job ${job.id}:`, error.message);
        }
      }

      // Aguarda um pouco antes de processar o próximo job
      await this.sleep(1000);
    }

    this.processing = false;
  }

  /**
   * Processa um job específico
   */
  private async processJob(job: QueueJob): Promise<void> {
    switch (job.type) {
      case 'notification':
        await this.sendNotification(job.payload);
        break;
      default:
        throw new Error(`Tipo de job desconhecido: ${job.type}`);
    }
  }

  /**
   * Simula o envio de uma notificação
   */
  private async sendNotification(payload: any): Promise<void> {
    // Simula latência de rede
    await this.sleep(500);

    console.log(`📨 Notificação enviada:`, {
      tipo: payload.type,
      noticiaId: payload.noticiaId,
      titulo: payload.titulo,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Utilitário para aguardar
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retorna o estado atual da fila (útil para debugging)
   */
  getQueueStatus(): { pending: number; processing: boolean } {
    return {
      pending: this.queue.length,
      processing: this.processing,
    };
  }
}
