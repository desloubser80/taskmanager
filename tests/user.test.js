const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId,userOne,populateDb} = require('./fixtures/db.js')

beforeEach(populateDb)

test('Should sign up a new user', async ()=> {
    const response = await request(app).post('/users').send({
        name: "Des",
        email: "des@example.com",
        password: "password1"
    }).expect(201)

    //check database
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //check the response body {user,token}    
    expect(response.body).toMatchObject({
        user : {
        name: "Des",
        email: "des@example.com"
        },
        token : user.tokens[0].token 
    })

    expect(user.password).not.toBe('password1');
})

test('Should log in exisitng user', async ()=> {
    const response = await request(app).post('/users/login').send({
        email : userOne.email,
        password : userOne.password
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.tokens[1].token).toBe(response.body.token)
})

test('Should not log in nonexistent user', async ()=> {
    await request(app).post('/users/login').send({
        email : 'kosie@noways.com',
        password : userOne.password
    }).expect(400)
})

test('Should get user profile', async()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete user profile', async()=>{
    const response = await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull
})

test('Should not delete user profile', async()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should upload avatar', async ()=>{
    await request(app)
    .post('/users/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/philly.jpg')
    .expect(200) 

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid field', async ()=>{
    const response = await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({age:70})
    .expect(200)

    expect(response.body).toMatchObject({
        "name": "moni",
        "age": 70
    })
})

test('Should not update invalid/nonexisting field', async ()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({
        location:"Bellville"
    })
    .expect(400)
})