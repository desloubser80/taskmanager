const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const {userOneId,userOne,populateDb,userTwo,taskOne} = require('./fixtures/db.js')

beforeEach(populateDb)

test('Should create task for user', async ()=>{
    const response = await request(app)
    .post('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        description : "Clean your room"
    })
    .expect(201)

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull()
    expect(task.completed).toBe(false)
    expect(task.description).toBe('Clean your room')
})

test('get all tasks for userOne', async ()=> {
    const response = await request(app).get('/tasks')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .expect(200)
    
    expect(response.body.length).toBe(2)

})

test('Should not allowed deleting of task not beloning to user', async()=>{
    const response = await request(app)
    .delete(`/tasks/ ${taskOne._id}`)
    .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
    .expect(500)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

