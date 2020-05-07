// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    await transactionsRepository
      .createQueryBuilder()
      .delete()
      .from(Transaction)
      .where('id = :id', { id })
      .execute();
  }
}

export default DeleteTransactionService;
