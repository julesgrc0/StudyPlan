import { useState, useCallback, useEffect, lazy, Suspense } from "react";
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
  VStack,
  Spinner,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  ArrowForwardIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { MdNotifications, MdNotificationsOff } from "react-icons/md";
import { Network } from "@capacitor/network";
import {
  CourseItem,
  ItemButtonsProps,
  PageAnimationType,
  PlanProps,
  RESOURCE_ID_NONE,
  daysOfWeek,
} from "../def";
import { CALENDAR_URL, PROJECT_ID, getCalendarData } from "../api";

import { LocalNotifications } from "@capacitor/local-notifications";
import "../styles/plan.scss";

const EditModal = lazy(() => import('./modals/EditModal'));

const ItemButtons = ({ item, storage, setReminder }: ItemButtonsProps) => {
  const [show, setShow] = useState(false);

  return <>
    <HStack>
      <Button
        onClick={() => setShow(!show)}
        size={"xs"}
        fontWeight={"bold"}

      >
        {show ? "masquer" : "voir plus"}
      </Button>
      {storage.notification &&
        <IconButton
          onClick={() => {
            setReminder(
              item,
              !storage.reminders[item.time.getTime()]
            )
          }

          }
          size={"xs"}
          bg={
            storage.reminders[item.time.getTime()]
              ? "red"
              : "black"
          }
          colorScheme={
            storage.reminders[item.time.getTime()]
              ? "red"
              : "black"
          }
          fontWeight={"bold"}
          _hover={{
            background: storage.reminders[item.time.getTime()]
              ? "red !important"
              : "black",
          }}
          aria-label=""
          icon={
            storage.reminders[item.time.getTime()] ? (
              <MdNotificationsOff />
            ) : (
              <MdNotifications />
            )
          }
        />}
    </HStack>
    {show
      ? item.description.split("<line>").map((text, index) => {
        return (
          <Text key={index}>
            {text}
            <br />
          </Text>
        );
      })
      : null}
  </>
}

export default ({ storage, setPath, setStorage }: PlanProps) => {
  const { id, date } = useParams();
  const [items, setItems] = useState<CourseItem[]>([]);
  const [modalOpen, setOpenModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const [pageDate, setPageDate] = useState<Date | null>(null);
  const [pageId, setPageId] = useState<number | null>(null);
  const [displayDate, setDisplayDate] = useState<string>("");

  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    let newDate = date ? new Date(parseInt(date)) : null;
    let newId = id ? parseInt(id) : null;

    if (newDate == null || newId == null) {
      setPath("/", PageAnimationType.DEFAULT);
      return;
    }

    setPageDate(newDate);
    setPageId(newId);

    const today = new Date();
    let addMonth =
      newDate.getMonth() != today.getMonth()
        ? `/${String(newDate.getMonth() + 1).padStart(2, "0")}`
        : "";
    let addYear =
      newDate.getFullYear() != today.getFullYear()
        ? `/${newDate.getFullYear()}`
        : "";

    setDisplayDate(
      `${daysOfWeek[newDate.getDay()]
      } ${newDate.getDate()}${addMonth}${addYear}`
    );

    getCalendarData(CALENDAR_URL, PROJECT_ID, newId, newDate)
      .then((calendar) => {
        setLoading(false);
        if (calendar == null) {
          setPath("/", PageAnimationType.DEFAULT);
          return;
        }
        setItems(calendar);


        calendar.map(item => {
          if (IsTodayDate(item.time)) {
            onChangeReminder(item, true);
          }
        })
      })
      .catch(() => {
        setLoading(false);
      });
  }, [date, id, storage, isConnected]);

  useEffect(() => {
    Network.getStatus().then((status) => {
      setIsConnected(status.connected);
    });

    Network.addListener("networkStatusChange", (status) => {
      setIsConnected(status.connected);
    });

    return () => {
      Network.removeAllListeners();
    };
  }, []);


  const onChangeDate = useCallback(
    (opt: number) => {
      if (pageDate == null) return;

      pageDate.setDate(pageDate.getDate() + opt);
      setPath(
        `/planning/${pageId}/${pageDate.getTime()}`,
        PageAnimationType.SPEED
      );
    },
    [pageId, pageDate, setPath]
  );

  const onChangeReminder = useCallback(
    (item: CourseItem, set: boolean) => {
      let newReminders = storage.reminders;
      newReminders[item.time.getTime()] = set;

      setStorage({
        ...storage,
        reminders: newReminders,
      });

      set ? createNotification(item) : removeNotification(item);
    },
    [storage, setStorage, createNotification, removeNotification]
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
            onClick={() => onChangeDate(-1)}
          />
          <Text
            color={"white"}
            ml="10px"
            fontSize={"2xl"}
            onClick={() => setOpenModal(true)}
          >
            {displayDate}
          </Text>
          <IconButton
            aria-label=""
            icon={<ArrowForwardIcon />}
            size={"lg"}
            bg="transparent"
            color={"white"}
            _hover={{ background: "transparent" }}
            onClick={() => onChangeDate(1)}
          />
        </HStack>
      </div>
      {!isConnected && (
        <>
          <VStack
            pos={"absolute"}
            top={"50%"}
            left={"50%"}
            transform={"translate(-50%,-50%)"}
            opacity={0.5}
          >
            <WarningTwoIcon boxSize={"40px"} />
            <p>Pas de connexion internet</p>
          </VStack>
        </>
      )}
      {!loading && isConnected && (
        <div className="scroll-section">
          {items.map((item, index) =>
            !item.is_course ? (
              <div key={index} className="no-course"></div>
            ) : (
              <div key={index}>
                <Stat>
                  <StatLabel>{item.location}</StatLabel>
                  <StatNumber>{item.summary}</StatNumber>
                  <StatHelpText mb='20px'>{item.time_info}</StatHelpText>
                </Stat>
                <ItemButtons item={item} storage={storage} setReminder={onChangeReminder} />
              </div>
            )
          )}
        </div>
      )}
      {loading && isConnected && (
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
      <Suspense>
        <EditModal
          open={modalOpen}
          storage={storage}
          resourceId={pageId ?? RESOURCE_ID_NONE}
          date={pageDate ?? new Date()}
          setOpen={setOpenModal}
          setPath={setPath}
          setStorage={setStorage}
        />
      </Suspense>
    </div>
  );
};
