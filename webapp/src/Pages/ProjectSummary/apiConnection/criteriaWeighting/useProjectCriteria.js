import { useEffect } from "react";

const useProjectCriteria = (project, setCriteria) => {
    useEffect(() => {
        if (project && project.criteria) {
            const updatedCriteria = project.criteria.map(criterion => ({
                ...criterion,
            }));
            setCriteria(updatedCriteria);
        }
    }, [project, setCriteria]);
}

export default useProjectCriteria;
