import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
    {
     method: 'GET',
     path: buildRoutePath('/tasks'),
     handler: (req, res) => {
        const { search } = req.query
        const tasks = database.select('tasks', search ? {
            name: search,
            description: search,
            final_date: search,
        } : [])

        if(tasks.length == 0) return res.end('Nada foi encontrado')
        else return res.end(JSON.stringify(tasks))
     }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const {name, description, final_date} = req.body
            
                    const tasks = {
                        id: randomUUID(),
                        name,
                        description,
                        final_date,
                    }
            
                    database.insert('tasks', tasks)
            
                    return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/delete'),
        handler: (req, res) => {
            const {id} = req.query

            database.delete('tasks', id)

            return res.writeHead(204).end()
        },
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/edit'),
        handler: (req, res) => {
            const {id} = req.query
            const {name, description, final_date} = req.body

            const tasks = database.update('tasks', id, {
                name,
                description,
                final_date,

            })

            return res.end(JSON.stringify(tasks))
        },
    },

]