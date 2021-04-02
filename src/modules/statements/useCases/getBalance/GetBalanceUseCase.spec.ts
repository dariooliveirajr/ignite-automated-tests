import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let user: User;

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("Get Balance", () => {

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
   
        await createStatementUseCase.execute({
            user_id: user.id as string, 
            type: OperationType.DEPOSIT, 
            amount: 150, 
            description: 'Test deposit'
        });

        await createStatementUseCase.execute({
            user_id: user.id as string, 
            type: OperationType.WITHDRAW, 
            amount: 140, 
            description: 'Test withdraw'
        });

        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
   
    })

    it("should be able to return the user balance", async () => {
        const balance = await getBalanceUseCase.execute({user_id: user.id as string});

        expect(balance.balance).toEqual(10);
        expect(balance.statement.length).toEqual(2);
    });
})