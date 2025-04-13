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
  