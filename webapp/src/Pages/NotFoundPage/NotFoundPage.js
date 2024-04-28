import React from "react";
import "./NotFoundPage.css";

function NotFoundPage() {
    return (
        <div className={"not-found-page--outer-container"}>
            <div className={"not-found-page--inner-container"}>
                <h1 className={"Not-Found-404"}>
                    404 Not Found
                </h1>
                <p className={"Not-Found-404--subtitle"}>
                    The page you are looking for does not exist.
                </p>
            </div>
        </div>
    );
}

export default NotFoundPage;