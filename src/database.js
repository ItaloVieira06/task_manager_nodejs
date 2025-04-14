import { info } from 'node:console'
import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table, item) {
    let data = this.#database[table] ?? []

    if (item && item.length !== 0) {
      if(Object.keys(item)[0] == "id"){
        data = data.filter(row => {
          return Object.entries(item).some(([_, value]) => {
            return row["id"].toLowerCase().includes(value.toLowerCase())
          })
        })
      }

      if(Object.keys(item)[0] == "name"){
        data = data.filter(row => {
          return Object.entries(item).some(([_, value]) => {
            return row["name"].toLowerCase().includes(value.toLowerCase())
          })
        })
      }

      if(Object.keys(item)[0] == "content"){
        data = data.filter(row => {
        return Object.entries(item).some(([_, value]) => {
          return row["content"].toLowerCase().includes(value.toLowerCase())
        })
      })}
        
    }

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist();

    return data;
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id == id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }else{
      id = rowIndex
      return id}
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id == id)
    const oldData = this.#database[table][rowIndex]

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...oldData, ...data }
      this.#persist()

    }
  }
}