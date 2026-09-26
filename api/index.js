import jsonServer from 'json-server';
import fs from 'fs';
import path from 'path';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

const originalDbPath = path.join(process.cwd(), 'database.json');
const isVercel = process.env.VERCEL === '1';
let dbPath = originalDbPath;

if (isVercel) {
  dbPath = path.join('/tmp', 'database.json');
  if (!fs.existsSync(dbPath)) {
    if (fs.existsSync(originalDbPath)) {
      fs.copyFileSync(originalDbPath, dbPath);
    } else {
      fs.writeFileSync(dbPath, JSON.stringify({ departments: [], courses: [], professors: [], allocations: [] }));
    }
  }
}

const router = jsonServer.router(dbPath);

server.use(middlewares);

server.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    req.url = req.url.replace('/api', '') || '/';
  }
  next();
});

server.use(router);

export default server;
