import { createServer, IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';

interface Task {
    id: number;
    title: string;
    completed: boolean;
}

let tasks: Task[] = [];

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = parse(req.url || '', true);
    const method = req.method || '';
    const pathname = parsedUrl.pathname || '';

    if (method === 'GET' && pathname === '/tasks') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(tasks));
    } 
    else if (method === 'POST' && pathname === '/tasks') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const newTask: Task = JSON.parse(body);
            newTask.id = Date.now();
            newTask.completed = false;
            tasks.push(newTask);
            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newTask));
        });
    }
    else if (method === 'PUT' && pathname.startsWith('/tasks/')) {
        const taskId = parseInt(pathname.split('/')[2]);
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            const update = JSON.parse(body);
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = update.completed;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(task));
            }
            else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Task not found');
            }
        });
    } 
    else if (method === 'DELETE' && pathname.startsWith('/tasks/')) {
        const taskId = parseInt(pathname.split('/')[2]);
        tasks = tasks.filter(t => t.id !== taskId);
        res.writeHead(204);
        res.end();
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
};

const server = createServer(requestListener);
const PORT = 3001;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
