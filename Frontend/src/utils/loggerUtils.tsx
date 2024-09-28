export default function customLogger(obj: any) {
    let output = '';
    for (const [key, value] of Object.entries(obj)) {
      output += `${key}: ${value}, `;
    }
    // Remove the trailing comma and space
    output = output.slice(0, -2);
    
    // Log the formatted output
    console.log(output);
  
    // Return the formatted string
    return output;
  }
  