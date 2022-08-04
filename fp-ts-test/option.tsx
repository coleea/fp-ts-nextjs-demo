import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import {pipe} from 'fp-ts/function'

pipe(
    [1,2]
    , A.map(O.fromNullable)
    , A.map(O.map(x => x > 0 ? O.some(x) : O.none))
    , console.log
)