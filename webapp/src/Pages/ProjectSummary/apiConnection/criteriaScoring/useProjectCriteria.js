import { useEffect } from "react";

const useProjectCriteria = (project, setCriteria) => {
    useEffect(() => {
        if (project && project.criteria) {
            const updatedCriteria = project.criteria.map(criterion => ({
                ...criterion,
                score: criterion.score ? criterion.score : null,
                textExtracted: criterion.textExtracted ? criterion.textExtracted : "",
                comments: criterion.comments ? criterion.comments : ""
            }));
            setCriteria(updatedCriteria);
        }
    }, [project, setCriteria]);
}

export default useProjectCriteria;
