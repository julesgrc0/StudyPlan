import { Select, Button, Kbd, Heading } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import "../styles/select.scss";

type SelectionProps = {
    setPath: (path: string, rev: boolean) => void;
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
                "Parcours Défi": 2333,
                "Parcours LAS": 2336,

                "Classique G1": 2873,
                "Classique G10": 2876,
                "Classique G2": 2879,
                "Classique G3": 2882,
                "Classique G4": 2885,
                "Classique G5": 2888,

                "Aménagé G6": 2864,
                "Aménagé G7": 2867,
                "Aménagé G8": 2870,
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

export const Selection = ({ setPath }: SelectionProps) => {
    const [resourceId, setResourceId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const onValidate = useCallback(()=>{
        setLoading(true);
        setTimeout(()=>{
            setLoading(false);
            setPath(`/planning/${resourceId}/${new Date().getTime()}`, false)
        }, 500);
    }, [resourceId, setPath])
    return (
        <div className="selection">
            <div className="main">
                <Heading mb="50px" textAlign={"center"}>
                    Trouvez votre classe
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
