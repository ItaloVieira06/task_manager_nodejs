import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
    {
     method: 'GET',
     path: buildRoutePath('/tasks/search'),
     handler: (req, res) => {
        const { search } = req.query
        const tasks = database.select('tasks', search ? {
            name: search,
            description: search,
            final_date: search,
        } : null)

        return res.end(JSON.stringify(tasks))
     }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks/register'),
        handler: (req, res) => {
            const {name, description, final_date} = req.body
            
                    const tasks = {
                        id: randomUUID(),
                        name,
                        description,
                        final_date,
                    }
            
                    database.insert('tasks', tasks)
            
                    return res.writeHead(201).end()
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/:id'),
        handlers: (req, res) => {
            const {id} = req.params

            database.delete('tasks', id)

            return res.writeHead(204).end()
        },
    },
    {
        method: 'PUT',
        path: buildRoutePath('/tasks/:id'),
        handlers: (req, res) => {
            const {id} = req.params
            const {name, description, final_date} = req.body

            database.update('tasks', id, {
                name,
                description,
                final_date,

            })

            return res.writeHead(204).end()
        },
    },

]