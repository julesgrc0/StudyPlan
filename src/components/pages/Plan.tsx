import { useState, useCallback, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
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
  Divider,
  Spinner,
} from "@chakra-ui/react";
import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";

import { SingleDatepicker } from "chakra-dayzed-datepicker";
import {
  CourseItem,
  DEFAULT_STORAGE,
  EditModalProps,
  HiddenStatProps,
  PageAnimationType,
  PlanProps,
  RESOURCE_ID_NONE,
  daysOfWeek,
} from "../def";
import { CALENDAR_URL, PROJECT_ID, getCalendarData } from "../api";

import "../styles/plan.scss";

const EditModal = ({
  open,
  date,
  resourceId,
  setOpen,
  setPath,
  setStorage,
}: EditModalProps) => {
  const [newDate, setNewDate] = useState<Date>(date);

  return (
    <Modal isOpen={open} onClose={() => setOpen(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Paramètres</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="50px" pt="50px">
          <VStack>
            <SingleDatepicker
              date={newDate}
              onDateChange={(dateNext: Date) => {
                setNewDate(dateNext);
              }}
            />
            {newDate.getTime() != date.getTime() && (
              <Button
                bg="black"
                colorScheme="blackAlpha"
                w="100%"
                onClick={() => {
                  setOpen(false);
                  setPath(
                    `/planning/${resourceId}/${newDate.getTime()}`,
                    PageAnimationType.SPEED
                  );
                }}
              >
                Valider
              </Button>
            )}
            <Divider mt="10px" mb="10px" />
            <Button
              w="100%"
              colorScheme="gray"
              onClick={() => {
                setOpen(false);
                setStorage(DEFAULT_STORAGE);
                setPath("/", PageAnimationType.REVERSE);
              }}
            >
              Changer de classe
            </Button>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            bg="black"
            colorScheme="blackAlpha"
            onClick={() => setOpen(false)}
          >
            Fermer
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const HiddenStat = ({ children }: HiddenStatProps) => {
  const [show, setShow] = useState(false);

  return (
    <>
      <StatHelpText>
        <Button
          onClick={() => setShow(!show)}
          size={"xs"}
          fontWeight={"bold"}
          mt="10px"
          mb="15px"
        >
          {show ? "masquer" : "voir plus"}
        </Button>
        <br />
        {show
          ? children.split("<line>").map((text) => {
              return (
                <>
                  {text}
                  <br />
                </>
              );
            })
          : null}
      </StatHelpText>
    </>
  );
};

export default ({ storage, setPath, setStorage }: PlanProps) => {
  const { id, date } = useParams();
  const [items, setItems] = useState<CourseItem[]>([]);
  const [modalOpen, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const d_date = useMemo(
    () => (date ? new Date(parseInt(date)) : null),
    [date]
  );
  const i_id = useMemo(() => (id ? parseInt(id) : null), [id]);

  useEffect(() => {
    if (i_id == null || d_date == null) {
      setPath("/", PageAnimationType.DEFAULT);
      return;
    }

    getCalendarData(CALENDAR_URL, PROJECT_ID, i_id, d_date)
      .then((calendar) => {
        setLoading(false);
        if (calendar == null) {
          setPath("/", PageAnimationType.DEFAULT);
          return;
        }
        setItems(calendar);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [d_date, i_id, storage, setPath]);

  const onOperationDate = useCallback(
    (opt: number) => {
      if (d_date == null) return;

      d_date.setDate(d_date.getDate() + opt);
      setPath(`/planning/${i_id}/${d_date.getTime()}`, PageAnimationType.SPEED);
    },
    [i_id, d_date, setPath]
  );

  return (
    <div className="plan">
      <div className="head">
        <HStack>
          <IconButton
            aria-label=""
            icon={<ArrowBackIcon />}
            size={"lg"}
            bg="transparent"
            color={"white"}
            _hover={{ background: "transparent" }}
            onClick={() => onOperationDate(-1)}
          />
          <Text
            color={"white"}
            ml="10px"
            fontSize={"2xl"}
            onClick={() => setOpenModal(true)}
          >
            {daysOfWeek[d_date ? d_date.getDay() : 0]} {d_date?.getDate()}
          </Text>
          <IconButton
            aria-label=""
            icon={<ArrowForwardIcon />}
            size={"lg"}
            bg="transparent"
            color={"white"}
            _hover={{ background: "transparent" }}
            onClick={() => onOperationDate(1)}
          />
        </HStack>
      </div>
      {!loading && (
        <div className="scroll-section">
          {items.map((item, index) =>
            !item.is_course ? (
              <div key={index} className="no-course"></div>
            ) : (
              <div key={index}>
                <Stat>
                  <StatLabel>{item.location}</StatLabel>
                  <StatNumber>{item.summary}</StatNumber>
                  <StatHelpText>{item.time_info}</StatHelpText>
                  {item.description.length > 0 && (
                    <HiddenStat>{item.description}</HiddenStat>
                  )}
                </Stat>
              </div>
            )
          )}
        </div>
      )}
      {loading && (
        <VStack
          pos={"absolute"}
          top={"50%"}
          left={"50%"}
          transform={"translate(-50%,-50%)"}
        >
          <Spinner size="xl" thickness="4px" mb="20px" />
          <p>Chargement...</p>
        </VStack>
      )}
      <EditModal
        open={modalOpen}
        storage={storage}
        resourceId={i_id ?? RESOURCE_ID_NONE}
        date={d_date ?? new Date()}
        setOpen={setOpenModal}
        setPath={setPath}
        setStorage={setStorage}
      />
    </div>
  );
};
