Hello everyone! Shopizon is made using NextJS React framework.
Let's dive in:

## After Cloning the Repo:

First, install all the project and development dependencis by running the following command:

```bash
npm install
```

Second, you need to setup you MongoDB dev account. Do the following:
1. Access the Database Access page for our cluster [Link](https://cloud.mongodb.com/v2/6835d98fbce7aa63bafce41c#/security/database)
2. Click on "Add new database user" (right-side of the page)
3. Add the username and password (I recommend to generate it)
4. Ensure the user has read and write roles in the Built-in Role section.
5. Click on "Add User"

Third, let's update your .env file. You probably will not see one, but you will see a .env-example file.
1. Rename this file to .env  (don't worry, because we already have added .env to the .gitignore file).
2. Substitute <db_username> and <db_password> with the ones for the user you just created (remove the angled brackets)
3. .env is now fully configured!

Fourth, let's run it!

1. Open you terminal and run the following
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Good Stuff
- **Database:** to make everyone's lives easier, we will be using _Prisma ORM_ to manage our DB.
  - Don't worry about configuring it. It is already done. Just import using the following:
  ```js
  import { prisma as db } from "@/lib/db/prisma";
  ```
  - Here is a n example to retrieve all users:
  ```js
  import { prisma as db } from @/lib/db/prisma;

  export default async function MyComponent() {
    const users = await db.user.findMany();

    return(
      {users.map( user => (
        <li>{user.name}</li>
      ))}
    );
  }
  ```

  - Here is another example to look for a specific user:
  ```js
  import { prisma as db } from @/lib/db/prisma;

  export default async function MyComponent() {
    const users = await db.user.findUnique({
      where: {
        name: "Matheus"
      }
    });

    return(
      {users.map( user => (
        <li>{user.name}</li>
      ))}
    );
  }
  ```

  - However, if we organzied server-side actions in the @/lib/actions directory. For now these are just CRUD for the DB. But other server-side interactions can be created (not necessarily with the DB):
    - db_order_actions.ts
    - db_orderItem_actions.ts
    - db_product_actions.ts
    - db_user_actions.ts
    - db_vendor_actions.ts

    To use it is very simple. Check it out:
    - I have first imported the function to get the users (getUsers)
    - Then I ensured we had "async" in the component function definition, and "await" before calling the getUsers().
    - Next JS runs components on the server by default. If we need client-side components, we can add "user client" at the top, but usually only for small components that requires user interaction (e.g., buttons).

    ```js
    import { getUsers } from "@/lib/actions/db_user_actions";

    export default async function Home() {

      const users = await getUsers();

      return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <h1 className="text-2xl font-bold">Users</h1>
          <ul>
            {users.map((user) => (
              <li key={user.id} className="py-2">
                {user.name} - {user.email}
              </li>
            ))}
          </ul>
        </main>
      );
    }
    ```

  - Here is a nice video showing CRUD operations with Prisma: [Prisma ORM CRUD and NextJS Tricks](https://www.youtube.com/watch?v=QXxy8Uv1LnQ&t=2479s)

- **Branching:**
  - A new branch named "dev" is being introduced. When you are developing your features/components, please do the following:
    1. Checkout "dev". Ensure you are at the "dev" branch first.
    2. Run a git pull to obtain the latest and greatest from our repo.
    3. Create a new branch with your initials + task name
      - e.g., MA - Header Implementation

  - Expectation:
    - Well, taking the example above, it is expected that the branch "MA - Header Implementation" will carry several commits like "feat: implemented navbar", "feat: implemented search bar", etc. Don't just have a branch with one commit.

  - Merging to Dev:
    - As soon as you finalize your development, we can submit a merge request OR we can send a message on Teams and coordinate the merge during our meetings. [If you are a Git genius, please speak up!]. This part is not well defined, so let's use common sense and talk to each other before merging.