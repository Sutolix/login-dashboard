import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'

import '../../utils/dbConnection'

import { UserModel } from '../../models/user'
import * as jwt from '../../services/authentication'

const authMiddleware = async (req: NextApiRequest, res: NextApiResponse, next: NextApiHandler) => {
  const [ hashType,token ] = req.headers.authorization.split(' ')

  try {
    const paylod = await jwt.verify(token)

    const user = await UserModel.findById(paylod.userID)

    if(!user) {
      return res.send(401)
    }
    
  } catch (errr) {
    res.send(errr)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse, next: NextApiHandler) {

  await authMiddleware(req, res, next)

  if (req.method === 'GET') {
    try {
      const users = await UserModel.find()
  
      res.send(users)
      
    } catch (err) {
      res.send(err)
    }
  } else {
    res.status(200).json({ method: 'Another' })
  }
}