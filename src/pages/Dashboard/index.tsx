/* eslint-disable @typescript-eslint/camelcase */
import React, { useState, useEffect } from 'react';

import income from '../../assets/income.svg';
import outcome from '../../assets/outcome.svg';
import total from '../../assets/total.svg';

import api from '../../services/api';

import Header from '../../components/Header';

import formatValue from '../../utils/formatValue';

import { Container, CardContainer, Card, TableContainer } from './styles';

interface TransactionFromAPI {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: string;
}

interface Transaction {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  formattedDate: string;
  type: 'income' | 'outcome';
  category: { title: string };
  created_at: Date;
}

interface BalanceFromAPI {
  income: number;
  outcome: number;
  total: number;
}

interface Balance {
  income: string;
  outcome: string;
  total: string;
}

const formatTransactions: (transaction: TransactionFromAPI) => Transaction = (
  transaction,
) => ({
  ...transaction,
  created_at: new Date(transaction.created_at),
  formattedValue: `${transaction.type === 'outcome' ? '- ' : ''}${formatValue(
    transaction.value,
  )}`,
  formattedDate: new Date(transaction.created_at).toDateString(),
});

const formatBalance: (balance: BalanceFromAPI) => Balance = (balance) => ({
  income: formatValue(balance.income),
  outcome: formatValue(balance.outcome),
  total: formatValue(balance.total),
});

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<Balance>({} as Balance);

  useEffect(() => {
    async function loadTransactions(): Promise<void> {
      const {
        data: { transactions: apiTransactions, balance: apiBalance },
      } = (await api.get('transactions')) as {
        data: {
          transactions: TransactionFromAPI[];
          balance: BalanceFromAPI;
        };
      };
      setTransactions(apiTransactions.map(formatTransactions));
      setBalance(formatBalance(apiBalance));
    }
    loadTransactions();
  }, []);

  return (
    <>
      <Header />
      <Container>
        <CardContainer>
          <Card>
            <header>
              <p>Balance</p>
              <img src={income} alt="Income" />
            </header>
            <h1 data-testid="balance-income">{balance.income}</h1>
          </Card>
          <Card>
            <header>
              <p>Deductions</p>
              <img src={outcome} alt="Outcome" />
            </header>
            <h1 data-testid="balance-outcome">{balance.outcome}</h1>
          </Card>
          <Card total>
            <header>
              <p>Total</p>
              <img src={total} alt="Total" />
            </header>
            <h1 data-testid="balance-total">{balance.total}</h1>
          </Card>
        </CardContainer>

        <TableContainer>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td className="title">{transaction.title}</td>
                  {transaction.type === 'income' ? (
                    <td className="income">{transaction.formattedValue}</td>
                  ) : (
                    <td className="outcome">{transaction.formattedValue}</td>
                  )}
                  <td>{transaction.category.title}</td>
                  <td>{transaction.formattedDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Dashboard;
