import {  Select, Button } from "@chakra-ui/react"
import { useState } from 'react'

import '../styles/select.scss'

type SelectionProps = {
    setPath: (path: string) => void;
}

type TreeItem = {
    [key: string]: TreeItem | number
}

type TreeSelectionProps = {
    tree: TreeItem;
    setResourceId: (id: number) => void
}

const tree: TreeItem = {
    "ISTIC": {
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
            "License 2": {}
        }
    },
    "ESIR": {

    }
};



const TreeSelection = ({ tree, setResourceId }: TreeSelectionProps) => {
    const [selected, setSelected] = useState<TreeItem | undefined>(undefined);
    const [value, setValue] = useState<string>(Object.keys(tree)[0]);

    return <>
        {!selected && <Select value={value} onChange={(e) => setValue(e.target.value)}>
            {Object.keys(tree).map((key: string, index: number) => <option key={index} value={key}>{key}</option>)}
        </Select>}
        {!selected && <Button onClick={(e) => {
            if (value.length <= 0) return;

            if (typeof tree[value] == "number") {
                setResourceId(tree[value] as number)
            } else {
                setSelected(tree[value] as TreeItem)
            }
        }}>Selectionner</Button>}
        {selected !== undefined && <Button onClick={() => setSelected(undefined)}>{"<"} {value}</Button>}
        {selected !== undefined && <TreeSelection tree={selected} setResourceId={setResourceId} />}
    </>
}

export const Selection = ({ setPath }: SelectionProps) => {
    const [resourceId, setResourceId] = useState<number>(0);

    return <div className="selection">
        <TreeSelection tree={tree} setResourceId={setResourceId} />
        {resourceId != 0 && <Button onClick={() => setPath(`/planning`)}>Valider</Button>}
    </div>
}