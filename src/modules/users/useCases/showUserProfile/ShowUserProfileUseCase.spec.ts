import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;

let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("User get data", () => {
    
    beforeAll(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);

    });
    
    it("should be able to return the user data", async () => {
        const user = await createUserUseCase.execute({
            name: "test",
            email: "test@test",
            password: "1234"
        });

        const userInfo = await showUserProfileUseCase.execute(user.id as string);

        expect(userInfo.id).toEqual(user.id);
        expect(userInfo.email).toEqual("test@test");
    })

})