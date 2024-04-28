import {useEffect, useState} from "react";

const useFetchVendors = (url = 'http://localhost:8080/vendors') => {
    const [vendors, setVendors] = useState([]);
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch vendors');
                }

                const data = await response.json();

                setVendors(Array.isArray(data) ? data : []);

            } catch (error) {
                console.error('Error fetching vendors:', error);
                setVendors([]);
            }
        };

        fetchVendors().then(r => console.log('Vendors fetched:', r));
    }, [url]);

    return vendors;
}

export default useFetchVendors;