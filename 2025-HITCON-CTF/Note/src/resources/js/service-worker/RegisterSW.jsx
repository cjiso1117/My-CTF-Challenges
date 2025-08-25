import { useEffect, useState } from "react";
import Loading from "../components/Loading";

function RegisterSW({ children }) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let canceled = false;

        async function registerSW() {
            if (!('serviceWorker' in navigator)) {
                if (!canceled) setReady(true);
                return;
            }

            try {
                const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/', });

                registration.addEventListener('updatefound', (event) => {
                    const installingWorker = registration.installing;
                    if (installingWorker) {
                        installingWorker.addEventListener('statechange', () => {
                            if (installingWorker.state === 'activated' && !canceled) {
                                console.log('Service worker activated');
                                setReady(true);
                            }
                        });
                    }
                });
                if (!canceled && registration.active?.state === 'activated') setReady(true);
            } catch (err) {
                console.warn('Service worker registration failed:', err);
                if (!canceled) setReady(true);
            }
        }
        registerSW();

        return () => {
            canceled = true;
        };
    }, []);

    if (!ready) {
        return <Loading />
    }

    return children;
}

export default RegisterSW