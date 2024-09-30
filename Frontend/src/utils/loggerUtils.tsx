export default function customLogger(obj: any): string {
  let output = '';

  // Helper function to format values (including nested objects/arrays)
  function formatValue(value: any): string {
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2); // Format nested objects or arrays
    }
    return String(value);
  }

  // Check if the input is an array or object
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      output += `${index}: ${formatValue(item)}, `;
    });
  } else if (typeof obj === 'object') {
    for (const [key, value] of Object.entries(obj)) {
      output += `${key}: ${formatValue(value)}, `;
    }
  } else {
    output = formatValue(obj); // Handle non-object types
  }

  // Remove the trailing comma and space
  output = output.slice(0, -2);

  // Log the formatted output
  console.log(output);

  // Return the formatted string
  return output;
}
