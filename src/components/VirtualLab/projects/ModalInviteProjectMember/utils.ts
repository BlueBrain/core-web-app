import { Member } from './types';

export function removeMember(members: Member[], member: Member) {
  return members.filter((item) => item.email !== member.email);
}

export function addMember(members: Member[], member: Member) {
  const index = members.findIndex(
    (item) => item.email.toLocaleLowerCase() === member.email.toLocaleLowerCase()
  );
  if (index < 0) return [...members, member];

  const newMembers = [...members];
  newMembers[index] = member;
  return newMembers;
}

const RX_EMAIL = /^[^@]+@[^@]+\.[^@.]+$/gi;

/**
 * This function is not accurate but at least it does not reject valid addresses,
 * and if it returns `false` you can be sure the address is invalid.
 *
 * But it can return `true` for invalid addresses. In the end, only the mail server
 * can tell.
 *
 * So this function is just an help for the user to avoid common mistakes.
 */
export function isValidEMail(email: string): boolean {
  RX_EMAIL.lastIndex = -1;
  return RX_EMAIL.test(email);
}
