import { Spinner } from "flowbite-react";

function Loading() {
    return (
        <div className="flex-1 flex justify-center items-center">
            <div className="text-center l">
                <Spinner size="xl" />
                <span className="pl-3 text-2xl">Loading...</span>
            </div>
        </div>
    )
}

export default Loading;