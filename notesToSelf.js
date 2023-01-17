//     "typeorm": "ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js -d src/ormdatasource.ts", 
//     "db:drop": "npm run typeorm schema:drop",
//     "db:create": "npm run typeorm migration:generate "
//     "db:migrate": "npm run typeorm migration:run"
// these commands in the cli are important for the migrations, typeorm is a custom command,that makes a connection to typeorm,
// ts-node -r tsconfig-paths/register is used to run a typescript file,
//  and then we want to run the typeorm cli tool in the path described,
// with the datasource object created in src/ormdatasource.ts
// this is the connection and activation of the typeorm cli tool,
// schema:drop is a builtin command of typeorm that clears the current db we are connected to,
// migration:generate (path/filename) used to be wrote with -n for indicating name, creates a new migration,
// when creating a new migration i need to only set the path to where i want the migration to be inserted at,and with it's name.
// which is a subject i am not fully knoledgeable at yet,
// db:migrate exectues all the migrations that we have made.


// when using postgres cli 
// in the folder insert command psql database username or (just postgres postgres to enter as postgres to all databases)
// asked of password
// then \dt to display tables, \d <TABLE_NAME> to display a specific table's definition \c to connect to a database
// and regular SQL queries with ;



// process of thought when creating a service function, think of all possible bad outcomes,the one that i need to throw an exception upon,
// and only then provide the neccesary information/action.