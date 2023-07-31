import { atom, useSetAtom } from "jotai";


type TSortBy = "relevance" | "date" | "citations";
export type TBrainRegion = { id: string, title: string };
export type TLiteratureAtom = {
    query: string;
    cretiria: string[];
    sortBy: TSortBy;
    brainRegions: TBrainRegion[];
    categories: string[];
    publicationDate: string;
    numberOfCitations: string;
    journal: string;
    authors: string;
    country: string;
}
export type TLiteratureOptions = keyof TLiteratureAtom;

const literatureAtom = atom<TLiteratureAtom>({
    query: "",
    cretiria: [],
    sortBy: "relevance",
    brainRegions: [],
    categories: [],
    publicationDate: "",
    numberOfCitations: "",
    journal: "",
    authors: "",
    country: "",
});

function useLiteratureAtom() {
    const setLiteratureState = useSetAtom(literatureAtom);
    const update = (key: TLiteratureOptions, value: string) => {
        setLiteratureState((prev) => ({
            ...prev,
            [key]: value,
        }))
    }
    return update;
}

export { literatureAtom };
export default useLiteratureAtom;