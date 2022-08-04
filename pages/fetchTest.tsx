// =============================================

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

export const objType = t.type({
    name : t.string  
}) ;

const doErr = (params : any) => {
  return [ {value : params, context : [], message : 'network error' } ]
  // return new Error('1234')
}

const fetchStn = () => {
  return fetch('/api/hello?name=leekb')
          .then(res => res.json())
}

const doRequestAndCheck = <A, >() : TE.TaskEither<t.Errors, { name: string; } > => {
  // 코드 파이프라인은 선언적으로 작성할것
  return pipe(
    TE.tryCatch(fetchStn, doErr)
   ,TE.chain(x => TE.fromEither(objType.decode(x)))
   )
} ;

const useApi = <L, R>(requestTE : TE.TaskEither<L, R>) : RD.RemoteData<L, R> => {

  // usestate를 Option으로 하는 방법과 RD로 하는 방법의 총 2가지 선택지가 있다
    const [data, setData] = useState<RD.RemoteData<L,R>>(RD.initial)

    //           resDecoded.msg
  //           , objType.decode

    useEffect(() => {

        requestTE().then(x => {
          setData(
            pipe(
              x
              // , objType.decode
              // , TE.chain(x => TE.fromEither(objType.decode(x))) 
              ,E.fold<L, R, RD.RemoteData<L, R>>(RD.failure, RD.success)
            )
          )
        })

    }, [])

    return data
}

const Home: NextPage = () => {


  const data = pipe(
                  null
                  ,doRequestAndCheck
                  ,useApi
                )

  // const data = useApi(makeRequest())

  // useEffect(() => {

  // }, [data])

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

    </div>
  )
}

export default Home
