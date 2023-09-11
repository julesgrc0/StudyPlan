import { Select, Button, Kbd, Heading } from "@chakra-ui/react";
import { useCallback, useState } from "react";


import "../styles/select.scss";
import { DEFAULT_STORAGE, PageAnimationType } from "../def";
import logo from '../../assets/logo.svg'
import tree from '../../assets/tree.json'

// const tree: TreeItem = (await import('../../assets/tree.json')).default;

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
    onGoBack?: () => void;
};


const TreeSelection = ({
    tree,
    resourceId,
    setResourceId,
    onGoBack
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
                {onGoBack !== undefined && <Button
                    className="select-btn"
                    onClick={onGoBack}>
                    Retour
                </Button>}
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
                onGoBack={undefined}
            />
        </>
    );
};

export default ({ storage, setStorage, setPath }: SelectionProps) => {
    const [resourceId, setResourceId] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);

    const onGoBack = useCallback(()=>{
        setResourceId(0);
        setLoading(false);
        setStorage(DEFAULT_STORAGE);
        setPath("/", PageAnimationType.REVERSE);
    }, [setPath, setResourceId, setLoading, setStorage])

    const onValidate = useCallback(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStorage({ ...storage, resourceId });
            setPath(`/planning/${resourceId}/${new Date().getTime()}`, PageAnimationType.DEFAULT)
        }, 500);
    }, [resourceId, setPath]);

    return (
        <div className="selection">
            <img src={logo} className='logo' />
            <div className="main">
                <Heading  mb='30px' size='lg' textAlign={"center"} >
                    Selectionner votre classe
                </Heading>
                <TreeSelection
                    tree={tree}
                    resourceId={resourceId}
                    setResourceId={setResourceId}
                    onGoBack={onGoBack}
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
