import { CustomerCard, TransactionBoard } from "@/components";
import { formatDate } from "@/utils";
  
  const mockCustomerCards = [
    {
      customerName: "John Doe",
      loanAmount: 5000,
      paidAmount: 2000,
      date: new Date("2025-02-24"),
      totalDays: 90,
    },
    {
      customerName: "Jane Smith",
      loanAmount: 10000,
      paidAmount: 4000,
      date: new Date("2025-01-15"),
      totalDays: 120,
    },
    {
      customerName: "Alice Johnson",
      loanAmount: 7500,
      paidAmount: 3500,
      date: new Date("2025-03-10"),
      totalDays: 60,
    },
    {
      customerName: "Bob Williams",
      loanAmount: 3000,
      paidAmount: 3000,
      date: new Date("2025-02-01"),
      totalDays: 45,
    },
    {
      customerName: "Charlie Brown",
      loanAmount: 8000,
      paidAmount: 6000,
      date: new Date("2025-01-30"),
      totalDays: 100,
    },
    {
      customerName: "Daisy Miller",
      loanAmount: 6200,
      paidAmount: 2000,
      date: new Date("2025-02-20"),
      totalDays: 75,
    },
    {
      customerName: "Ethan Davis",
      loanAmount: 9500,
      paidAmount: 4500,
      date: new Date("2025-03-05"),
      totalDays: 90,
    },
    {
      customerName: "Fiona Clark",
      loanAmount: 4000,
      paidAmount: 1000,
      date: new Date("2025-01-10"),
      totalDays: 50,
    },
    {
      customerName: "George Lewis",
      loanAmount: 6800,
      paidAmount: 3000,
      date: new Date("2025-02-15"),
      totalDays: 80,
    },
    {
      customerName: "Hannah Walker",
      loanAmount: 7200,
      paidAmount: 5200,
      date: new Date("2025-03-01"),
      totalDays: 95,
    },
  ];
  
  

const Dashboard = () => {
    return <div>
        <TransactionBoard date={formatDate(new Date(), 'dd-mm-yyyy')} receivedAmount={340005} title="TODAY" yetToReceiveAmount={25423} />
        <div className="mt-4 flex flex-col gap-2 overflow-y-scroll h-[calc(100vh-308px)] sm:h-[calc(100vh-240px)]">
            {mockCustomerCards.map((e, index)=>{
                return <CustomerCard
                    key={`${e.customerName}-${index}`}
                    customerName={e.customerName} 
                    date={formatDate(new Date(e.date), 'dd-MMM-yyyy')}
                    loanAmount={e.loanAmount}
                    paidAmount={e.paidAmount}
                    totalDays={e.totalDays}
                />
            })}
        </div>
    </div>
}

export default Dashboard;