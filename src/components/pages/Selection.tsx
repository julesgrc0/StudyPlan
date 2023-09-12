import { Select, Button, Kbd, Heading } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

import {
    PageAnimationType,
    RESOURCE_ID_NONE,
    SelectionProps,
    StorageData,
    TreeItem,
    TreeSelectionProps,
} from "../def";

import logo from "../../assets/logo.svg";
import tree from "../../assets/tree.json";

import "../styles/select.scss";

// const tree: TreeItem = (await import('../../assets/tree.json')).default;

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
                <Select value={value} onChange={(e) => setValue(e.target.value)} disabled={resourceId !== RESOURCE_ID_NONE}>
                    {Object.keys(tree).map((key: string, index: number) => (
                        <option key={index} value={key}>
                            {key}
                        </option>
                    ))}
                </Select>
                {resourceId === RESOURCE_ID_NONE && (
                    <Button
                        bg="black"
                        colorScheme="blackAlpha"
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
                    setResourceId(RESOURCE_ID_NONE);
                    setSelected(undefined);
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

    useEffect(() => {
        setResourceId((storage as StorageData).resourceId);
    }, [storage]);

    const onValidate = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStorage({ ...storage, resourceId });
            setPath(
                `/planning/${resourceId}/${new Date().getTime()}`,
                PageAnimationType.DEFAULT
            );
        }, 500);
    }, [resourceId, setPath]);

    return (
        <div className="selection">
            <img src={logo} className="logo" />
            <div className="main">
                <Heading mb="30px" size="lg" textAlign={"center"}>
                    Selectionner votre classe
                </Heading>
                <TreeSelection
                    tree={tree}
                    resourceId={resourceId}
                    setResourceId={setResourceId}
                />
                
                {resourceId !== RESOURCE_ID_NONE && (
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
                {resourceId !== RESOURCE_ID_NONE && (
                    <Button
                        className="select-btn"
                        colorScheme='gray'
                        onClick={()=>{
                            setResourceId(RESOURCE_ID_NONE);
                        }}
                    >
                        Retour
                    </Button>
                )}
            </div>
        </div>
    );
};
