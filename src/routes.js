import { Database } from "./database.js"
import { randomUUID } from "node:crypto"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
    {
        method: 'GET',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { id, name, content } = req.query

            if (id != undefined && name != undefined && content != undefined) { return res.end('Para pesquisas com filtros, utilize um (e apenas um) filtro de pesquisa!') }
            if (id != undefined && name != undefined || id != undefined && content != undefined || name != undefined && content != undefined) { return res.end('Para pesquisas com filtros, utilize um (e apenas um) filtro de pesquisa!') }

            if (!id == undefined) {
                const tasks = database.select('tasks', id ? { id: id } : [])

                if (tasks.length == 0) return res.end('Nada foi encontrado')
                else return res.end(JSON.stringify(tasks))
            }
            if (!name == undefined) {
                const tasks = database.select('tasks', name ? { name: name } : [])

                if (tasks.length == 0) return res.end('Nada foi encontrado')
                else return res.end(JSON.stringify(tasks))
            }
            if (!content == undefined) {
                const tasks = database.select('tasks', content ? { content: content } : [])

                if (tasks.length == 0) return res.end('Nada foi encontrado')
                else return res.end(JSON.stringify(tasks))
            }

            if (id == undefined && name == undefined && content == undefined) {
                const tasks = database.select('tasks', id ? { id: id } : [])

                if (tasks.length == 0) return res.end('Nada foi encontrado')
                else return res.end(JSON.stringify(tasks))
            }
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/tasks'),
        handler: (req, res) => {
            const { name, content } = req.body

            if (typeof (content) !== "string" || typeof (name) !== "string") { return res.end("Valores inválidos") }
            if (content === " " || name === " ") { return res.end("Valores inválidos") }

            const tasks = {
                id: randomUUID(),
                name,
                content,
                isClosed: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            }

            database.insert('tasks', tasks)

            return res.end(JSON.stringify(tasks))
        }
    },
    {
        method: 'DELETE',
        path: buildRoutePath('/tasks/delete'),
        handler: (req, res) => {
            const { id } = req.query

            database.delete('tasks', id)

            return res.writeHead(204).end()
        },
    },
    {
        method: 'PATCH',
        path: buildRoutePath('/tasks/edit'),
        handler: (req, res) => {
            const { id } = req.query
            const { name, content, isClosed } = req.body

            if (typeof (content) !== "string" && content !== undefined || typeof (name) !== "string" && name !== undefined || typeof (isClosed) !== 'boolean' && isClosed !== undefined) { return res.end("Valores inválidos") }
            if (content === " " || name === " ") { return res.end("Valores inválidos") }

            if (isClosed == undefined) {
                const tasks = database.update('tasks', id, {
                    name,
                    content,
                    isClosed: false,
                    updatedAt: new Date(),

                })
                return res.end(JSON.stringify(tasks))
            }

            if (name == undefined) {
                const tasks = database.update('tasks', id, {
                    content,
                    isClosed,
                    updatedAt: new Date(),

                })
                return res.end(JSON.stringify(tasks))
            }
            if (content == undefined) {
                const tasks = database.update('tasks', id, {
                    name,
                    isClosed,
                    updatedAt: new Date(),

                })
                return res.end(JSON.stringify(tasks))

            }
            else {
                const tasks = database.update('tasks', id, {
                    name,
                    content,
                    isClosed,
                    updatedAt: new Date(),

                })

                return res.end(JSON.stringify(tasks))

            }

        },
    },

]