export const submitVendors = async (projectId, vendorData, url) => {
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(vendorData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        return { status: response.status, message: 'Vendors submitted successfully' };

    } catch (error) {
        console.error('Error submitting the vendors:', error);
        throw error;
    }
}
