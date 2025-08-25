import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'flowbite-react';
import { HiOutlineHome, HiOutlineDocumentText, HiOutlineEmojiSad } from 'react-icons/hi';

function NotFound() {
    return (
        <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <Card className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full">
                            <HiOutlineEmojiSad className="w-16 h-16 text-gray-400" />
                        </div>
                    </div>

                    <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-4">
                        404
                    </h1>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Page Not Found
                    </h2>

                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Oops! The page you're looking for doesn't exist or has been moved.
                        Let's get you back on track.
                    </p>

                    <div className="space-y-4">
                        <Link to="/" className="block">
                            <Button size="lg" className="w-full">
                                <HiOutlineHome className="mr-2 h-5 w-5" />
                                Go Home
                            </Button>
                        </Link>

                        <Link to="/note" className="block">
                            <Button color="alternative" size="lg" className="w-full">
                                <HiOutlineDocumentText className="mr-2 h-5 w-5" />
                                View My Notes
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default NotFound;
