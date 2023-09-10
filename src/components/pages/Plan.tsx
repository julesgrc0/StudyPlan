import { useState } from "react"
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Button,
    IconButton,
    Text,
    HStack
} from "@chakra-ui/react"
import {
    ArrowBackIcon,
    ArrowForwardIcon
} from "@chakra-ui/icons"

import { CourseItem } from "../def"
import '../styles/plan.scss'


type HiddenStatProps = {
    children: JSX.Element[] | JSX.Element | string;
}
type PlanProps = {
    items: CourseItem[];

    onNext: ()=>void,
    onPrev: ()=>void,
    setPath: (path: string) => void;
}



export const HiddenStat = ({ children }: HiddenStatProps) => {
    const [show, setShow] = useState(false);

    return <>
        <StatHelpText>
            <Button onClick={() => setShow(!show)} size={'xs'} fontWeight={'bold'} mt='10px' mb='15px'>
                {show ? 'masquer' : 'voir plus'}
            </Button>
            <br />
            {show ? children : null}
        </StatHelpText>
    </>
}

export const Plan = ({ onNext, onPrev, setPath, items }: PlanProps) => {
    
    return <div className="plan">
        <div className="head">
            <HStack>
                <IconButton aria-label="" icon={<ArrowBackIcon />} size={'lg'} bg='transparent' color={'white'} _hover={{ background: 'transparent' }} onClick={onPrev} />
                <Text color={'white'} ml='10px' fontSize={'2xl'}>Lundi 11</Text>
                <IconButton aria-label="" icon={<ArrowForwardIcon />} size={'lg'} bg='transparent' color={'white'} _hover={{ background: 'transparent' }} onClick={onNext} />
            </HStack>
        </div>
        <div className="scroll-section">
            {items.map(item =>
                !item.is_course
                    ?
                    <div className="no-course"></div>
                    :
                    <div>
                        <Stat>
                            <StatLabel>{item.location}</StatLabel>
                            <StatNumber>{item.summary}</StatNumber>
                            <HiddenStat>
                                {item.description}
                            </HiddenStat>
                        </Stat>
                    </div>
            )}
        </div>
    </div>
}