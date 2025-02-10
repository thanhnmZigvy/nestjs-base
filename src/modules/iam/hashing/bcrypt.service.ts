import { Injectable } from '@nestjs/common';
import { compare, genSalt, hash } from 'bcrypt';

import { HashingService } from './hashing.service';

/**
 * BcryptService is a service that provides methods for hashing and comparing
 * passwords or other data using the bcrypt hashing algorithm.
 */
@Injectable()
export class BcryptService implements HashingService {
  /**
   * Hashes the provided data using bcrypt.
   *
   * @param {string | Buffer} data - The data to be hashed (e.g., a password).
   * @returns {Promise<string>} A promise that resolves to the hashed value of the data.
   */
  async hash(data: string | Buffer): Promise<string> {
    const salt = await genSalt(); // Generate a salt for hashing
    return hash(data, salt); // Hash the data with the generated salt
  }

  /**
   * Compares the provided data with an encrypted value to check if they match.
   *
   * @param {string | Buffer} data - The data to compare (e.g., a password).
   * @param {string} encrypted - The previously hashed value to compare against.
   * @returns {Promise<boolean>} A promise that resolves to true if the data matches the encrypted value, otherwise false.
   */
  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return compare(data, encrypted); // Compare the data with the encrypted value
  }
}
