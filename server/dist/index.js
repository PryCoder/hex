"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// test.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const todos = await prisma.todo.findMany();
    console.log(todos);
}
main()
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=index.js.map