import { useRef } from 'react'
import { Rerousel } from 'rerousel'
import { BetaCard } from '@includes/components/NewsCards'

export function HomeBanner(props) {
    //@ts-ignore
	const [ref, setRef] = useRef(undefined);

    return(
        <div className="w-full h-auto container content-center align-middle mx-auto my-12">
            <Rerousel itemRef={ref} interval={7000}>
                <BetaCard passedRef={ref} />
            </Rerousel>
        </div>
    )
}