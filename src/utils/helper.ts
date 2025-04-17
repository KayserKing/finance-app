import { isSameDay, isWithinInterval } from 'date-fns';

export const formatDate = (date: Date, format: 'dd-mm-yyyy' | 'dd-MMM-yyyy') => {
  const day = String(date.getDate()).padStart(2, '0');
  const monthNumeric = String(date.getMonth() + 1).padStart(2, '0');
  const monthShort = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
  const year = date.getFullYear();

  switch (format) {
    case 'dd-mm-yyyy':
      return `${day}-${monthNumeric}-${year}`;
    case 'dd-MMM-yyyy':
      return `${day} ${monthShort} ${year}`;
    default:
      return '';
  }
};

export function getNumberOfDaysFrom(dateString: string): number {
  const givenDate = new Date(dateString);
  const now = new Date();

  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const givenIST = new Date(givenDate.getTime() + IST_OFFSET);
  const nowIST = new Date(now.getTime() + IST_OFFSET);

  givenIST.setHours(0, 0, 0, 0);
  nowIST.setHours(0, 0, 0, 0);

  const diffTime = nowIST.getTime() - givenIST.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}


export function getDatesFromLoanStartToToday(loanStartDate: string | Date): Date[] {
  const start = new Date(loanStartDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(0, 0, 0, 0);

  const dates: Date[] = [];

  while (start <= end) {
    dates.push(new Date(start));
    start.setDate(start.getDate() + 1);
  }

  return dates;
}

type Transaction = {
  date: string;
  amount: number;
  transactionType: 'RECEIVE' | 'SEND';
};

type Loan = {
  dailyAmountToBePaid: number;
  loanStartDate: string;
  loanEndDate: string;
};

export function calculateTransactionSummary(
  transactions: Transaction[],
  loans: Loan[],
  fromDate: Date,
  toDate: Date
) {
  const allDays: Date[] = [];
  const currentDate = new Date(fromDate);

  while (currentDate <= toDate) {
    allDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  let yetToReceiveAmount = 0;
  let receivedAmount = 0;

  for (const day of allDays) {
    const activeLoans = loans.filter((loan) =>
      isWithinInterval(day, {
        start: new Date(loan.loanStartDate),
        end: new Date(loan.loanEndDate),
      })
    );

    const receiveTransactions = transactions.filter(
      (tx) =>
        tx.transactionType === 'RECEIVE' &&
        isSameDay(new Date(tx.date), day)
    );

    const dayExpected = activeLoans.reduce((sum, loan) => sum + loan.dailyAmountToBePaid, 0);
    const dayReceived = receiveTransactions.reduce((sum, tx) => sum + tx.amount, 0);

    yetToReceiveAmount += dayExpected;
    receivedAmount += dayReceived;
  }

  return {
    receivedAmount,
    yetToReceiveAmount,
  };
}
