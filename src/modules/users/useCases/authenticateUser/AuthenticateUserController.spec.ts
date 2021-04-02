import request from "supertest";
import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";

let connection: Connection;

describe("Authenticate user", () => {
    beforeAll( async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
      });

      it("should be able to return a token", async () => {
        await request(app)
        .post("/api/v1/users")
        .send({
            name: "test",
            email: "test@test",
            password: "1234"
        });

        const response = await request(app)
        .post("/api/v1/sessions")
        .send({
            email: "test@test",
            password: "1234"
        });

        expect(response.status).toBe(200);
        expect(response.body.user.name).toEqual("test");
        expect(response.body.user.email).toEqual("test@test");
        expect(response.body).toHaveProperty("token");
      })
})