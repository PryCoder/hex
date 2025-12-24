// test.js (CommonJS)
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
    await prisma.todo.createMany({
        data: [
            { title: "hithete" }
        ]
    });
    const todos = await prisma.todo.findMany();
    console.log("Todos:", todos);
}
main()
    .catch((err) => {
    console.error("Prisma error:", err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
export {};
