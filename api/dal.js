const mysql = require('mysql')
const HTTPError = require('node-http-error')
const R = require('ramda')

////////////////
// users
///////////////

const addUser = (o) => {
    console.log('addUser: ', o)
    return new Promise((resolve, reject) => {
        if (o) {
            const connection = createConnection()
            connection.query(
                'INSERT INTO users SET ? ', omit('ID', o),
                function (err, result) {
                    if (err) return reject(err)
                    if (R.propOr(null, 'insertId', result)) {
                        resolve({ ok: true, id: result.insertId })
                    } else {
                        resolve({ ok: false, id: null })
                    }
                }
            )
            connection.end(err => { if (err) return reject(err) })
        } else {
            return reject(new HTTPError(400, 'User record is null'))
        }
    })
}

const getUser = (id => {
    return new Promise((resolve, reject) => resolve(read('users', 'ID', id, formatUser)))
})


const updateUser = (o => {
    return new Promise((resolve, reject) => {
        if (o) {
            const connection = createConnection()

            connection.query(
                'UPDATE users SET ? WHERE ID = ?',
                [prepUserForUpdate(o), o.ID],
                function (err, result) {
                    if (err) return reject(err)
                    console.log('Updated result: ', result)
                    if (propOr(0, 'affectedRows', result) > 0) {
                        return resolve({ ok: true, id: o.ID })
                    } else if (propOr(0, 'affectedRows', result) === 0) {
                        return reject(
                            new HTTPError(404, 'missing', {
                                name: 'not_found',
                                error: 'not found',
                                reason: 'missing'
                            })
                        )
                    }
                }
            )
            connection.end(function (err) { if (err) return reject(err) })
        } else {
            return reject(new HTTPError(400, 'User record is null'))
        }
    })

})

const prepUserForUpdate = o => {  //prepare a user object to send to update()
    // o = assoc('instrumentGroup', prop('group', o), o)
    // o = assoc('ID', prop('_id', o), o)
    // return compose(omit('_id'), omit('_rev'), omit('type'), omit('group'))(
    //   o
    // )
    return o
}

// Deleting a user is not supported:
// const deleteUser = (id, callback) => deleteRow('users', id, callback)


const listUsers = (lastItem, filter, limit, orderBy, orgID) => {
    return new Promise((resolve, reject) => {

        let where = ''
        let sql = `SELECT U.* FROM users U `
        let values = []
        let conditions = []

        ////JOINS:
        if (filter && filter.teamID) {
            sql += " INNER JOIN teamusers tu ON tu.teamID = ? "
            values.push(R.trim(filter.teamID))
        }
        if (!R.isNil(orgID)) {
            sql += " INNER JOIN orgusers ou ON ou.userID = U.ID AND ou.orgID = ?"
            values.push(parseInt(orgID))
        } else {
            return reject(new HTTPError(400, 'An organization ID or team ID is required to list users.'))
        }
        ////WHERE:
        if (filter && filter.name) { //typeof params.name !== 'undefined') {
            where += `(name LIKE ? OR displayName like ?)`
            values.push("%" + filter.name + "%");
            values.push("%" + filter.name + "%"); //YES, do this twice. Two question marks
        }
        if (where.length > 0) { sql += ' WHERE ' + where }  //if length > 1, you need to join where with ' AND '

        ///LAST ITEM:
        if (lastItem) {
            sql += ' name > ? '
            values.push(lastItem)
        }

        ////ORDER BY
        sql += " ORDER BY ? "
        if (R.not(R.isNil(orderBy))) {
            values.push(R.trim(orderBy))
        } else {  //set default order by"
            values.push('displayName')
        }

        if (R.not(R.isNil(limit))) {
            sql += " LIMIT ? "
            values.push(R.trim(limit))
        }

        console.log('sql:', sql, ', values: ', values)
        createConnection().query(sql, values, function (err, result) {
            if (err) return reject(err)
            return resolve(R.map(formatUser, result))
        })
    })
}


const formatUser = o => {
    // o = assoc('_id', prop('ID', o), o)
    // o = assoc('group', prop('instrumentGroup', o), o)
    // return compose(
    //     omit('ID'),
    //     omit('instrumentGroup'),
    //     assoc('_rev', null),
    //     assoc('type', 'instrument')
    // )(o)
    return o
}


////////////////
// tasks
///////////////

const addTask = (o) => {
    console.log('addTask: ', o)
    return new Promise((resolve, reject) => {
        if (o) {
            const connection = createConnection()
            connection.query(
                'INSERT INTO tasks SET ? ', omit('ID', o),
                function (err, result) {
                    if (err) return reject(err)
                    if (propOr(null, 'insertId', result)) {
                        resolve({ ok: true, id: result.insertId })
                    } else {
                        resolve({ ok: false, id: null })
                    }
                }
            )
            connection.end(err => { if (err) return reject(err) })
        } else {
            return reject(new HTTPError(400, 'Task record is null'))
        }
    })
}

const getTask = (id => {
    return new Promise((resolve, reject) => resolve(read('tasks', 'ID', id, formatTask)))
})






const updateTask = (o => {
    return new Promise((resolve, reject) => {
        if (o) {
            const connection = createConnection()
            console.log("updateTask: ", JSON.stringify(o))

            connection.query(
                'UPDATE tasks SET ? WHERE ID = ?',
                [prepTaskForUpdate(o), o.ID],
                function (err, result) {
                    if (err) return reject(err)
                    console.log('Updated result: ', result)
                    if (propOr(0, 'affectedRows', result) > 0) {
                        return resolve({ ok: true, id: o.ID })
                    } else if (propOr(0, 'affectedRows', result) === 0) {
                        return reject(
                            new HTTPError(404, 'missing', {
                                name: 'not_found',
                                error: 'not found',
                                reason: 'missing'
                            })
                        )
                    }
                }
            )
            connection.end(function (err) { if (err) return reject(err) })
        } else {
            return reject(new HTTPError(400, 'Task record is null'))
        }
    })

})

const prepTaskForUpdate = o => {  //prepare a task object to send to update()
    // o = assoc('instrumentGroup', prop('group', o), o)
    // o = assoc('ID', prop('_id', o), o)
    // return compose(omit('_id'), omit('_rev'), omit('type'), omit('group'))(
    //   o
    // )
    return o
}

// Deleting a task is not supported:
// const deleteTask = (id, callback) => deleteRow('tasks', id, callback)

// const listTasks = (lastItem, filter, limit, orderBy) => {
//     return new Promise((resolve, reject) => {
//         // filter = "group:strings"
//         if (filter) {
//             console.log('listUsers - TODO: SET UP THE FILTER')
//             // const arrFilter = split(':', filter) // ['','']   TODO: Update these filters (maybe to look for an org filter?)
//             // const filterField = head(arrFilter) === 'group' ? 'instrumentGroup' : head(arrFilter) // group  --> instrumentGroup
//             // const filterValue = last(arrFilter)
//             //filter = "instrumentGroup:strings"
//             filter = `${filterField}:${filterValue}`
//         }
//         if (isNil(orderBy)) orderBy = 'due DESC'  //set default sort field
//         resolve(queryDB('tasks', lastItem, filter, limit, formatTask, orderBy))
//     })
// }

const listTasks = (lastItem, filter, limit, orderBy, { orgID, userID }) => {
    return new Promise((resolve, reject) => {

        let where = ''
        let sql = `SELECT T.* FROM tasks T `
        let values = []
        let conditions = []

        ////JOINS:
        if (filter && filter.userID) {  //filter for one "tagged" user
            sql += " INNER JOIN tags ON tags.userID = ? "
            values.push(R.trim(filter.userID))
        } else if (filter && filter.teamID) {
            sql += " INNER JOIN teamusers tu ON tu.teamID = ? "
            values.push(R.trim(filter.teamID))
        } else {
            if (R.isNil(orgID) || isNaN(orgID)) {
                return reject(new HTTPError(400, 'A user, team or organization ID is required to list users.'))
            } else {
                sql += " INNER JOIN teams ON teams.orgID = ? and T.teamID = teams.ID"
                values.push(parseInt(orgID))
            }
        }
        ////WHERE:
        if (filter && filter.title) { //typeof params.name !== 'undefined') {
            if (where.length > 0) { where += ' AND ' }
            where += `(title LIKE ?)`
            values.push("%" + filter.name + "%");
        }
        if (where.length > 0) { sql += ' WHERE ' + where }  //if length > 1, you need to join where with ' AND '

        ///LAST ITEM:
        if (lastItem) {
            sql += ' name > ? '
            values.push(lastItem)
        }

        ////ORDER BY
        sql += " ORDER BY ? "
        if (R.not(R.isNil(orderBy))) {
            values.push(R.trim(orderBy))
        } else {  //set default order by"
            values.push('due DESC')
        }

        if (R.not(R.isNil(limit))) {
            sql += " LIMIT ? "
            values.push(R.trim(limit))
        }

        console.log('sql:', sql, ', values: ', values)
        createConnection().query(sql, values, function (err, result) {
            if (err) return reject(err)
            return resolve(R.map(formatUser, result))
        })
    })
}


const formatTask = o => {
    // o = assoc('_id', prop('ID', o), o)
    // o = assoc('group', prop('instrumentGroup', o), o)
    // return compose(
    //     omit('ID'),
    //     omit('instrumentGroup'),
    //     assoc('_rev', null),
    //     assoc('type', 'instrument')
    // )(o)
    return o
}



////////////////
// comments
///////////////

const addComment = (o) => {
    console.log('addComment: ', o)
    return new Promise((resolve, reject) => {
        if (o) {
            const connection = createConnection()
            connection.query(
                'INSERT INTO comments SET ? ', R.omit(['orgID', 'ID'], o),
                function (err, result) {
                    if (err) return reject(err)
                    if (R.propOr(null, 'insertId', result)) {
                        resolve({ ok: true, ID: result.insertId })
                    } else {
                        resolve({ ok: false, ID: null })
                    }
                }
            )
            connection.end(err => { if (err) return reject(err) })
        } else {
            return reject(new HTTPError(400, 'Comment record is null'))
        }
    })
}

const getComment = (id => {
    return new Promise((resolve, reject) => resolve(read('comments', 'ID', id, formatComment)))
})

const updateComment = (o => {
    return new Promise((resolve, reject) => {
        if (o) {
            const connection = createConnection()
            connection.on('error', function (err) { console.log('IN .ON:', err) })
            console.log("updateComment: ", JSON.stringify(o))
            connection.query(
                'UPDATE comments SET ?, edited=NOW() WHERE ID = ?',
                [prepCommentForUpdate(o), o.ID],
                function (err, result) {
                    if (err) { return reject(err) }
                    console.log('Updated result: ', result)
                    if (R.propOr(0, 'affectedRows', result) > 0) {
                        return resolve({ ok: true, id: o.ID })
                    } else if (R.propOr(0, 'affectedRows', result) === 0) {
                        return reject(
                            new HTTPError(404, 'missing', {
                                name: 'not_found',
                                error: 'not found',
                                reason: 'missing'
                            })
                        )
                    }
                }
            )
            connection.end(err => { if (err) return reject(err) })
        } else {
            return reject(new HTTPError(400, 'Comment record is null'))
        }
    })

})

const prepCommentForUpdate = o => {  //prepare a comment object to send to update()
    // o = assoc('instrumentGroup', prop('group', o), o)
    // o = assoc('ID', prop('_id', o), o)
    //Cannot change these fields:
    return R.omit(['taskID', 'parentID', 'authorID', 'ID', 'created', 'edited'], o)
}

// Deleting a comment is not supported:
// const deleteComment = (id, callback) => deleteRow('comments', id, callback)

const listComments = (lastItem, filter, limit, orderBy, { userID, orgID }) => {
    return new Promise((resolve, reject) => {

        let where = ''
        let sql = `SELECT C.* FROM comments C `
        let values = []
        let conditions = []

        ////JOINS:
        if (R.isNil(orgID) || isNaN(orgID)) {  //Security check to make sure they can't get any tasks not in their org
            return reject(new HTTPError(400, 'A user, team or organization ID is required to list users.'))
        } else {
            sql += " INNER JOIN tasks ON tasks.ID = C.taskID "
            sql += " INNER JOIN teams ON teams.orgID = ? and teams.ID = tasks.teamID"
            values.push(parseInt(orgID, 10))
        }

        ////WHERE:
        if (R.prop('taskID', filter)) {
            if (where.length > 0) { where += ' AND ' }
            where += `(taskID = ?) `
            values.push(R.prop('taskID', filter));
        }
        if (R.prop('authorID', filter)) {
            if (where.length > 0) { where += ' AND ' }
            where += `(authorID = ?) `
            values.push(R.prop('authorID', filter))
        }
        if (where.length > 0) { sql += ' WHERE ' + where }  //if length > 1, you need to join where with ' AND '

        ///LAST ITEM:
        if (lastItem) {
            sql += ' name > ? '
            values.push(lastItem)
        }

        ////ORDER BY
        sql += " ORDER BY ? "
        if (R.not(R.isNil(orderBy))) {
            values.push(R.trim(orderBy))
        } else {  //set default order by"
            values.push('due DESC')
        }

        if (R.not(R.isNil(limit))) {
            sql += " LIMIT ? "
            values.push(R.trim(limit))
        }

        console.log('sql:', sql, ', values: ', values)
        createConnection().query(sql, values, function (err, result) {
            if (err) return reject(err)
            return resolve(R.map(formatUser, result))
        })
    })
}


const formatComment = o => {
    // o = assoc('_id', prop('ID', o), o)
    // o = assoc('group', prop('instrumentGroup', o), o)
    // return compose(
    //     omit('ID'),
    //     omit('instrumentGroup'),
    //     assoc('_rev', null),
    //     assoc('type', 'instrument')
    // )(o)
    return o
}







//////////////////////////////
///  HELPERS
//////////////////////////////

function createConnection() {
    return mysql.createConnection({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        dateStrings: true
    })
}


const read = (tableName, columnName, id, formatter, callback) => {
    return new Promise((resolve, reject) => {
        if (id && tableName) {
            const connection = createConnection()

            connection.query(
                'SELECT * FROM ' +
                connection.escapeId(tableName) +
                ' WHERE ' +
                connection.escapeId(columnName) +
                ' = ? ',
                //SELECT * FROM vOrchestra WHERE orchestraID = 2

                [id],
                function (err, result) {
                    if (err) return reject(err)
                    if (propOr(0, 'length', result) > 0) {
                        const formattedResult = formatter(head(result))
                        console.log('Formatted Result: ', formattedResult)
                        return resolve(formattedResult)
                    } else {
                        //send back a 404
                        return reject(
                            new HTTPError(404, 'missing', {
                                name: 'not_found',
                                error: 'not found',
                                reason: 'missing'
                            })
                        )
                    }
                }
            )
        }
    })
}

const update = (tableName, o) => {
    return new Promise((resolve, reject) => {

        if (o) {
            const connection = createConnection()

            connection.query(
                'UPDATE ? SET ? WHERE ID = ?',
                [tableName, o, o.ID],
                function (err, result) {
                    if (err) return reject(err)
                    console.log('Updated result: ', result)

                    if (propOr(0, 'affectedRows', result) === 1) {
                        return resolve({ ok: true, id: o.ID })
                    } else if (propOr(0, 'affectedRows', result) === 0) {
                        return reject(
                            new HTTPError(404, 'missing', {
                                name: 'not_found',
                                error: 'not found',
                                reason: 'missing'
                            })
                        )
                    }
                }
            )

            connection.end(function (err) {
                if (err) return reject(err)
            })
        } else {
            return reject(new HTTPError(400, 'Missing information'))
        }
    })
}

const deleteRow = (tableName, id, callback) => {
    if (tableName && id) {
        const connection = createConnection()
        console.log('tableName: ', tableName)
        console.log('id: ', id)

        connection.query(
            'DELETE FROM ' + connection.escapeId(tableName) + ' WHERE ID = ?',
            [id],
            function (err, result) {
                if (err) return callback(err)
                if (result && result.affectedRows === 1) {
                    return callback(null, { ok: true, id: id })
                } else if (result && result.affectedRows === 0) {
                    return callback(
                        new HTTPError(404, 'missing', {
                            name: 'not_found',
                            error: 'not found',
                            reason: 'missing'
                        })
                    )
                }
            }
        )
        connection.end(err => err)
    } else {
        return callback(new HTTPError(400, 'Missing id or entity name.'))
    }
}

const queryDB = (tableName, lastItem, filter, limit, formatter, orderBy) => {
    return new Promise((resolve, reject) => {

        orderBy = isNil(orderBy) ? "" : " ORDER BY " + orderBy + " "
        limit = isNil(limit) ? "" : " LIMIT " + limit + " "

        const connection = createConnection()

        if (filter) {
            console.log('FILTER MODE')
            // filter  = "category:Oboe"
            const arrFilter = split(':', filter) // ['category','Oboe']
            const filterField = head(arrFilter)
            const filterValue = last(arrFilter)

            // SELECT *
            // FROM instrument
            // WHERE category = 'oboe'
            const sql = `SELECT *
                FROM ${connection.escapeId(tableName)}
                WHERE ${filterField} = ?
                ${orderBy}
                ${limit}`

            console.log('sql:', sql)

            connection.query(sql, [filterValue], function (err, result) {
                if (err) return reject(err)
                return resolve(map(formatter, result))
            })
        } else if (lastItem) {
            console.log('NEXT PAGE MODE')

            const sql = `SELECT *
                FROM ${connection.escapeId(tableName)}
                WHERE name > ?
                ${orderBy}
                ${limit}`

            console.log('SQL', sql)

            connection.query(sql, [lastItem], function (err, result) {
                if (err) return reject(err)
                return resolve(map(formatter, result))
            })
        } else {
            console.log('SIMPLE LIST. FIRST PAGE')
            const sql = `SELECT *
                FROM ${connection.escapeId(tableName)}
                ${orderBy}
                ${limit}`

            console.log('SQL', sql)

            connection.query(sql, function (err, result) {
                if (err) {
                    console.log('DAL - queryDB error! = ', err)
                    return reject(err)
                } else {
                    //console.log('queryDB result = ', JSON.stringify(result))
                    return resolve(map(formatter, result))
                }
            })
        }
    })

}

const dal = {
    addUser,
    getUser,
    updateUser,
    //deleteUser,
    listUsers,
    addTask,
    getTask,
    updateTask,
    //deleteTask,
    listTasks,
    addComment,
    getComment,
    updateComment,
    //deleteComment,
    listComments,
}

module.exports = dal