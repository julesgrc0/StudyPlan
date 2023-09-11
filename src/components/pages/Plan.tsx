import { useState, useCallback, useEffect, useMemo } from "react"
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

import { CourseItem, StorageData } from "../def"
import { CALENDAR_URL, PROJECT_ID, getCalendarRange } from "../api";
import '../styles/plan.scss'
import { useParams } from "react-router-dom"


type HiddenStatProps = {
    children: JSX.Element[] | JSX.Element | string;
}
type PlanProps = {
    storage: StorageData;

    setStorage: (value: object) => void;
    setPath: (path: string, rev: boolean) => void;
}

const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

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

export const Plan = ({ storage, setPath }: PlanProps) => {
    const { id, date } = useParams();
    const [items, setItems] = useState<CourseItem[]>([]);
    
    const d_date = useMemo(() => date ? new Date(parseInt(date)) : null, [date]);
    const i_id = useMemo(() => id ? parseInt(id) : null, [id]);

    useEffect(() => {
        if (storage.session == null || i_id == null || d_date == null) {
            setPath("/", false);
            return;
        }

        getCalendarRange(CALENDAR_URL, PROJECT_ID, i_id, d_date, d_date)
            .then((calendar) => {
                if (calendar == null) {
                    setPath("/", false)
                    return;
                }
                setItems(calendar);
            })

    }, [d_date, i_id, storage, setPath]);

    const onOperationDate = useCallback((opt: number) => {
        if (d_date == null) return;
        
        d_date.setDate(d_date.getDate() + opt);
        setPath(`/planning/${i_id}/${d_date.getTime()}`, opt <= 0)
    }, [i_id, d_date, setPath]);

    return <div className="plan">
        <div className="head">
            <HStack>
                <IconButton aria-label="" icon={<ArrowBackIcon />} size={'lg'} bg='transparent' color={'white'} _hover={{ background: 'transparent' }} onClick={() => onOperationDate(-1)} />
                <Text color={'white'} ml='10px' fontSize={'2xl'}>{daysOfWeek[d_date ? d_date.getDay() : 0]} {d_date?.getDate()}</Text>
                <IconButton aria-label="" icon={<ArrowForwardIcon />} size={'lg'} bg='transparent' color={'white'} _hover={{ background: 'transparent' }} onClick={() => onOperationDate(1)} />
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