import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user", () => {

    beforeAll(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    })

    it("should be able to create an user", async () => {
        const user = await createUserUseCase.execute({
            name: "test",
            email: "test@test",
            password: "1234"
        });

        expect(user).toHaveProperty("id");
        expect(user.email).toEqual("test@test");
    });
})