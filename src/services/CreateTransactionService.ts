// import AppError from '../errors/AppError';
import { getCustomRepository, getRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);
    let category_id = '';

    const categoryResponse = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    if (categoryResponse) {
      category_id = categoryResponse.id;
    } else {
      const { id } = await categoryRepository.save(
        categoryRepository.create({ title: category }),
      );
      category_id = id;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
