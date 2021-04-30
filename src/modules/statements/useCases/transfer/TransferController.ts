import { Request, Response } from 'express';
import { container } from "tsyringe"
import { TransferUseCase } from "./TransferUseCase"
import { verify } from 'jsonwebtoken';
import authConfig from '../../../../config/auth';

class TransferController {
    async execute(request: Request, response: Response){

        const userToken = request.headers.authorization as string;
        const token = userToken.split(' ');
        const tokenData = verify(token[1], authConfig.jwt.secret);
        const from_user_id = tokenData.user.id;
        const to_user_id = request.params.user_id;
        const { amount, description } = request.body;

        const transferUseCase = container.resolve(TransferUseCase);

        const transferOperation = await transferUseCase.execute({from_user_id, to_user_id, amount, description})

        return response.status(201).json(transferOperation);
    }
}

export { TransferController }