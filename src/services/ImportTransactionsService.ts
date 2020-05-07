import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';
import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

class ImportTransactionsService {
  async execute(transactionFilename: string): Promise<Transaction[]> {
    const csvFilePath = path.resolve(
      (__dirname, '..', '..', `tmp/${transactionFilename}`),
    );

    const createTransaction = new CreateTransactionService();

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    const transactions = [];

    parseCSV.on('data', line => {
      const [title, type, value, category] = line;
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    await fs.promises.unlink(csvFilePath);

    transactions.map(async ({ title, type, value, category }) => {
      await createTransaction.execute({
        title,
        type,
        value,
        category,
      });
    });

    return transactions;
  }
}

export default ImportTransactionsService;
