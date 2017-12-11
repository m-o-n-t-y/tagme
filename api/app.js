require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const HTTPError = require('node-http-error')
const bodyParser = require('body-parser')
const R = require('ramda')
//const cors = require('cors')
const checkJwt = require('./jwt')
const DAL = require('./dal')

const checkRequiredFields = require('./lib/check-required-fields')

const userRequiredFieldCheck = checkRequiredFields([
    'name',
    'orgID',
    'email',
    'displayName'
])

const taskRequiredFieldCheck = checkRequiredFields([
    'ID'
])

const commentRequiredFieldCheck = checkRequiredFields([
    'authorID',
    'comment',
    'taskID'
])

//app.use(cors({ credentials: true }))
app.use(bodyParser.json())

app.get('/', (req, res, next) => {
    res.send({ name: "Task Accountability" })
})

//////////////
/// USERS
//////////////

app.get('/users', (req, res, next) => {
    //res.status(200).send(req.query) 

    let orgID = 1 //TODO: Set orgID by session context from jwt. Currently hardcoding Org 1

    DAL.listUsers(null, formatFilterObject(req.query.filter), null, null, orgID)
        .then(docs => res.status(200).send(docs))
        .catch(err => res.status(404).send(err))
})

const formatFilterObject = (filter, teamID) => {
    // If there are multiple filter params in URL, reg.query.filter is like: { "filter": ["task:2", "parent:3"] }
    // If there is only one filter, reg.query.filter is like: "task:2"
    //This proc formats it as an object if it's not already, and adds the orgID from the JWT for security
    if (R.isNil(filter)) {
        filter = []
    } else { //convert filter to array if it's not already... if there is more than one "filter" arg in the URL, it's already an array
        if (R.not(filter.constructor === Array)) { filter = Array.of(filter) }
    }
    let orgID = 1 //TODO: Set orgID by session context from jwt. Currently hardcoding Org 1
    return R.compose(
        R.assoc("orgID", orgID),
        R.when(() => !isNaN(teamID), R.assoc("teamID", parseInt(teamID))),   //only do TEAMID if it exists
        R.fromPairs,  //convert array to object
        R.map(o => R.split(':', o))
    )(filter)
}

//app.post('/users', checkJwt, (req, res, next) => {   <-- TODO: use checkJwt!
app.post('/users', (req, res, next) => {
    if (R.isEmpty(R.prop('body'), req)) {
        return next(new HTTPError(400, 'Missing request body.  Content-Type header should be application/json.'))
    }
    const body = R.compose(
        R.omit(['ID', '_rev']),
        //merge(__, { orgID: ${current session's Org ID} }),  <-- TODO set Org by session value, not anything passed in!
        R.prop('body')
    )(req)

    const missingFields = userRequiredFieldCheck(body)
    if (R.not(R.isEmpty(missingFields))) return next(new HTTPError(400, `Missing required fields: ${R.join(' ', missingFields)}`))

    DAL.addUser(body)
        .then(result => {
            res.status(201).send(result)
        })
        .catch(err => next(new HTTPError(err.status, err.message)))
})
//app.post('/users', checkJwt, (req, res, next) => {   <-- TODO: use checkJwt!
app.post('/users', (req, res, next) => {
    if (R.isEmpty(R.prop('body'), req)) {
        return next(new HTTPError(400, 'Missing request body.  Content-Type header should be application/json.'))
    }
    const body = R.compose(
        R.omit(['ID', '_rev']),
        //merge(__, { orgID: ${current session's Org ID} }),  <-- TODO set Org by session value, not anything passed in!
        R.prop('body')
    )(req)

    const missingFields = userRequiredFieldCheck(body)
    if (R.not(R.isEmpty(missingFields))) return next(new HTTPError(400, `Missing required fields: ${R.join(' ', missingFields)}`))

    DAL.addUser(body)
        .then(result => {
            res.status(201).send(result)
        })
        .catch(err => next(new HTTPError(err.status, err.message)))
})

// app.put('/users', checkJwt, (req, res, next) => { <-- TODO: use checkJwt!
app.put('/users', (req, res, next) => {
    const body = R.prop('body', req)
    if (R.isEmpty(body)) {
        return next(new HTTPError(400, 'Missing request body. Content-Type header must be application/json'))
    }

    const missingFields = userRequiredFieldCheck(body)
    if (R.not(R.isEmpty(missingFields))) return next(new HTTPError(400, `Missing required fields: ${join(' ', missingFields)}`))

    DAL.updateUser(body)
        .then(result => res.status(200).send(result))
        .catch(err => next(new HTTPError(err.status, err.message)))
})

app.get('/users/:id', (req, res, next) => {
    DAL.getUser(req.params.id)
        .then(docs => res.status(200).send(docs))
        .catch(err => res.status(404).send(err))
})


//////////////
/// TASKS
//////////////

app.get('/tasks', (req, res, next) => {
    let userID = 1 //TODO: Set userID by req.user.sub from jwt. Currently hardcoding Org 1
    let orgID = 1 //TODO: Set orgID by "req.user.scope.orgID" from jwt. Currently hardcoding Org 1
    const options = { "userID": userID, "orgID": orgID }
    DAL.listTasks(null, formatFilterObject(req.query.filter), null, null, options)
        .then(docs => res.status(200).send(docs))
        .catch(err => res.status(404).send(err))
})


//app.post('/tasks', checkJwt, (req, res, next) => {   <-- TODO: use checkJwt!
app.post('/tasks', (req, res, next) => {
    if (R.isEmpty(R.prop('body'), req)) {
        return next(new HTTPError(400, 'Missing request body.  Content-Type header should be application/json.'))
    }
    const body = R.compose(
        R.omit(['ID', '_rev']),
        //merge(__, { orgID: ${current session's Org ID} }),  <-- TODO set Org by session value, not anything passed in!
        R.prop('body')
    )(req)

    const missingFields = taskRequiredFieldCheck(body)
    if (R.not(R.isEmpty(missingFields))) return next(new HTTPError(400, `Missing required fields: ${R.join(', ', missingFields)}`))

    DAL.addTask(body)
        .then(result => {
            res.status(201).send(result)
        })
        .catch(err => next(new HTTPError(err.status, err.message)))
})

// app.put('/tasks', checkJwt, (req, res, next) => { <-- TODO: use checkJwt!
app.put('/tasks', (req, res, next) => {
    const body = R.prop('body', req)
    if (R.isEmpty(body)) {
        return next(new HTTPError(400, 'Missing request body. Content-Type header must be application/json'))
    }

    //Currently only checking for ID, as we could be updating a single field:
    const missingFields = taskRequiredFieldCheck(body)
    if (R.not(R.isEmpty(missingFields))) return next(new HTTPError(400, `Missing required fields: ${join(' ', missingFields)}`))

    DAL.updateTask(body)
        .then(result => res.status(200).send(result))
        .catch(err => next(new HTTPError(err.status, err.message)))
})

app.get('/tasks/:id/comments', (req, res, next) => {
    DAL.getTaskComments(req.params.id)
        .then(docs => res.status(200).send(docs))
        .catch(err => res.status(404).send(err))
})

app.get('/tasks/:id', (req, res, next) => {
    DAL.getTask(req.params.id)
        .then(docs => res.status(200).send(docs))
        .catch(err => res.status(404).send(err))
})


//////////////
/// Comments
//////////////

app.get('/comments', (req, res, next) => {
    let userID = 1 //TODO: Set userID by req.user.sub from jwt. Currently hardcoding Org 1
    let orgID = 1 //TODO: Set orgID by "req.user.scope.orgID" from jwt. Currently hardcoding Org 1
    const options = { "userID": userID, "orgID": orgID }
    DAL.listComments(null, formatFilterObject(req.query.filter), null, null, options)
        .then(docs => res.status(200).send(docs))
        .catch(err => res.status(404).send(err))
})


//app.post('/comments', checkJwt, (req, res, next) => {   <-- TODO: use checkJwt!
app.post('/comments', (req, res, next) => {
    if (R.isEmpty(R.prop('body'), req)) {
        return next(new HTTPError(400, 'Missing request body.  Content-Type header should be application/json.'))
    }
    let userID = 1 //TODO: Set userID by req.user.sub from jwt. Currently hardcoding Org 1
    let orgID = 1 //TODO: Set orgID by "req.user.scope.orgID" from jwt. Currently hardcoding Org 1
    const body = R.compose(
        R.omit(['ID', '_rev']),
        R.assoc('authorID', userID),
        R.assoc('orgID', orgID),
        //merge(__, { orgID: ${current session's Org ID} }),  <-- TODO set Org by session value, not anything passed in!
        R.prop('body')
    )(req)

    const missingFields = commentRequiredFieldCheck(body)
    if (R.not(R.isEmpty(missingFields))) return next(new HTTPError(400, `Missing required fields: ${R.join(', ', missingFields)}`))

    DAL.addComment(body)
        .then(result => {
            res.status(201).send(result)
        })
        .catch(err => next(new HTTPError(err.status, err.message)))
})

// app.put('/comments', checkJwt, (req, res, next) => { <-- TODO: use checkJwt!
app.put('/comments', (req, res, next) => {
    const body = R.prop('body', req)
    if (R.isEmpty(body)) {
        return next(new HTTPError(400, 'Missing request body. Content-Type header must be application/json'))
    }

    //Currently only checking for ID, as we could be updating a single field:
    if (!R.propOr(null, 'comment', body)) return next(new HTTPError(400, `Missing required fields: comment`))

    DAL.updateComment(body)
        .then(result => res.status(200).send(result))
        .catch(err => {
            res.status(R.propOr(500, 'status', err)).send(err)  //<-- Get rid of HTTPError everywhere, and do this
            // //NOTE propOR on the error... if status is null (likely from a SQL error) you won't even get the message. Set a default!
            // next(new HTTPError(R.propOr(500, 'status', err), err.message))
        })
})

app.get('/comments/:id', (req, res, next) => {
    DAL.getComment(req.params.id)
        .then(docs => res.status(200).send(docs))
        .catch(err => res.status(404).send(err))
})



app.use(function (err, req, res, next) {
    console.log(req.method, ' ', req.path, ' ', 'error ', err)
    res
        .status(err.status || 500)
        .send({ status: err.status, message: err.message })
})

if (!module.parent) {
    app.listen(port, () => console.log('Listening on port ', port))
}

module.exports = app
