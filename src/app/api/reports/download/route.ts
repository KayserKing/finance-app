import { NextResponse } from 'next/server';
import Transactions from '@/models/Transaction';
import Customer from '@/models/Customer';
import { parse } from 'json2csv';
import dbConnect from '@/lib/mongodb';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

interface CsvRow {
  'SL No'?: number | string;
  'Date'?: string;
  'Customer Name'?: string;
  'Amount'?: number | string;
  'Payment Tier'?: string;
  'Payment Type'?: string;
  'Range'?: string;
  'Amount Summary'?: string;
}

export async function POST(req: Request) {
  await dbConnect(process.env.MONGODB_DB_2!);
  const body = await req.json();
  const { customerId, range, type } = body;

  try {
    const query: {
      date?: { $gte?: Date; $lte?: Date };
      customerId?: string;
    } = {};
    const today = new Date();

    if (range && range !== 'FULL') {
      const dateFilter: { $gte?: Date; $lte?: Date } = { $lte: today };

      if (range === 'THIS MONTH') {
        dateFilter.$gte = new Date(today.getFullYear(), today.getMonth(), 1);
      } else if (range === 'TODAY') {
        dateFilter.$gte = startOfDay(today);
        dateFilter.$lte = endOfDay(today);
      } else if (range === 'LAST MONTH') {
        const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        dateFilter.$gte = lastMonthStart;
        dateFilter.$lte = lastMonthEnd;
      }

      query.date = dateFilter;
    }

    if (customerId) {
      const [name, mobileNumber] = customerId.split(' - ');
      const customer = await Customer.findOne({ name, mobileNumber });
      if (!customer) {
        return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
      }
      query.customerId = customer._id;
    }

    const transactions = await Transactions.find(query).populate("customerId");

    const csvData: CsvRow[] = transactions.map((p, index) => ({
      "SL No": index + 1,
      Date: new Date(p.date).toLocaleDateString("en-IN"),
      "Customer Name": p.customerId?.name || "N/A",
      Amount: p.amount,
      "Payment Tier": p.transactionType,
      "Payment Type": p?.paymentType,
    }));

    // ✅ DATE BASED TYPE: Add summary rows
    if (type === "DATE BASED") {
      const activeCustomers = await Customer.find({ active: true }).populate(
        "loanIds"
      );
      const periods = [
        "TODAY",
        "THIS WEEK",
        "THIS MONTH",
        "THIS YEAR",
      ] as const;

      const summaryRows = [];

      for (const period of periods) {
        let start: Date, end: Date;

        switch (period) {
          case "TODAY":
            start = startOfDay(today);
            end = endOfDay(today);
            break;
          case "THIS WEEK":
            start = startOfWeek(today);
            end = endOfWeek(today);
            break;
          case "THIS MONTH":
            start = startOfMonth(today);
            end = endOfMonth(today);
            break;
          case "THIS YEAR":
            start = startOfYear(today);
            end = endOfYear(today);
            break;
        }

        // Total expected = sum of all active customers’ dailyAmountToBePaid × no. of days in range
        let received = 0;
        let expected = 0;

        for (const customer of activeCustomers) {
          const loans = customer.loanIds || [];
          for (const loan of loans) {
            const totalDays =
              Math.ceil(
                (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
              ) + 1;
            expected += loan.dailyAmountToBePaid * totalDays;

            const trans = await Transactions.find({
              customerId: customer._id,
              loanId: loan._id,
              transactionType: "RECEIVE",
              date: { $gte: start, $lte: end },
            });

            received += trans.reduce((sum, t) => sum + t.amount, 0);
          }
        }

        summaryRows.push({
          Range: period,
          "Amount Summary": `Rs.${received} received / Rs.${
            expected - received
          } yet to receive`,
        });
      }

      // Push summaries to CSV
      csvData.push({}, { "SL No": "--- SUMMARY ---" }, ...summaryRows);
    }

    const fields = type === "DATE BASED" ? ['SL No', 'Date', 'Customer Name', 'Amount', 'Payment Tier', 'Payment Type', 'Range', 'Amount Summary'] : ['SL No', 'Date', 'Customer Name', 'Amount', 'Payment Tier', 'Payment Type'];
    const csv = parse(csvData, { fields });

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="report.csv"',
      },
    });
  } catch (error) {
    console.error('CSV generation error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
