import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase

describe("User authentication", () => {
    
    beforeAll(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);

        await createUserUseCase.execute({
            name: "test",
            email: "test@test",
            password: "1234"
        });
    });

    it("should be able to authenticate a user", async () => {
        const userToken = await authenticateUserUseCase.execute({
            email: "test@test",
            password: "1234"
        });

         expect(userToken).toHaveProperty("token");
    })

})