import { FC, useRef } from 'react'
import { Rerousel } from 'rerousel'
import { BetaCard } from '@includes/components/Cards'

export const HomeBanner: FC = () => {
    //@ts-ignore
	const [ref, setRef] = useRef(undefined);

    return(
        //@ts-ignore
        <Rerousel itemRef={ref} interval={7000}>
            <BetaCard passedRef={ref} />
        </Rerousel>
    )
}