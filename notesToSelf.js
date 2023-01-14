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
// which is a subject i am now fully knoledgeable at yet,
// db:migrate exectues all the migrations that we have made.
