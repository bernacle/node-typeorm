import { EntityRepository, Repository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const income = await this.createQueryBuilder('transaction')
      .select('SUM(transaction.value)', 'sum')
      .where('transaction.type = :type', { type: 'income' })
      .getRawOne();

    const outcome = await this.createQueryBuilder('transaction')
      .select('SUM(transaction.value)', 'sum')
      .where('transaction.type = :type', { type: 'outcome' })
      .getRawOne();

    const response = {
      income: income.sum ? income.sum : 0,
      outcome: outcome.sum ? outcome.sum : 0,
      total: income.sum - outcome.sum,
    };

    return response;
  }
}

export default TransactionsRepository;
