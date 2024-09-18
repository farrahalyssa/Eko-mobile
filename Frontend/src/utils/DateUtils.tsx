// utils/dateUtils.ts

export const formatDateTime = (dateString: string | number | Date): string  => {
    const date = new Date(dateString);
    const currentYear = new Date().getFullYear();
    const year = date.getFullYear() === currentYear ? '' : ` ${date.getFullYear()}`;
  
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    }) + year;
  
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  
    return `${formattedTime} • ${formattedDate}`;
  }

  export const formatDateTimeMonthYear = (dateString: string | number | Date): string => {
    const date = new Date(dateString);
  
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'long', // Full month name (e.g., January)
      year: 'numeric', // Full year (e.g., 2024)
    });
  
    return formattedDate;
  };
    