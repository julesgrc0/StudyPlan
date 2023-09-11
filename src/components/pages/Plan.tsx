import { useState, useCallback, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import {
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    Button,
    IconButton,
    Text,
    HStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    VStack,
    Divider
} from "@chakra-ui/react"
import {
    ArrowBackIcon,
    ArrowForwardIcon
} from "@chakra-ui/icons"
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import { CourseItem, DEFAULT_STORAGE, StorageData } from "../def"
import { CALENDAR_URL, PROJECT_ID, getCalendarRange } from "../api";
import '../styles/plan.scss'



type HiddenStatProps = {
    children: string;
}

type EditModalProps = {
    open: boolean;
    resourceId: number;
    date: Date;

    setOpen: (value: boolean) => void;
    setPath: (path: string, rev: boolean) => void;
    setStorage: (value: object) => void;
}

type PlanProps = {
    storage: StorageData;

    setStorage: (value: object) => void;
    setPath: (path: string, rev: boolean) => void;
}


const daysOfWeek = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

export const EditModal = ({ open, date, resourceId, setOpen, setPath, setStorage }: EditModalProps) => {
    const [newDate, setNewDate] = useState<Date>(date);

    return <Modal isOpen={open} onClose={() => setOpen(false)}>
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>Paramètres</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb='50px' pt='50px'>

                <VStack>
                    <SingleDatepicker
                        date={newDate}
                        onDateChange={(dateNext: Date) => {
                            setNewDate(dateNext)
                        }}
                    />
                    {newDate.getTime() != date.getTime() && <Button bg='black' colorScheme='blackAlpha' w='100%' onClick={()=>{
                        setOpen(false);
                        setPath(`/planning/${resourceId}/${newDate.getTime()}`, newDate.getTime() < date.getTime())
                    }}>Valider</Button>}
                    <Divider mt='10px' mb='10px' />
                    <Button w='100%' colorScheme='gray' onClick={() => {
                        setOpen(false);
                        setPath("/selection", true);
                    }}>Changer de classe</Button>
                    <Button w='100%' colorScheme='red' onClick={() => {
                        setOpen(false);
                        setStorage(DEFAULT_STORAGE)
                        setPath("/", true);
                    }}>Déconnexion</Button>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button variant={'ghost'} mr={3} onClick={() => setOpen(false)}>
                    Fermer
                </Button>
                <Button bg='black' colorScheme='blackAlpha' onClick={() => setOpen(false)}>Enregistrer</Button>
            </ModalFooter>
        </ModalContent>
    </Modal>

}

export const HiddenStat = ({ children }: HiddenStatProps) => {
    const [show, setShow] = useState(false);

    return <>
        <StatHelpText>
            <Button onClick={() => setShow(!show)} size={'xs'} fontWeight={'bold'} mt='10px' mb='15px'>
                {show ? 'masquer' : 'voir plus'}
            </Button>
            <br />
            {show ? children.split('<line>').map(text => {
                return <>
                    {text}<br />
                </>
            }) : null}
        </StatHelpText>
    </>
}

export const Plan = ({ storage, setPath, setStorage }: PlanProps) => {
    const { id, date } = useParams();
    const [items, setItems] = useState<CourseItem[]>([]);
    const [modalOpen, setOpenModal] = useState<boolean>(false);

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
                <Text color={'white'} ml='10px' fontSize={'2xl'} onClick={() => setOpenModal(true)}>{daysOfWeek[d_date ? d_date.getDay() : 0]} {d_date?.getDate()}</Text>
                <IconButton aria-label="" icon={<ArrowForwardIcon />} size={'lg'} bg='transparent' color={'white'} _hover={{ background: 'transparent' }} onClick={() => onOperationDate(1)} />
            </HStack>
        </div>
        <div className="scroll-section">
            {items.map((item, index) =>
                !item.is_course
                    ?
                    <div key={index} className="no-course"></div>
                    :
                    <div key={index}>
                        <Stat>
                            <StatLabel>{item.location}</StatLabel>
                            <StatNumber>{item.summary}</StatNumber>
                            <StatHelpText>
                                {item.time_info}
                            </StatHelpText>
                            {item.description.length > 0 && <HiddenStat>
                                {item.description}
                            </HiddenStat>}
                        </Stat>
                    </div>
            )}
        </div>
        <EditModal open={modalOpen} resourceId={i_id ?? 0} date={d_date ?? new Date()} setOpen={setOpenModal} setPath={setPath} setStorage={setStorage} />
    </div>
}

