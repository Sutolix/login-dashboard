import type { NextApiRequest, NextApiResponse } from 'next'

import '../../utils/dbConnection'

import { UserModel } from '../../models/user'
import * as jwt from '../../services/authentication'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'GET') {
    const [ hashType, hash ] = req.headers.authorization.split(' ')

    const [ email, password ] = Buffer.from(hash, 'base64')
      .toString()
      .split(':')
  
    try {
  
      const user = await UserModel.findOne({email, password})
  
      if(!user) {
        return res.send(401)
      }
  
      const token = jwt.sign({userID: user.id})
  
      res.send({ user, token })
  
    } catch (err) {
      res.status(err)
    }
  } else {
    res.status(200).json({ method: 'Another' })
  }
}