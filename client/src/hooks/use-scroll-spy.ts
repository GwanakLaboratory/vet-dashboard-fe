import { useState, useEffect } from 'react';

export function useScrollSpy(ids: string[], offset: number = 0) {
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            {
                rootMargin: `-${offset}px 0px -50% 0px`,
            }
        );

        ids.forEach((id) => {
            const element = document.getElementById(id);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            ids.forEach((id) => {
                const element = document.getElementById(id);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, [ids, offset]);

    return activeId;
}
