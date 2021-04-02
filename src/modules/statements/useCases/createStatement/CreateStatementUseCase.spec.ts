import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let user: User;

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Create statement", () => {

    beforeAll(async () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        user = await createUserUseCase.execute({
            name: "test",
            email: "test@test",
            password: "1234"
        });

        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    })

    it("should be able to create an deposit", async () => {
        const statement = await createStatementUseCase.execute({
            user_id: user.id as string, 
            type: OperationType.DEPOSIT, 
            amount: 150, 
            description: 'Test deposit'
        });

        expect(statement).toHaveProperty("id");
        expect(statement.amount).toEqual(150);
    });

    it("should be able to create an withdraw", async () => {
        const statement = await createStatementUseCase.execute({
            user_id: user.id as string, 
            type: OperationType.WITHDRAW, 
            amount: 150, 
            description: 'Test withdraw'
        });

        expect(statement).toHaveProperty("id");
        expect(statement.amount).toEqual(150);
    });
})