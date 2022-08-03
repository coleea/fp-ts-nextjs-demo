import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import * as t from 'io-ts'
import { isRight } from 'fp-ts/lib/Either'
import {pipe} from 'fp-ts/function'
import { useState } from 'react'
import { fold } from 'fp-ts/Either'

// const User = t.type(string[])

// export const arrayType = t.type({
//   code: t.literal('OK'),
//   result: t.readonlyArray(t.string),
// })

// export const arrayType = t.type({
//   // t.readonlyArray(t.string)
//   // code: t.literal('OK'),
  
//   // result: t.readonlyArray(t.string),
// })

export const arrayType = t.array(t.string)

export const objType = t.type({
    name : t.string  
})

// static type, output, input, 
const string = new t.Type<string, string, unknown>(
  'string',
  (input: unknown): input is string => typeof input === 'string',
  // `t.success` and `t.failure` are helpers used to build `Either` instances
  (input, context) => (typeof input === 'string' ? t.success(input) : t.failure(input, context)),
  // `A` and `O` are the same, so `encode` is just the identity function
  t.identity
)


const Home: NextPage = () => {

  // (property) DOMAttributes<HTMLButtonElement>.onClick?: MouseEventHandler<HTMLButtonElement> | undefined

  const [userinfo, setUserinfo] = useState<{name : string}>()

  const fetchStn = (e : React.MouseEvent<HTMLButtonElement>) : void => {

    fetch('/api/hello?name=leekb')
      .then(res => res.json())
      .then(resDecoded => {

        const onTypeMismatch = (errors: t.Errors): string => {
           alert('다시 시도해 주세요') ;
          return `${errors.length} error(s) found`
        }

        // success handler
        const setUserData = (s: {name : string}) => { 
             pipe(s
              , setUserinfo
              // ,() => 'success'
            )
          // setUserinfo(s)
          return 'success'
        }

        if(resDecoded?.isSuccess === true) {

          pipe(
            resDecoded.msg
            , objType.decode
            // , arrayType.decode
            , fold(
                onTypeMismatch
                , setUserData)
          )

        } else {
          alert(`resDecoded?.isSuccess ${resDecoded?.isSuccess}`)
          throw new Error("api failed");          
        }
      }).catch(e => {
          alert(`promise.catch, ${e}`)
      })

    return 
  }

  return (
    <div className={styles.container}>
        <button onClick={fetchStn}>click me</button>
        ${pipe(
            userinfo
            ,JSON.stringify
          )}
    </div>
  )
}

export default Home
