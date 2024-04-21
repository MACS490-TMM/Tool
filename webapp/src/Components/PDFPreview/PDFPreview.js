import React, { useEffect, useState } from 'react';
import './PDFPreview.css';

const PDFViewer = ({ url }) => {
    const [file, setFile] = useState("");

    useEffect(() => {
        const fetchPDF = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',  // Ensures cookies are sent with the request
                });
                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);
                setFile(objectURL);

                return objectURL; // Cleanup
            } catch (error) {
                console.error('Error fetching PDF:', error);
            }
        };

        fetchPDF().then(objectURL => {
            return () => {
                if (objectURL) {
                    URL.revokeObjectURL(objectURL); // Cleanup the objectURL
                }
            };
        });
    }, [url]);

    return (
        <div className={"pdf-viewer__outer-container"}>
            <iframe title={"title"} src={file} className={"pdf-iframe"}/>
        </div>
    );
};

export default PDFViewer;
