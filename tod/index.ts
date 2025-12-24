// index.ts
// Use CommonJS import style
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Create a new Todo
  const newTodo = await prisma.todo.create({
    data: {
      title: "Learn Prisma with TypeScript",
      completed: false,
    },
  });
  console.log("Created Todo:", newTodo);
const deleted = await prisma.todo.delete({
    where: {id:1}
})
console.log("Deleted ",deleted);
  // Fetch all Todos
  const allTodos = await prisma.todo.findMany();
  console.log("All Todos:", allTodos);

  // Optional: Update a Todo
  // const updatedTodo = await prisma.todo.update({
  //   where: { id: 1 },
  //   data: { completed: true },
  // });
  // console.log("Updated Todo:", updatedTodo);

  // Optional: Delete a Todo
  // const deletedTodo = await prisma.todo.delete({ where: { id: 1 } });
  // console.log("Deleted Todo:", deletedTodo);
}

// Run main
main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
