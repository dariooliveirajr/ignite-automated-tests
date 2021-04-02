import { GetStatementOperationUseCase } from './GetStatementOperationUseCase';
import { User } from "../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let user: User;

let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

let getStatementOperationUseCase: GetStatementOperationUseCase;

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
        getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    })

    it("should be able to get an deposit statement", async () => {
        const statement = await createStatementUseCase.execute({
            user_id: user.id as string, 
            type: OperationType.DEPOSIT, 
            amount: 150, 
            description: 'Test deposit'
        });

        const getStatement = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string
        });

        expect(getStatement).toHaveProperty("id");
        expect(getStatement.type).toEqual("deposit");
        expect(getStatement.amount).toEqual(150);
    });

    it("should be able to get an withdraw statement", async () => {
        const statement = await createStatementUseCase.execute({
            user_id: user.id as string, 
            type: OperationType.WITHDRAW, 
            amount: 150, 
            description: 'Test withdraw'
        });

        const getStatement = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string
        });

        expect(getStatement).toHaveProperty("id");
        expect(getStatement.type).toEqual("withdraw");
        expect(getStatement.amount).toEqual(150);
    });
})