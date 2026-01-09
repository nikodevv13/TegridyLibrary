import {useEffect, useRef} from "react";

export interface InfiniteListProps<T> {
    items: T[],
    fetchNextItems: () => Promise<unknown>,
}

export default function InfiniteList<T>({items, fetchNextItems }: InfiniteListProps<T>) {
    const endItemListRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(async (entries) => {
            if (entries[0].isIntersecting) {
                await fetchNextItems();
            }
        });
        if (endItemListRef.current)
            observer.observe(endItemListRef.current);

        return () => observer.disconnect();
    }, [fetchNextItems]);

    return (
        <>
            {items}
            <div ref={endItemListRef} className="hidden max-h-[1px]"/>
        </>
    )
}