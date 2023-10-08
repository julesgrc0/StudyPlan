import { useState } from "react";
import {
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    VStack,
    Divider,
} from "@chakra-ui/react";
import { SingleDatepicker } from "chakra-dayzed-datepicker";
import {
    DEFAULT_STORAGE,
    EditModalProps,
    PageAnimationType,
} from "../../def";
import { removeNotification } from "../../util";

const EditModal = ({
    open,
    date,
    resourceId,
    storage,
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

                                Object.keys(storage.reminders).map(key => removeNotification(storage.reminders[key]))
                                
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


export default EditModal;