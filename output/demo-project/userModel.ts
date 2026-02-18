interface User {
  id: string;
  name: string;
  email: string;
}

function getUsers(): User[] {
  const users: User[] = [
    { id: "1", name: "Alice Smith", email: "alice.smith@example.com" },
    { id: "2", name: "Bob Johnson", email: "bob.johnson@example.com" },
    { id: "3", name: "Charlie Brown", email: "charlie.brown@example.com" },
  ];
  return users;
}
