import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";

interface IRequest {
    from_user_id: string; 
    to_user_id: string;
    amount: number;
    description: string;
}

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
    TRANSFER = 'transfer'
  }

@injectable()
class TransferUseCase {
    constructor(
        @inject('StatementsRepository')
        private statementsRepository: IStatementsRepository,
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ){}

    async execute({from_user_id, to_user_id, amount, description}: IRequest) {

        const balance = await this.statementsRepository.getUserBalance({
            user_id: from_user_id
        });
        
        if(amount > balance.balance) return new AppError("insufficient balance");

        const transferOperation = await this.statementsRepository.create({
            user_id: from_user_id,
            amount,
            description: "Transferência de valor",
            type: OperationType.TRANSFER
        });

        await this.statementsRepository.create({
            user_id: to_user_id,
            amount,
            description: "Transferência de valor",
            type: OperationType.DEPOSIT
        });

        return transferOperation;

    }
}

export { TransferUseCase }