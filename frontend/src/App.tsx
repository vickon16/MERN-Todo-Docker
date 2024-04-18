import React, { useEffect, useState } from "react";
import axios from "axios";

type TTodo = {
  id: string;
  todoTitle: string;
  todoDescription: string;
  createdAt: string;
  updatedAt: string;
};

function App() {
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [allTodos, setAllTodos] = useState<TTodo[] | []>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const apiUrl = "http://localhost:8000";

  const getTodos = async () => {
    const { data } = await axios.get(`${apiUrl}/api/todos`);
    setAllTodos(data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const handleRemoveTodo = async (id: string) => {
    if (!id) return;
    try {
      await axios.delete(`${apiUrl}/api/todo/${id}`);
      getTodos();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!todoTitle || !todoDescription) return;
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${apiUrl}/api/todos`, {
        todoDescription,
        todoTitle,
      });
      getTodos();
      setTodoDescription("");
      setTodoTitle("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <nav className="flex items-center w-full h-16 border-b border-border/80">
        <div className="container flex w-full items-center justify-between">
          <header className="!text-3xl font-semibold">Docker Todo</header>
          <button className="px-3 py-2 bg-primary rounded-md text-white">
            Login
          </button>
        </div>
      </nav>

      <section className="container flex items-center justify-center flex-col gap-y-6 mb-10">
        <div className="mt-10 space-y-2 text-center">
          <h1 className="text-4xl font-bold">Welcome to Docker Todo</h1>
          <p className="text-muted-foreground">Create your todo below</p>
        </div>

        <form className="w-full max-w-[600px] p-4 space-y-6">
          <div className="w-full space-y-1">
            <label htmlFor="todoTitle">Title</label>
            <input
              value={todoTitle}
              id="todoTitle"
              className="p-2 w-full border"
              onChange={(e) => setTodoTitle(e.target.value)}
              placeholder="Type your todo title here."
            />
          </div>

          <div className="w-full space-y-1">
            <label htmlFor="todoDescription">Description</label>
            <textarea
              value={todoDescription}
              id="todoDescription"
              rows={3}
              className="p-2 w-full border "
              onChange={(e) => setTodoDescription(e.target.value)}
              placeholder="Type your todo description here."
            />
          </div>

          <button
            disabled={isSubmitting}
            className="px-3 py-2 bg-primary rounded-md text-white w-full disabled:opacity-20"
            onClick={handleSubmit}
          >
            {isSubmitting ? "Submitting" : "Submit"}
          </button>
        </form>

        {/* Todo Display */}
        <div className="w-full space-y-6 mt-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Todo Lists</h1>
            <p className="text-muted-foreground">Your list of todos</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 place-items-center gap-4 w-full">
            {Array.isArray(allTodos) &&
              allTodos?.map((todo) => (
                <div
                  key={todo.id}
                  className="p-4 border rounded-md w-full space-y-2 shadow-sm drop-shadow-sm"
                >
                  <h3 className="font-semibold text-lg">{todo.todoTitle}</h3>
                  <p>{todo.todoDescription}</p>

                  <div className="w-full flex items-center justify-between gap-x-2">
                    <span className="text-sm text-muted-foreground">
                      {new Date(todo.createdAt).toDateString()}
                    </span>
                    <span
                      className="text-destructive text-sm cursor-pointer"
                      onClick={() => handleRemoveTodo(todo.id)}
                    >
                      remove
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
