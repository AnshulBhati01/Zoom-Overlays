export function parseVote(message: string): 'yes' | 'no' | null {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Check for yes variations
  if (['yes', 'y', 'yeah', 'yep', 'sure', '👍'].includes(normalizedMessage)) {
    return 'yes';
  }
  
  // Check for no variations
  if (['no', 'n', 'nope', 'nah', '👎'].includes(normalizedMessage)) {
    return 'no';
  }
  
  return null;
}

