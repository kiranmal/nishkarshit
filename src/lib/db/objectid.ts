import { randomBytes } from "node:crypto";

/**
 * 24-character hex identifier, the same format the application has always used for record ids
 * (so existing URLs like /admin/blogs/<id>, stored references and migrated data keep working).
 * Layout: 4-byte timestamp + 5 random bytes + 3-byte counter — sortable by creation time.
 */
let counter = randomBytes(3).readUIntBE(0, 3);
const HEX24 = /^[0-9a-fA-F]{24}$/;

export class ObjectId {
  private readonly hex: string;

  constructor(id?: string | ObjectId) {
    if (id === undefined) {
      counter = (counter + 1) % 0xffffff;
      const b = Buffer.alloc(12);
      b.writeUInt32BE(Math.floor(Date.now() / 1000), 0);
      randomBytes(5).copy(b, 4);
      b.writeUIntBE(counter, 9, 3);
      this.hex = b.toString("hex");
    } else {
      const s = String(id);
      if (!HEX24.test(s)) throw new Error("Invalid id: must be a 24-character hex string.");
      this.hex = s.toLowerCase();
    }
  }
  static isValid(id: unknown): boolean {
    return typeof id === "string" ? HEX24.test(id) : id instanceof ObjectId;
  }
  toHexString(): string { return this.hex; }
  toString(): string { return this.hex; }
  toJSON(): string { return this.hex; }
  equals(other: unknown): boolean { return String(other) === this.hex; }
  getTimestamp(): Date { return new Date(parseInt(this.hex.slice(0, 8), 16) * 1000); }
}
