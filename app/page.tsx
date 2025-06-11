import { getUsers } from '@/lib/actions/db_user_actions';
export default async function Home() {
  const users = await getUsers();
  return (
    <main className="">
      <h1>Hello world!</h1>

      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))};
      </ul>
    </main>
  );
}
