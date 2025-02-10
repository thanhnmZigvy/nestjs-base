import { Injectable } from '@nestjs/common';

/**
 * HashingService is an abstract class that defines the contract for
 * hashing and comparing data. Any concrete implementation of this
 * service must provide the specified methods for hashing and comparison.
 */
@Injectable()
export abstract class HashingService {
  /**
   * Hashes the provided data.
   *
   * @param {string | Buffer} data - The data to be hashed (e.g., a password).
   * @returns {Promise<string>} A promise that resolves to the hashed value of the data.
   */
  abstract hash(data: string | Buffer): Promise<string>;

  /**
   * Compares the provided data with an encrypted value to check if they match.
   *
   * @param {string | Buffer} data - The data to compare (e.g., a password).
   * @param {string} encrypted - The previously hashed value to compare against.
   * @returns {Promise<boolean>} A promise that resolves to true if the data matches the encrypted value, otherwise false.
   */
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}
