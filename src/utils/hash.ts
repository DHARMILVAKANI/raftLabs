import { hashSync, compareSync, genSaltSync } from 'bcrypt';

/**
 * This function is used to create salt and hash for given password or pin
 * @param password
 * @returns salt and hash for the password or pin
 */
export function createHash(password: string, autoGenSalt: boolean) {
  if (autoGenSalt) {
    return {
      hash: hashSync(password, 10),
    };
  } else {
    const salt = genSaltSync(10);
    return {
      salt,
      hash: hashSync(password, salt),
    };
  }
}
/**
 * This function is to match the user input password with user stored password
 * @param password passworrd which needs to be compared
 * @param hash password hash fetched from the database
 * @returns true if passwords matches otherwise false
 */
export function compare(password: string, hash: string): boolean {
  return compareSync(password, hash);
}
