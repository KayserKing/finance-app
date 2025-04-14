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
  