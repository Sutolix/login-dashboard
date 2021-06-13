import type { NextApiRequest, NextApiResponse } from 'next'
import mongoose from 'mongoose'

import '../../utils/dbConnection'

import { UserModel } from '../../models/user'
import * as jwt from '../../services/authentication'

export interface NewUser extends mongoose.Document {
  name: string,
  email: string,
  password: string,
  timestamps: string,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === 'POST') {
    try {
      const result = await UserModel.create(req.body)

      const { password, ...user } = result.toObject() // remove password of return

      const token = jwt.sign({ userID: user.id })

      res.send({ user, token })

    } catch (err) {
      res.status(400).send(err)
    }
  } else {
    res.status(200).json({ method: 'Another' })
  }
}