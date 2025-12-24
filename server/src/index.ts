import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const todos = await prisma.todo.findMany();
  console.log("Todos:", todos);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
