import { Visitor } from '../types';

/**
 * Generates and triggers browser download of a formatted CSV file containing all visitor records.
 */
export function exportVisitorsToCSV(visitors: Visitor[], filename: string = 'auravms_all_visitors_export.csv') {
  if (!visitors || visitors.length === 0) {
    alert('No visitor data available to export.');
    return;
  }

  const headers = [
    'Visitor ID',
    'Full Name',
    'Company',
    'Category',
    'Phone',
    'Email',
    'Host Employee',
    'Department',
    'Purpose',
    'Status',
    'Check-In Time',
    'Check-Out Time',
    'Expected Duration',
    'ID Type',
    'ID Number',
    'Vehicle Number',
    'Vehicle Type',
    'VIP Status',
    'Blacklisted',
    'Registration Date',
  ];

  const escapeCSV = (str: string | undefined | null) => {
    if (!str) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const rows = visitors.map((v) => [
    escapeCSV(v.visitorId),
    escapeCSV(v.fullName),
    escapeCSV(v.company),
    escapeCSV(v.category),
    escapeCSV(v.phone),
    escapeCSV(v.email),
    escapeCSV(v.hostName),
    escapeCSV(v.departmentName),
    escapeCSV(v.purpose),
    escapeCSV(v.status),
    escapeCSV(v.checkInTime || v.expectedCheckIn || 'N/A'),
    escapeCSV(v.checkOutTime || 'N/A'),
    escapeCSV(v.expectedDuration),
    escapeCSV(v.idType),
    escapeCSV(v.idNumber),
    escapeCSV(v.vehicleNumber || 'N/A'),
    escapeCSV(v.vehicleType || 'None'),
    v.isVip ? '"YES"' : '"NO"',
    v.isBlacklisted ? '"YES"' : '"NO"',
    escapeCSV(v.createdAt),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
