import { hash } from "bcryptjs";
import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import { v4 as uuid } from 'uuid'

let connection: Connection;

describe("Show user profile", () => {
    beforeAll( async () => {
        connection = await createConnection();
        await connection.runMigrations();

     const id = uuid();
     const password = await hash("1234", 8);

     await connection.query(
         `INSERT INTO USERS(id, name, email, password, created_at, updated_at)
         values('${id}', 'test', 'test@test', '${password}', 'now()', 'now()')`
    );
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to show user profile", async () => {
        const tokenResponse = await request(app)
        .post("/api/v1/sessions")
        .send({
            email: "test@test",
            password: "1234"
        });

        const response = await request(app)
        .get("/api/v1/profile")
        .set({
            Authorization: `Bearer ${tokenResponse.body.token}`
        });
        
        expect(response.status).toBe(200);
        expect(response.body.name).toEqual("test");
        expect(response.body.email).toEqual("test@test");
    })
})