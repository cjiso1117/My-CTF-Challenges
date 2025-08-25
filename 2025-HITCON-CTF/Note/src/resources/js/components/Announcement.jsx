import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Label, TextInput, Textarea } from 'flowbite-react';
import { HiPlus, HiSave, HiX } from 'react-icons/hi';
import normalizeJsonData from '../utils/index';
import Loading from './Loading';

function Announcement() {
    const [ready, setReady] = useState(false);
    const [announcements, setAnnouncements] = useState([]);
    const navigate = useNavigate();

    // Fetch notes from the backend
    const fetchAnnouncements = async () => {
        try {
            const response = await fetch(window.origin + '/api/announcements');
            const jsonData = await response.json();
            const normalizedAnnouncements = normalizeJsonData(jsonData);
            setAnnouncements(normalizedAnnouncements);
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    // Effect to check for auth and fetch notes
    useEffect(() => {
        setReady(false);
        fetchAnnouncements();
        setReady(true);
    }, [navigate]);

    if (!ready) {
        return <Loading />
    }

    return (
        <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Announcements</h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Please read carefully...
                        </p>
                    </div>
                </div>

                {/* Announcement Grid */}
                {announcements.length > 0 ? (
                    <div className="space-y-4">
                        {announcements.map((announcement, index) => (
                            <Card href={`/api/announcement/${announcement.name}`} key={index} className="w-full hover:shadow-lg transition-shadow duration-200 flex flex-col">
                                <div className="flex-grow">
                                    <div className="flex justify-between mb-3">
                                        <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white line-clamp-2">
                                            {announcement.title}
                                        </h5>

                                    </div>

                                    <p className="font-normal text-gray-700 dark:text-gray-400 mb-4 line-clamp-4"
                                    >
                                        {announcement.content}
                                    </p>
                                </div>

                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="text-center py-12">
                        <div className="flex flex-col items-center">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                                No announcement yet
                            </h3>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}

export default Announcement;
