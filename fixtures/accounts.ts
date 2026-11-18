/**
 * Builds a fresh address from U_REGISTER_EMAIL so each registration is a new account.
 * alison@example.com becomes alison+1710000000000@example.com
 */
export function uniqueRegisterEmail(): string | undefined {
  const inbox = process.env.U_REGISTER_EMAIL;
  if (!inbox || !inbox.includes('@')) {
    return undefined;
  }

  const at = inbox.lastIndexOf('@');
  const local = inbox.slice(0, at);
  const domain = inbox.slice(at + 1);
  return `${local}+${Date.now()}@${domain}`;
}

export function loginAccount(): { email: string; password: string } | undefined {
  const email = process.env.U_EMAIL;
  const password = process.env.U_PASSWORD;
  if (!email || !password) {
    return undefined;
  }
  return { email, password };
}
