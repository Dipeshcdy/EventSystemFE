export default function formatNepaliCurrency(amount) {
  // Convert to number with 2 decimal places
  let num = parseFloat(amount).toFixed(2);
  // Split into integer and decimal parts
  let [integer, decimal] = num.split('.');

  // Nepali comma format: split from right: 3,2,2,...
  let lastThree = integer.slice(-3);
  let otherNumbers = integer.slice(0, -3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }
  let formattedOtherNumbers = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  
  // Combine formatted parts
  let formattedAmount = formattedOtherNumbers + lastThree + '.' + decimal;

  return 'रु ' + formattedAmount;
}
