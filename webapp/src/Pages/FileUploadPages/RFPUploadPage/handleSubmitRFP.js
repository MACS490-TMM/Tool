
const handleSubmitRFP = async (projectId, file) => {
    if (!file) {
        throw new Error('No file selected');
    }

    const formData = new FormData();
    formData.append('file', file); // 'file' is the key expected on the server

    const response = await fetch(`http://localhost:8080/projects/${projectId}/files/RFP/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
    }

    return response.text();
};

export default handleSubmitRFP;
