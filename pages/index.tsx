import { useEffect, useState } from 'react'
import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Head from 'next/head'
import Image from 'next/image'

import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import { isRight } from 'fp-ts/lib/Either'
import {pipe} from 'fp-ts/function'
import { fold } from 'fp-ts/Either'

import * as t from 'io-ts'
import Swal from 'sweetalert2'
import * as RD from '@devexperts/remote-data-ts'

// =============================================

export const arrayType = t.array(t.string)
export const objType = t.type({
    name : t.string  
}) ;

const doErr = (params : any) => {
  return new Error('1234')
}

const fetchStn = () => {
  return fetch('/api/hello?name=leekb')
  .then(res => res.json())
}

const requestData = async () => {

  const res = await fetch('/api/hello?name=leekb')
                        .then(res => res.json())

  const resValid = pipe(
    res
    ,objType.decode
    ,E.mapLeft(() => new Error('1234'))
  )

  // if(E.isRight(resValid)) {
  //     return resValid.right 
  // }

  if(E.isLeft(resValid)) {
    throw new TypeError('1234')
  }
  // objType.decode(res)
  return resValid.right 
}

const makeRequest = <A, >() : TE.TaskEither<Error, { name: string; } > => {
  // task either는 task만 수행할 것

  // const requestData2 = async () => {
  //   return TE.tryCatch(fetchStn, doErr)
  //   // pipe(
  //   //   TE.tryCatch(fetchStn, doErr)
  //   // )
  // }

  return TE.tryCatch(
    // 코드 파이프라인은 선언적으로 작성할것
    fetchStn
    // , requestData
    , doErr
   )
  
} ;

const useApi = <L, R>(te : TE.TaskEither<L, R>) : RD.RemoteData<L, R> => {

    const [data, setData] = useState<RD.RemoteData<L,R>>(RD.initial)
    // useState<RD.RemoteData<L,R>>()

    // return E.fold<L, R, RD.RemoteData<L, R>>(RD.failure, RD.success)
    // alert(data)

    useEffect(() => {
        // {"_tag":"RemoteInitial"}
        // alert(JSON.stringify(data))    

        te().then(x => {
          // alert(`x : ${x}`)
          setData(
            pipe(
              x
              ,E.fold<L, R, RD.RemoteData<L, R>>(RD.failure, RD.success)
            )
          )
        })

    }, [])

    // return [1,2]
    return data
}

const Home: NextPage = () => {

  const data = useApi(makeRequest())

  useEffect(() => {
    // data
    // alert(JSON.stringify(data))    
  }, [data])

  // const [userinfo, setUserinfo] = useState<{name : string}>()
 
  // const fetchStn = (e : React.MouseEvent<HTMLButtonElement>) : void => {

  //   fetch('/api/hello?name=leekb')
  //     .then(res => res.json())
  //     .then(resDecoded => {

  //       const onTypeMismatch = (errors: t.Errors): string => {
  //          alert('다시 시도해 주세요') ;
  //         return `${errors.length} error(s) found`
  //       }

  //       // success handler
  //       const setUserData = (s: {name : string}) => { 
  //            pipe(s
  //             , setUserinfo
  //             // ,() => 'success'
  //           )
  //         // setUserinfo(s)
  //         return 'success'
  //       }

  //       if(resDecoded?.isSuccess === true) {

  //         pipe(
  //           resDecoded.msg
  //           , objType.decode
  //           // , E.mapLeft(() => new Error("Failed to decode user sign up data"))
  //           // , E.mapLeft(() => new Error('1234'))
  //           // , arrayType.decode
  //           , fold(
  //               onTypeMismatch
  //               , setUserData)
  //         )

  //       } else {
  //         Swal.fire(`resDecoded?.isSuccess ${resDecoded?.isSuccess}`)
  //         // alert(`resDecoded?.isSuccess ${resDecoded?.isSuccess}`)
  //         throw new Error("API failed. Retry Again");          
  //       }
  //     }).catch(e => {
  //         Swal.fire({
  //           // title : `promise.catch, ${e.message}`,
  //           title : `${e.message}`,
  //           timer: 1000,
  //         })
  //         // alert(`promise.catch, ${e}`)
  //     })

  //   return 
  // }

  return (
    <div className={'flex justify-center items-center h-screen'}>
        {/* 
        <button onClick={fetchStn} className={'bg-white text-black'} style={{ fontSize : '3rem', justifyContent : 'center'}}>
          click me
        </button> 
        */}

        {pipe(
          data
          , RD.fold(
            () => <p>1</p>
            , () => <p>1</p>
            , (err) => <p>{JSON.stringify(err)}</p>
            , (e) => <p>{JSON.stringify(e)}</p>
          )
        )}
        {/* <button>hi</button> */}

        {/* <div className='' style={{}}>
            {userinfo?.name 
                && `${userinfo?.name}`}
        </div> */}
       
        {/* {pipe(
            userinfo?.name
            ,JSON.stringify
          )} */}

        {/* <button onClick={}>asdf</button> */}
    </div>
  )
}

export default Home
