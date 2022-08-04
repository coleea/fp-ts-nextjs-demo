// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import {pipe, flow} from 'fp-ts/function'
import * as t from 'io-ts'
import { fold } from 'fp-ts/Either'

export const dtoType = t.type({
  name : t.string  
})

// type Data = {
//   name: string
// } | {}

type ResType = {
  isSuccess : boolean
  msg : {
    name: string
  } | string    
}

// type dto = null 

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResType>
) {

  const doFailRes = (query : any) => {
    res.json({
      isSuccess : false
      ,msg : JSON.stringify('method not allowed')
    })
  }

  const doSuccessRes = (name : string ) => (randomVal : number) => {     
    (randomVal < 1 )
                      ? res.json({ 
                            isSuccess : true
                            ,msg : {
                              name: `Hello ${name}`
                            }
                        })
                      : res.json({
                          isSuccess : false
                          , msg : 'err occured in pipeling'
                      })
  }

  pipe(req.method
    , (method) => method === 'GET'
    )

  if (req.method === 'GET')  {

      console.log({query : req.query})

      pipe(
        req.query
        , dtoType.decode
        , fold(
            doFailRes
            , (query) => {
                  // flow(Math.random
                  //   , doSuccessRes(query.name))
                  pipe(
                    null
                    ,   Math.random
                      , doSuccessRes(query.name)
                      )
            }
        )
      )        
  } else {
    // res.status(400).end()
    res.json({
      isSuccess : false
      ,msg : JSON.stringify('method not allowed')
    })
  }

  // Math.random()
  // res.status(200).json({ name: 'John Doe' })
}