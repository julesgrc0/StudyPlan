import { Select, Button, Kbd, Heading } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import Logo from '../../assets/logo.svg'

import "../styles/select.scss";
import { PageAnimationType } from "../def";

type SelectionProps = {
    storage: object;

    setStorage: (value: object) => void;
    setPath: (path: string, type: PageAnimationType) => void;
};

type TreeItem = {
    [key: string]: TreeItem | number;
};

type TreeSelectionProps = {
    tree: TreeItem;
    resourceId: number;
    setResourceId: (id: number) => void;
};

const tree: TreeItem = {
    ISTIC: {
        "L1-L2 Portail ISTN": {
            "License 1": {
                "Parcours Défi": 2898,
                "Parcours LAS": 1,

                "Classique G1": 1,
                "Classique G10": 1,
                "Classique G2": 1,
                "Classique G3": 2898,
                "Classique G4": 1,
                "Classique G5": 1,

                "Aménagé G6": 1,
                "Aménagé G7": 1,
                "Aménagé G8": 1,
            },
            "License 1-2": {},
            "License 2": {},
        },
    },
    ESIR: {},
};

const TreeSelection = ({
    tree,
    resourceId,
    setResourceId,
}: TreeSelectionProps) => {
    const [selected, setSelected] = useState<TreeItem | undefined>(undefined);
    const [value, setValue] = useState<string>(Object.keys(tree)[0]);

    if (selected === undefined) {
        return (
            <>
                <Select value={value} onChange={(e) => setValue(e.target.value)}>
                    {Object.keys(tree).map((key: string, index: number) => (
                        <option key={index} value={key}>
                            {key}
                        </option>
                    ))}
                </Select>
                {resourceId == 0 && (
                    <Button
                        className="select-btn"
                        onClick={() => {
                            if (value === undefined || value.length <= 0) return;

                            if (typeof tree[value] == "number") {
                                setResourceId(tree[value] as number);
                            } else {
                                setSelected(tree[value] as TreeItem);
                            }
                        }}
                    >
                        Selectionner
                    </Button>
                )}
            </>
        );
    }
    return (
        <>
            <Button
                className="back"
                bg="transparent"
                _hover={{ background: "transparent" }}
                mr="2px"
                p="0px"
                size={"sm"}
                onClick={() => {
                    setResourceId(0)
                    setSelected(undefined)
                }}
            >
                <Kbd>{value}</Kbd>
            </Button>
            <TreeSelection
                tree={selected}
                resourceId={resourceId}
                setResourceId={setResourceId}
            />
        </>
    );
};

export default ({ storage, setStorage, setPath }: SelectionProps) => {
    const [resourceId, setResourceId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const onValidate = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStorage({ ...storage, resourceId });
            setPath(`/planning/${resourceId}/${new Date().getTime()}`, PageAnimationType.DEFAULT)
        }, 500);
    }, [resourceId, setPath])
    return (
        <div className="selection">
            <img src={Logo} className='logo' />
            <div className="main">
                <Heading  mb='30px' size='lg' textAlign={"left"} >
                    Selectionner votre classe
                </Heading>
                <TreeSelection
                    tree={tree}
                    resourceId={resourceId}
                    setResourceId={setResourceId}
                />
                {resourceId != 0 && (
                    <Button
                        className="select-btn"
                        bg="black"
                        colorScheme="blackAlpha"
                        onClick={onValidate}
                        isLoading={loading}
                    >
                        Valider
                    </Button>
                )}
            </div>
        </div>
    );
};
