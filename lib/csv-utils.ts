import { Recipient } from './campaign-types';

export const generateExampleCSV = (): string => {
  const headers = ['name', 'email', 'phone'];
  const exampleData = [
    ['John Smith', 'john@example.com', '+1-555-0101'],
    ['Sarah Johnson', 'sarah@example.com', '+1-555-0102'],
    ['Michael Brown', 'michael@example.com', '+1-555-0103'],
    ['Emily Davis', 'emily@example.com', '+1-555-0104'],
  ];

  const rows = [headers, ...exampleData];
  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
};

export const downloadExampleCSV = (): void => {
  const csv = generateExampleCSV();
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', 'recipients-example.csv');
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const parseCSV = (content: string): Recipient[] => {
  const lines = content.trim().split('\n');
  if (lines.length < 2) return [];

  const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/"/g, ''));
  const recipients: Recipient[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    
    if (values.length > 0 && values[0]) {
      const nameIndex = headers.indexOf('name');
      const emailIndex = headers.indexOf('email');
      const phoneIndex = headers.indexOf('phone');

      recipients.push({
        id: `recipient-${i}-${Date.now()}`,
        name: nameIndex >= 0 ? values[nameIndex] : undefined,
        email: emailIndex >= 0 ? values[emailIndex] : undefined,
        phone: phoneIndex >= 0 ? values[phoneIndex] : undefined,
      });
    }
  }

  return recipients;
};

export const recipientsToCSV = (recipients: Recipient[]): string => {
  const headers = ['name', 'email', 'phone'];
  const rows = [headers];

  recipients.forEach(recipient => {
    rows.push([
      recipient.name || '',
      recipient.email || '',
      recipient.phone || '',
    ]);
  });

  return rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
};
