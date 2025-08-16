export function exportToCSV(data, filename) {
  const csvRows = [];
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  for (const row of data) {
    csvRows.push(headers.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  
  const anchor = document.createElement('a');
  anchor.setAttribute('href', url);
  anchor.setAttribute('download', filename);
  anchor.click();
  URL.revokeObjectURL(url);
}

function replacer(key, value) {
  return value === null ? '' : value;
}