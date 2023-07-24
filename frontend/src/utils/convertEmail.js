export function convertEmail(email) {
  if(!email) return;
  
  const atIndex = email.indexOf("@");
  const username = email.substring(0, atIndex);

  // Determine the number of characters to keep visible in the username
  const visibleCharacters = Math.min(Math.max(username.length - 1, 1), 3);

  const obfuscatedUsername =
    username.slice(0, visibleCharacters) +
    "*".repeat(Math.max(username.length - visibleCharacters, 0));

  return obfuscatedUsername + email.substring(atIndex);
}
