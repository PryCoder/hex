// CommonJS compatible import
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const todo = await prisma.todo.create({
        data: { title: "Learn Prisma" },
    });
    console.log("Created Todo:", todo);
    const allTodos = await prisma.todo.findMany();
    console.log("All Todos:", allTodos);
}
main()
    .catch((e) => console.error(e))
    .finally(async () => {
    await prisma.$disconnect();
});
export {};
//# sourceMappingURL=index.js.map