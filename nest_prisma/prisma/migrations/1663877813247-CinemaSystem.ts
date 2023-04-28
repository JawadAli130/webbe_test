import { Migration } from '../cli/migration';
import { PrismaService } from '../../src/prisma/prisma.service';
const prisma = new PrismaService();

export default class implements Migration {
  async up() {
    try {
      await prisma.$queryRaw`CREATE TABLE "movies" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "duration" INTEGER NOT NULL,
        "description" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

      await prisma.$queryRaw`CREATE TABLE "showrooms" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "capacity" INTEGER NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;
    
      await prisma.$queryRaw`CREATE TABLE "shows" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "startTime" DATETIME NOT NULL,
        "endTime" DATETIME NOT NULL,
        "isBookedOut" BOOLEAN NOT NULL DEFAULT false,
        "movieId" INTEGER NOT NULL REFERENCES "movies" ("id"),
        "showroomId" INTEGER NOT NULL REFERENCES "showrooms" ("id"),
        "price" DECIMAL(10, 2) NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;
    
      await prisma.$queryRaw`CREATE TABLE "seat_types" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "premiumPercentage" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;
    
      await prisma.$queryRaw`CREATE TABLE "seats" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "rowNumber" INTEGER NOT NULL,
        "seatNumber" INTEGER NOT NULL,
        "seatTypeId" INTEGER NOT NULL REFERENCES "seat_types" ("id"),
        "showroomId" INTEGER NOT NULL REFERENCES "showrooms" ("id"),
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;
    
      await prisma.$queryRaw`CREATE TABLE "bookings" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "showId" INTEGER NOT NULL REFERENCES "shows" ("id"),
        "seatId" INTEGER NOT NULL REFERENCES "seats" ("id"),
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

     } catch (e) {
      console.error(e);
    } finally {
      await prisma.$disconnect();
    }
  }

  async down() {
    await prisma.$queryRaw`DROP TABLE "movies"`;
    await prisma.$queryRaw`DROP TABLE "showrooms"`;
    await prisma.$queryRaw`DROP TABLE "shows"`;
    await prisma.$queryRaw`DROP TABLE "seat_types"`;
    await prisma.$queryRaw`DROP TABLE "seats"`;
    await prisma.$queryRaw`DROP TABLE "bookings"`;
  }
}
